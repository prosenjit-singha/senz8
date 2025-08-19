import PerfumeBottleModel from "@/components/perfume-bottle.model";
import DirectionalLight from "@/components/threejs/directional";
import { Environment } from "@react-three/drei";
import React from "react";

const BottlesScene = () => {
  return (
    <group position={[0, -1, 0]}>
      {/* <Environment preset="studio" background={false} /> */}
      <DirectionalLight
        position={[0, 2.5, 0]}
        size={3}
        intensity={800}
        useHelper
      />
      <DirectionalLight
        position={[-3, 2.5, 0]}
        size={3}
        intensity={200}
        useHelper
      />
      <DirectionalLight
        position={[3, 2.5, 0]}
        size={3}
        intensity={800}
        useHelper
      />
      <PerfumeBottleModel position={[0, 0, 0]} scale={20} />
      <PerfumeBottleModel position={[-1, 0, -0.55]} scale={20} />
      <PerfumeBottleModel position={[1, 0, -0.55]} scale={20} />
      {/* <PerfumeBottleModel position={[0, 0, -1.15]} scale={20} /> */}
      <PerfumeBottleModel position={[2, 0, -1.15]} scale={20} />
      <PerfumeBottleModel position={[-2, 0, -1.15]} scale={20} />
    </group>
  );
};

export default BottlesScene;
