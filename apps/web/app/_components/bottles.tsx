import PerfumeBottleModel from "@/components/perfume-bottle.model";
import DirectionalLight from "@/components/threejs/directional";
import { useGSAP } from "@gsap/react";
import { useThree } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const showHelpers = false;

const BottlesScene = () => {
  // ref to store initial camera state
  const cameraState = React.useRef<{
    position: THREE.Vector3;
    rotation: THREE.Euler;
    fov: number;
  }>(null);
  const [isFirstAnimationComplete, setIsFirstAnimationComplete] =
    React.useState(false);
  const topLight = React.useRef<THREE.DirectionalLight>(null);
  const leftLight = React.useRef<THREE.DirectionalLight>(null);
  const rightLight = React.useRef<THREE.DirectionalLight>(null);
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

        ScrollTrigger.create({
          animation: cameraPanTimeline,
          trigger: "#hero-section",
          start: "top top",
          end: "80% top",
          scrub: true,
        });
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
        gsap.to(camera.position, {
          x: 0,
          y: 1,
          z: 6,
          duration: 3,
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

  return (
    <>
      {/* <Camera
        position={[0, 1, 6]}
        fov={50}
        lookAt={[0, 0.5, 0]}
        useOrbitControls
      /> */}
      <group
        position={[0, -1, 0]}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        {/* <Environment preset="studio" background={false} /> */}
        <DirectionalLight
          ref={topLight}
          position={[0, 2.5, 0]}
          size={3}
          intensity={0}
          useHelper={showHelpers}
        />
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
        <PerfumeBottleModel position={[0, 0, 0]} scale={20} />
        <PerfumeBottleModel position={[-1, 0, -0.55]} scale={20} />
        <PerfumeBottleModel position={[1, 0, -0.55]} scale={20} />
        {/* <PerfumeBottleModel position={[0, 0, -1.15]} scale={20} /> */}
        <PerfumeBottleModel position={[2, 0, -1.15]} scale={20} />
        <PerfumeBottleModel position={[-2, 0, -1.15]} scale={20} />
      </group>
    </>
  );
};

export default BottlesScene;
