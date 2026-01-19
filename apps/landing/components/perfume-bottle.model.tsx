"use client";

import React, { Suspense, useMemo } from "react";
import { useGLTF, useProgress, Html } from "@react-three/drei";
import { Mesh } from "three";
import * as THREE from "three";
// Preload the model for better UX
useGLTF.preload("/assets/3d-models/perfume-bottle/perfume_bottle.glb");

type PrimitiveProps = Omit<React.ComponentProps<"primitive">, "object">;

export function PerfumeBottleModel(props: PrimitiveProps) {
  const { scene } = useGLTF(
    "/assets/3d-models/perfume-bottle/perfume_bottle.glb"
  );

  // Clone so multiple instances can exist
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  clonedScene.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.material = (mesh.material as THREE.Material).clone();
    }
  });

  return <primitive {...props} object={clonedScene} />;
}

/**
 * Fullscreen loading overlay for 3D assets.
 * Uses drei's internal loading manager → zero extra listeners.
 */
function ModelLoader() {
  return (
    <Html center>
      <div
        style={{
          padding: "12px 16px",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        Loading assets
      </div>
    </Html>
  );
}

PerfumeBottleModel.ModelLoader = ModelLoader;

export default PerfumeBottleModel;
