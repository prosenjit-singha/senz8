import PerfumeBottleModel from "@/components/perfume-bottle.model";
import DirectionalLight from "@/components/threejs/directional";
import { useGSAP } from "@gsap/react";
import { useThree } from "@react-three/fiber";
import React, { Suspense } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Camera from "@/components/threejs/camera";
import Ocean from "./oceam-water";

import {
  generateTrianglePositions,
  getArcPositions,
  getPerfectTriangleCount,
} from "@/helpers/threejs/3d-position.helper";
import { useProgress } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

const showHelpers = false;

const INITIAL_EXTRA_BOTTLE_Y_POSITION = -5;
const BOTTLES = [
  {
    modelPath: "",
    id: "bottle-1",
    scale: 20,
  },
  {
    modelPath: "",
    id: "bottle-2",
    scale: 20,
  },
  {
    modelPath: "",
    id: "bottle-3",
    scale: 20,
  },
  {
    modelPath: "",
    id: "bottle-4",
    scale: 20,
  },
  {
    modelPath: "",
    id: "bottle-5",
    scale: 20,
  },
  {
    modelPath: "",
    id: "bottle-6",
    scale: 20,
  },
  {
    modelPath: "",
    id: "bottle-7",
    scale: 20,
  },
];
const INITIAL_BOTTLE_POSITIONS = generateTrianglePositions(
  BOTTLES.length,
  2,
  1
);
const PERFECT_TRIANGLE_BOTTLE_COUNT = getPerfectTriangleCount(BOTTLES.length);
const PERFECT_TRIANGLE_BOTTLES = BOTTLES.slice(
  0,
  PERFECT_TRIANGLE_BOTTLE_COUNT
);

const REMAINING_BOTTLES = BOTTLES.slice(PERFECT_TRIANGLE_BOTTLE_COUNT);

const BottlesScene = ({
  activeSection,
  activeProductIndex,
}: {
  activeSection: string;
  activeProductIndex: number;
}) => {
  const dreiProgress = useProgress();
  // ref to store initial camera state
  const cameraState = React.useRef<{
    position: THREE.Vector3;
    rotation: THREE.Euler;
    fov: number;
  }>(null);

  const bottlesRef = React.useRef<THREE.Group[]>([]);

  const [isFirstAnimationComplete, setIsFirstAnimationComplete] =
    React.useState(false);
  const topLight = React.useRef<THREE.DirectionalLight>(null);
  const leftLight = React.useRef<THREE.DirectionalLight>(null);
  const rightLight = React.useRef<THREE.DirectionalLight>(null);
  const frontLight = React.useRef<THREE.DirectionalLight>(null);

  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const { contextSafe } = useGSAP(
    () => {
      if (isFirstAnimationComplete) {
        const cameraPanTimeline = gsap.timeline({
          defaults: {},
          paused: true,
        });

        cameraPanTimeline.to(camera.position, {
          x: 0,
          y: -5,
          z: 6,
          ease: "none",
          // duration: 3,
          // ease: "power2.inOut",
          onUpdate: () => {
            perspectiveCamera.lookAt(0, 0.5, 0);
            camera.updateProjectionMatrix(); // keep FOV and projection in sync
          },
        });

        // on scroll camera will pan
        // ScrollTrigger.create({
        //   animation: cameraPanTimeline,
        //   trigger: "#hero-section",
        //   start: "top top",
        //   end: "80% top",
        //   scrub: true,
        // });
      } else {
        // animate light
        if (topLight.current) {
          gsap.to(topLight.current, {
            intensity: 800, // target intensity
            duration: 5,
            ease: "power2.inOut",
          });
        }
        if (leftLight.current) {
          gsap.to(leftLight.current, {
            intensity: 200, // target intensity
            duration: 5,
            ease: "power2.inOut",
          });
        }
        if (rightLight.current) {
          gsap.to(rightLight.current, {
            intensity: 500, // target intensity
            duration: 5,
            ease: "power2.inOut",
          });
        }
        // animate camera angle
        perspectiveCamera.position.set(0, 6, 6);
        perspectiveCamera.lookAt(0, 0, 0);
        perspectiveCamera.fov = 50;
        perspectiveCamera.updateProjectionMatrix();
        // gsap.to(camera.position, {
        //   x: 0,
        //   y: 0.5,
        //   z: 6,
        //   duration: 3,
        //   ease: "power2.inOut",
        //   onUpdate: () => {
        //     perspectiveCamera.lookAt(0, 0.5, 0);
        //     camera.updateProjectionMatrix(); // keep FOV and projection in sync
        //   },
        //   onComplete: () => {
        //     console.log("First animation complete");
        //     setIsFirstAnimationComplete(true);
        //   },
        // });

        // animate remaining bottles
        // bottlesRef.current.forEach((bottle, index) => {
        //   console.log({
        //     index,
        //     PERFECT_TRIANGLE_BOTTLE_COUNT,
        //     position: INITIAL_BOTTLE_POSITIONS[index],
        //   });
        //   if (
        //     index >= PERFECT_TRIANGLE_BOTTLE_COUNT &&
        //     INITIAL_BOTTLE_POSITIONS[index]
        //   ) {
        //     gsap.set(bottle.position, {
        //       x: INITIAL_BOTTLE_POSITIONS[index][0],
        //       y: 5,
        //       z: INITIAL_BOTTLE_POSITIONS[index][2],
        //       duration: 1,
        //       ease: "power2.inOut",
        //     });
        //   }
        // });
      }
    },
    { dependencies: [isFirstAnimationComplete] }
  );

  const captureCameraInfo = () => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    cameraState.current = {
      position: camera.position.clone(),
      rotation: camera.rotation.clone(),
      fov: perspectiveCamera.fov,
    };
    return cameraState.current;
  };

  const onPointerEnter = contextSafe(() => {
    const cameraInfo = captureCameraInfo();
    if (isFirstAnimationComplete) {
      gsap.to(camera.position, {
        x: 0,
        y: 1,
        z: 5,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
          perspectiveCamera.lookAt(0, 0.5, 0);
          camera.updateProjectionMatrix(); // keep FOV and projection in sync
        },
      });
    }
  });

  const onPointerLeave = contextSafe(() => {
    if (isFirstAnimationComplete) {
      gsap.to(camera.position, {
        x: 0,
        y: 1,
        z: 6,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
          perspectiveCamera.lookAt(0, 0.5, 0);
          camera.updateProjectionMatrix(); // keep FOV and projection in sync
        },
      });
    }
  });

  useGSAP(
    () => {
      if (activeSection === "products-section" && isFirstAnimationComplete) {
        const positions = getArcPositions({
          totalElements: bottlesRef.current.length,
          gapBetween: 3,
          radius: 8,
          activeIndex: activeProductIndex,
        });
        bottlesRef.current.forEach((bottle, index) => {
          if (positions[index]) {
            gsap.to(bottle.position, {
              x: positions[index].x,
              y: positions[index].y,
              z: positions[index].z,
              duration: 1,
              ease: "power2.inOut",
            });
          }
        });
      } else if (activeSection === "hero-section") {
        bottlesRef.current.forEach((bottle, index) => {
          if (INITIAL_BOTTLE_POSITIONS[index]) {
            if (index < PERFECT_TRIANGLE_BOTTLE_COUNT) {
              gsap.to(bottle.position, {
                x: INITIAL_BOTTLE_POSITIONS[index][0],
                y: INITIAL_BOTTLE_POSITIONS[index][1],
                z: INITIAL_BOTTLE_POSITIONS[index][2],
                duration: 1,
                ease: "power2.inOut",
              });
            } else {
              gsap.to(bottle.position, {
                x: INITIAL_BOTTLE_POSITIONS[index][0],
                y: INITIAL_EXTRA_BOTTLE_Y_POSITION,
                z: INITIAL_BOTTLE_POSITIONS[index][2],
                duration: 1,
                ease: "power2.inOut",
              });
            }
          }
        });
      }
    },
    {
      dependencies: [
        activeSection,
        activeProductIndex,
        isFirstAnimationComplete,
      ],
    }
  );

  useGSAP(
    () => {
      if (dreiProgress.progress === 100) {
        gsap.to(camera.position, {
          x: 0,
          y: 0.5,
          z: 6,
          duration: 3,
          delay: 1.75,
          ease: "power2.inOut",
          onUpdate: () => {
            perspectiveCamera.lookAt(0, 0.5, 0);
            camera.updateProjectionMatrix(); // keep FOV and projection in sync
          },
          onComplete: () => {
            console.log("First animation complete");
            setIsFirstAnimationComplete(true);
          },
        });
      }
    },
    { dependencies: [camera, perspectiveCamera, dreiProgress.progress] }
  );

  return (
    <>
      <Camera
        // position={[0, 1, 6]}
        // fov={50}
        // lookAt={[0, 0.5, 0]}
        useOrbitControls
        focusDistance={5}
      />
      <group
        position={[0, -1.3, 0]}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        {/* <Environment preset="studio" background={false} /> */}
        {/* <DirectionalLight
          ref={topLight}
          position={[0, 2.5, 0]}
          size={3}
          intensity={100}
          useHelper={showHelpers}
        /> */}
        <DirectionalLight
          ref={leftLight}
          position={[-3, 2.5, 0]}
          size={3}
          intensity={0}
          useHelper={showHelpers}
        />
        <DirectionalLight
          ref={rightLight}
          position={[3, 2.5, 0]}
          size={3}
          intensity={0}
          useHelper={showHelpers}
        />
        <DirectionalLight
          ref={frontLight}
          position={[1, 1, 2]}
          size={3}
          intensity={100}
          useHelper={showHelpers}
        />

        <Suspense fallback={<PerfumeBottleModel.ModelLoader />}>
          {PERFECT_TRIANGLE_BOTTLES.map((bottle, index) => (
            <PerfumeBottleModel
              ref={(el: THREE.Group) => {
                bottlesRef.current[index] = el;
              }}
              key={bottle.id}
              position={INITIAL_BOTTLE_POSITIONS[index]}
              scale={bottle.scale}
            />
          ))}
          {REMAINING_BOTTLES.map((bottle, i) => {
            const index = PERFECT_TRIANGLE_BOTTLE_COUNT + i;
            if (INITIAL_BOTTLE_POSITIONS[index]) {
              return (
                <PerfumeBottleModel
                  ref={(el: THREE.Group) => {
                    bottlesRef.current[index] = el;
                  }}
                  key={bottle.id}
                  position={[
                    INITIAL_BOTTLE_POSITIONS[index][0],
                    INITIAL_EXTRA_BOTTLE_Y_POSITION,
                    INITIAL_BOTTLE_POSITIONS[index][2],
                  ]}
                  scale={bottle.scale}
                />
              );
            }
            return null;
          })}
        </Suspense>
      </group>
      <Ocean />
      {/* <WaterSimulation
        mouseSize={0.2}
        mouseDeep={0.01}
        viscosity={0.93}
        speed={5}
        ducksEnabled={true}
      /> */}
    </>
  );
};

export default BottlesScene;
