"use client";
import * as THREE from "three";
const { GUI } = await import("three/addons/libs/lil-gui.module.min.js");

import React, { useRef, useMemo } from "react";
import { extend, useThree, useLoader, useFrame } from "@react-three/fiber";
import waterTexture from "@/public/assets/textures/waternormals.jpg";
// import { OrbitControls, Sky } from "@react-three/drei";
import { Water } from "three-stdlib";
import Sky, { SkyParameters } from "@/components/threejs/sky";
extend({ Water });

function Ocean() {
  const [skyParams, setSkyParams] = React.useState<SkyParameters>({
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    inclination: 0.6,
    azimuth: 180,
    exposure: 0.5,
  });

  const handleParametersChange = (params: SkyParameters) => {
    console.log("Sky parameters changed:", params);
    setSkyParams(params);
  };

  const ref = useRef(null);
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(THREE.TextureLoader, waterTexture.src);
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 1,
      fog: false,
      // @ts-ignore
      format: gl.encoding,
    }),
    [waterNormals]
  );

  useFrame((state, delta) => {
    if (ref.current) {
      // @ts-ignore
      ref.current.material.uniforms.time.value += delta;
    }
  });
  return (
    <>
      {/* <SkyMesh /> */}
      {/* @ts-ignore */}
      <water
        position={[0, -1, 0]}
        ref={ref}
        args={[geom, config]}
        rotation-x={-Math.PI / 2}
      />
      ;
    </>
  );
}

export default Ocean;
