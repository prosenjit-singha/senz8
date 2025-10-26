"use client";
import * as THREE from "three";

import React, { useRef, useMemo } from "react";
import { extend, useThree, useLoader, useFrame } from "@react-three/fiber";
import waterTexture from "@/public/assets/textures/waternormals.jpg";
// import { OrbitControls, Sky } from "@react-three/drei";
import { Water } from "three-stdlib";
extend({ Water });

function Ocean() {
  const ref = useRef(null);
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(THREE.TextureLoader, waterTexture.src);
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 1000,
      textureHeight: 1000,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 0.2,
      fog: false,
      // @ts-expect-error Mathematical operation can cause error
      format: gl.encoding,
    }),
    [waterNormals]
  );

  useFrame((state, delta) => {
    if (ref.current) {
      const speedFactor = 0.2; // Adjust this value to control the speed
      // @ts-expect-error Mathematical operation can cause error
      ref.current.material.uniforms.time.value += delta * speedFactor;
    }
  });
  return (
    <>
      {/* <SkyMesh /> */}
      {/* @ts-expect-error water doesn't have any type definition */}
      <water
        position={[0, -1.3, 0]}
        ref={ref}
        args={[geom, config]}
        rotation-x={-Math.PI / 2}
      />
    </>
  );
}

export default Ocean;
