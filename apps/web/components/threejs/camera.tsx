import useCamera from "@/hooks/threejs/use-camera";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export const Camera = ({
  position,
  lookAt,
  fov,
  useOrbitControls,
}: {
  position?: [number, number, number];
  lookAt?: [number, number, number];
  fov?: number;
  useOrbitControls?: boolean;
}) => {
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;

  useEffect(() => {
    if (position) perspectiveCamera.position.set(...position);
    if (lookAt) perspectiveCamera.lookAt(...lookAt);
    if (fov !== undefined) {
      perspectiveCamera.fov = fov;
      perspectiveCamera.updateProjectionMatrix();
    }
  }, [perspectiveCamera, camera, position, lookAt, fov]);

  if (useOrbitControls) {
    return <OrbitControls target={lookAt} />;
  }

  return null;
};

export default Camera;
