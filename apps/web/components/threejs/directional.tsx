"use client";

import React from "react";
import { useHelper } from "@react-three/drei";
import { DirectionalLightHelper } from "three";
import * as THREE from "three";

type DirectionalLightProps = {
  color?: string;
  size?: number;
  pointAt?: [number, number, number];
} & Omit<React.ComponentProps<"directionalLight">, "ref" | "color">;

const DirectionalLightWithHelper = ({
  color,
  size,
  target,
  ...props
}: DirectionalLightProps) => {
  const light = React.useRef<any>(null);
  useHelper(light, DirectionalLightHelper, size, color);
  return <directionalLight ref={light} target={target} {...props} />;
};

const DirectionalLight = ({
  color,
  size,
  pointAt = [0, 0, 0],
  useHelper,
  ...props
}: DirectionalLightProps & { useHelper?: boolean }) => {
  const light = React.useRef<any>(null);
  const target = new THREE.Object3D();
  target.position.set(pointAt[0], pointAt[1], pointAt[2]); // new target point
  if (useHelper) {
    return (
      <DirectionalLightWithHelper
        color={color}
        size={size}
        target={target}
        {...props}
      />
    );
  }
  return <directionalLight ref={light} {...props} target={target} />;
};

export default DirectionalLight;
