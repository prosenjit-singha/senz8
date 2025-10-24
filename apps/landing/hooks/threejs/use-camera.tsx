import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export const useCamera = () => {
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;

  useEffect(() => {
    perspectiveCamera.position.set(0, 0, 0);
    perspectiveCamera.lookAt(0, 0, 0);
  }, [perspectiveCamera]);

  const update = ({
    position,
    lookAt,
    fov,
  }: {
    position?: [number, number, number];
    lookAt?: [number, number, number];
    fov?: number;
  }) => {
    if (position) perspectiveCamera.position.set(...position);
    if (lookAt) perspectiveCamera.lookAt(...lookAt);
    if (fov !== undefined) {
      perspectiveCamera.fov = fov;
      perspectiveCamera.updateProjectionMatrix();
    }
  };

  return { update };
};

export default useCamera;
