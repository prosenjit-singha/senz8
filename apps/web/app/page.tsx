"use client";
import Camera from "@/components/threejs/camera";
import { GizmoHelper, GizmoViewcube, GizmoViewport } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import LightRays from "@workspace/next-ui/components/light-rays-bg";
import Navbar from "@workspace/next-ui/components/navbar";
import React from "react";
import HomeHeroContent from "./_components/content";
import BottlesScene from "./_components/bottles";
import PageLoader from "@workspace/next-ui/components/page-loader";
import { useGlobalState } from "@/stores/global.store";

const bottlePosition = [2, 1, 0] as [number, number, number];

export default function Page() {
  const [isCanvasReady, setIsCanvasReady] = React.useState(false);

  const { state, actions } = useGlobalState();

  return (
    <>
      <Navbar />
      <PageLoader isLoading={!isCanvasReady} />

      {/* <PageLoader /> */}
      {/* <LightRays className="z-[-1] fixed top-0 left-0 w-full h-full" /> */}

      <div className="fixed z-[-1] w-full h-full">
        <div className="h-full w-full relative">
          {/* <div
            data-slot="window-light"
            className="absolute top-[45%] left-1/2 w-20 h-30 grid grid-cols-2 gap-4 -translate-x-1/2 -translate-y-1/2 opacity-80 blur-md -skew-y-12"
          >
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="bg-white" />
            ))}
          </div> */}
          <Canvas shadows onCreated={() => setIsCanvasReady(true)}>
            {/* Ambient light for subtle fill */}

            <Camera
              position={[0, 1, 6]}
              fov={50}
              lookAt={[0, 0.5, 0]}
              useOrbitControls
            />
            <ambientLight intensity={80} />
            <BottlesScene />

            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport />
              {/* <GizmoViewcube /> */}
            </GizmoHelper>
            {/* <mesh position={[0, 0, -1]}>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#000000" />
            </mesh> */}
            {/* <gridHelper args={[20, 20, "red"]} />
            <axesHelper scale={2} args={[10]} /> */}
          </Canvas>
        </div>
      </div>

      <main className="px-page-margin-auto flex flex-col min-h-[calc(100svh-100px)]">
        <HomeHeroContent />

        <button className="px-3 py-2 rounded-3xl border-golden mx-auto mt-auto text-golden-linear-gradient shadow-xl shadow-transparent hover:shadow-amber-500/10 text-shadow-lg hover:text-shadow-amber-400/10 cursor-pointer mb-20">
          Shop Now
        </button>
      </main>
    </>
  );
}

/**
 *             <group position={bottlePosition}>
              <DirectionalLight
                position={[0, 1, 0]}
                intensity={50}
                useHelper={showHelpers}
                pointAt={bottlePosition}
              />
              <DirectionalLight
                position={[1, 0, 0]}
                intensity={60}
                useHelper={showHelpers}
                pointAt={bottlePosition}
              />
              <DirectionalLight
                position={[-1, 0, 0]}
                intensity={60}
                useHelper={showHelpers}
                pointAt={bottlePosition}
              />
              <DirectionalLight
                position={[-0.5, 0.5, -1]}
                intensity={50}
                useHelper={showHelpers}
                pointAt={bottlePosition}
              />
              <pointLight position={[0, 1, 2]} intensity={100} />
    
              <Spotlight
                // castShadow
                position={[2, 3, 1]}
                intensity={100}
                angle={Math.PI / 5}
                pointAt={[3, 2.5, 0]}
                penumbra={0.9} // softness at edge
                decay={1} // light falloff
                distance={100} // how far it reaches
                useHelper={showHelpers}
              />
            </group>
 */

{
  /* <PerfumeBottleModel position={[2, 0, 0]} scale={20} /> */
}
