"use client";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
import { WaterMaterial } from "./water-material";
import { extend } from "@react-three/fiber";
import {
  WIDTH,
  BOUNDS,
  BOUNDS_HALF,
  smoothFragmentShader,
  readWaterLevelFragmentShader,
  shaderChange,
} from "@/helpers/threejs/water-shaders";
import {
  WaterSimulationProps,
  EffectController,
  DuckObject,
  GPUComputationState,
} from "@/types/water-ripple.types";
extend({ WaterMaterial });

const NUM_DUCK = 12;

export const WaterSimulation: React.FC<WaterSimulationProps> = ({
  width = WIDTH,
  bounds = BOUNDS,
  mouseSize = 0.2,
  mouseDeep = 0.01,
  viscosity = 0.93,
  speed = 5,
  ducksEnabled = true,
}) => {
  const { gl, scene, camera, size } = useThree();
  const [gpuState, setGpuState] = useState<GPUComputationState>({
    gpuCompute: null,
    heightmapVariable: null,
    smoothShader: null,
    readWaterLevelShader: null,
    readWaterLevelRenderTarget: null,
    readWaterLevelImage: null,
    tmpHeightmap: null,
  });

  const [mousedown, setMousedown] = useState<boolean>(false);
  const [mouseCoords, setMouseCoords] = useState<THREE.Vector2>(new THREE.Vector2());
  const [frame, setFrame] = useState<number>(0);
  const [currentDucksEnabled, setCurrentDucksEnabled] = useState<boolean>(ducksEnabled);

  const waterMeshRef = useRef<THREE.Mesh>(null);
  const meshRayRef = useRef<THREE.Mesh>(null);
  const ducksRef = useRef<DuckObject[]>([]);
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mousePos = useRef<THREE.Vector2>(new THREE.Vector2(10000, 10000));
  const waterNormal = useRef<THREE.Vector3>(new THREE.Vector3());
  const simplex = useRef<SimplexNoise>(new SimplexNoise());

  const effectController = useRef<EffectController>({
    mouseSize,
    mouseDeep,
    viscosity,
    speed,
    ducksEnabled,
    wireframe: false,
    shadow: false,
  });

  useEffect(() => {
    initWater();
  }, [gl]);

  const initWater = (): void => {
    const gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, gl);
    const heightmap0 = gpuCompute.createTexture();
    fillTexture(heightmap0);

    const heightmapVariable = gpuCompute.addVariable(
      "heightmap",
      shaderChange.heightmap_frag,
      heightmap0
    );
    gpuCompute.setVariableDependencies(heightmapVariable, [heightmapVariable]);

    heightmapVariable.material.uniforms.mousePos = { value: mousePos.current };
    heightmapVariable.material.uniforms.mouseSize = {
      value: effectController.current.mouseSize,
    };
    heightmapVariable.material.uniforms.viscosity = {
      value: effectController.current.viscosity,
    };
    heightmapVariable.material.uniforms.deep = {
      value: effectController.current.mouseDeep,
    };
    heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed(1);

    const error = gpuCompute.init();
    if (error) console.error(error);

    const smoothShader = gpuCompute.createShaderMaterial(smoothFragmentShader, {
      smoothTexture: { value: null },
      resolution: { value: new THREE.Vector2(WIDTH, WIDTH) },
    });

    const readWaterLevelShader = gpuCompute.createShaderMaterial(readWaterLevelFragmentShader, {
      point1: { value: new THREE.Vector2() },
      levelTexture: { value: null },
      resolution: { value: new THREE.Vector2(WIDTH, WIDTH) },
    });
    readWaterLevelShader.defines.WIDTH = WIDTH.toFixed(1);
    readWaterLevelShader.defines.BOUNDS = BOUNDS.toFixed(1);

    const readWaterLevelImage = new Uint8Array(4 * 1 * 4);
    const readWaterLevelRenderTarget = new THREE.WebGLRenderTarget(4, 1, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      depthBuffer: false,
    });

    setGpuState({
      gpuCompute,
      heightmapVariable,
      smoothShader,
      readWaterLevelShader,
      readWaterLevelRenderTarget,
      readWaterLevelImage,
      tmpHeightmap: gpuCompute.getCurrentRenderTarget(heightmapVariable).texture,
    });
  };

  const fillTexture = (texture: THREE.DataTexture): void => {
    const waterMaxHeight = 0.1;
    const pixels = texture.image.data as Float32Array;

    let p = 0;
    for (let j = 0; j < WIDTH; j++) {
      for (let i = 0; i < WIDTH; i++) {
        const x = (i * 128) / WIDTH;
        const y = (j * 128) / WIDTH;

        let multR = waterMaxHeight;
        let mult = 0.025;
        let r = 0;
        for (let k = 0; k < 15; k++) {
          r += multR * simplex.current.noise(x * mult, y * mult);
          multR *= 0.53 + 0.025 * k;
          mult *= 1.25;
        }
        pixels[p + 0] = r;
        pixels[p + 1] = pixels[p + 0] as number;
        pixels[p + 2] = 0;
        pixels[p + 3] = 1;
        p += 4;
      }
    }
  };

  useFrame((state, delta) => {
    if (!gpuState.gpuCompute || !gpuState.heightmapVariable) return;

    // Raycast for mouse interaction
    if (mousedown && meshRayRef.current) {
      raycaster.current.setFromCamera(mouseCoords, camera);
      const intersects = raycaster.current.intersectObject(meshRayRef.current);

      if (intersects.length > 0) {
        const point = intersects[0]?.point;
        mousePos.current.set(point?.x as number, point?.z as number);
      } else {
        mousePos.current.set(10000, 10000);
      }
    } else {
      mousePos.current.set(10000, 10000);
    }

    // Update simulation
    if (frame >= 7 - effectController.current.speed) {
      gpuState.gpuCompute.compute();
      const newHeightmap = gpuState.gpuCompute.getCurrentRenderTarget(
        gpuState.heightmapVariable
      ).texture;

      setGpuState((prev) => ({ ...prev, tmpHeightmap: newHeightmap }));

      if (waterMeshRef.current && waterMeshRef.current.material instanceof WaterMaterial) {
        // @ts-expect-error: Property 'heightmap' does not exist on type 'MeshStandardMaterial'.
        waterMeshRef.current.material.heightmap = newHeightmap;
      }

      if (currentDucksEnabled) {
        duckDynamics();
      }

      setFrame(0);
    } else {
      setFrame((prev) => prev + 1);
    }
  });

  const duckDynamics = (): void => {
    if (!gpuState.readWaterLevelShader || !gpuState.tmpHeightmap || !gpuState.gpuCompute) return;

    if (gpuState.readWaterLevelShader.uniforms.levelTexture) {
      gpuState.readWaterLevelShader.uniforms.levelTexture.value = gpuState.tmpHeightmap;
    }

    ducksRef.current.forEach((duck) => {
      if (duck) {
        const u = (0.5 * duck.position.x) / BOUNDS_HALF + 0.5;
        const v = 1 - ((0.5 * duck.position.z) / BOUNDS_HALF + 0.5);

        gpuState.readWaterLevelShader?.uniforms?.point1?.value.set(u, v);
        gpuState.gpuCompute?.doRenderTarget(
          gpuState.readWaterLevelShader!,
          gpuState.readWaterLevelRenderTarget!
        );

        gl.readRenderTargetPixels(
          gpuState.readWaterLevelRenderTarget!,
          0,
          0,
          4,
          1,
          gpuState.readWaterLevelImage!
        );
        const pixels = new Float32Array(gpuState.readWaterLevelImage!.buffer);

        waterNormal.current.set(pixels[1]!, 0, -pixels[2]!);
        duck.position.y = pixels[0]!;

        waterNormal.current.multiplyScalar(0.01);
        duck.userData.velocity.add(waterNormal.current);
        duck.userData.velocity.multiplyScalar(0.998);
        duck.position.add(duck.userData.velocity);

        // Boundary checks
        const limit = BOUNDS_HALF - 0.2;
        const decal = 0.001;

        if (duck.position.x < -limit) {
          duck.position.x = -limit + decal;
          duck.userData.velocity.x *= -0.3;
        } else if (duck.position.x > limit) {
          duck.position.x = limit - decal;
          duck.userData.velocity.x *= -0.3;
        }

        if (duck.position.z < -limit) {
          duck.position.z = -limit + decal;
          duck.userData.velocity.z *= -0.3;
        } else if (duck.position.z > limit) {
          duck.position.z = limit - decal;
          duck.userData.velocity.z *= -0.3;
        }
      }
    });
  };

  const handlePointerMove = (event: React.PointerEvent): void => {
    const dom = gl.domElement;
    setMouseCoords(
      new THREE.Vector2(
        (event.clientX / dom.clientWidth) * 2 - 1,
        -(event.clientY / dom.clientHeight) * 2 + 1
      )
    );
  };

  const handlePointerDown = (): void => {
    setMousedown(true);
  };

  const handlePointerUp = (): void => {
    setMousedown(false);
  };

  return (
    <>
      <mesh ref={waterMeshRef} rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1]} />
        {/* @ts-ignore */}
        <waterMaterial
          color={0x001e0f}
          metalness={0.9}
          roughness={0}
          transparent={true}
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* mouse ray */}
      <mesh ref={meshRayRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[BOUNDS, BOUNDS, 1, 1]} />
        <meshBasicMaterial color={"#ffffff"} />
      </mesh>

      {/* pool border */}
      {/* <mesh rotation={[-Math.PI * 0.5, Math.PI * 0.25, 0]}>
        <torusGeometry args={[4.2, 0.1, 12, 4]} />
        <meshStandardMaterial color={"0x908877"} roughness={0.2} />
      </mesh> */}

      {/* <directionalLight position={[-1, 2.6, 1.4]} intensity={4.0} /> */}
      <OrbitControls />
      {/* <Stats /> */}

      <group
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <mesh visible={false}>
          <planeGeometry args={[size.width, size.height]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </>
  );
};
