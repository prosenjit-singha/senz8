import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export const Camera = ({
  position,
  lookAt,
  fov,
  focusDistance,
  useOrbitControls,
}: {
  position?: [number, number, number];
  lookAt?: [number, number, number];
  fov?: number;
  focusDistance?: number;
  useOrbitControls?: boolean;
}) => {
  const { camera, gl } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;

  useEffect(() => {
    if (position) perspectiveCamera.position.set(...position);

    // Set lookAt point and calculate focus distance if not provided
    if (lookAt) {
      const lookAtVector = new THREE.Vector3(...lookAt);
      perspectiveCamera.lookAt(lookAtVector);

      // Calculate focus distance based on camera position and lookAt point
      if (focusDistance === undefined) {
        const calculatedDistance =
          perspectiveCamera.position.distanceTo(lookAtVector);
        // Set focus distance for depth of field (if used elsewhere)
        (perspectiveCamera as any).focusDistance = calculatedDistance;
      } else {
        (perspectiveCamera as any).focusDistance = focusDistance;
      }
    }

    if (fov !== undefined) {
      perspectiveCamera.fov = fov;
      perspectiveCamera.updateProjectionMatrix();
    }
  }, [perspectiveCamera, position, lookAt, fov, focusDistance]);

  // If you want to use DepthOfField from drei, you can return it here
  // But typically DepthOfField is used as a separate post-processing effect

  if (useOrbitControls) {
    return (
      <OrbitControls
        target={lookAt ? new THREE.Vector3(...lookAt) : undefined}
      />
    );
  }

  return null;
};

export default Camera;
