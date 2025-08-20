"use client";

import React from "react";
import { useHelper } from "@react-three/drei";
import { DirectionalLightHelper } from "three";
import * as THREE from "three";
import { useMergeRefs } from "@/hooks/common.hooks";

type DirectionalLightProps = {
  color?: string;
  size?: number;
  pointAt?: [number, number, number];
  ref?: React.RefObject<THREE.DirectionalLight | null>;
} & Omit<React.ComponentProps<"directionalLight">, "color" | "ref">;

const DirectionalLightWithHelper = ({
  color,
  size,
  target,
  ref,
  ...props
}: DirectionalLightProps) => {
  const light = React.useRef<any>(null);
  const mergedRef = useMergeRefs(light, ref);
  useHelper(light, DirectionalLightHelper, size, color);
  return <directionalLight ref={mergedRef} target={target} {...props} />;
};

const DirectionalLight = ({
  color,
  size,
  pointAt = [0, 0, 0],
  useHelper,
  ref,
  ...props
}: DirectionalLightProps & { useHelper?: boolean }) => {
  const light = React.useRef<THREE.DirectionalLight>(null);
  const mergedRef = useMergeRefs(light, ref);
  const target = new THREE.Object3D();
  target.position.set(pointAt[0], pointAt[1], pointAt[2]); // new target point

  if (useHelper) {
    return (
      <DirectionalLightWithHelper
        color={color}
        size={size}
        target={target}
        ref={ref}
        {...props}
      />
    );
  }
  return <directionalLight ref={mergedRef} {...props} target={target} />;
};

export default DirectionalLight;
