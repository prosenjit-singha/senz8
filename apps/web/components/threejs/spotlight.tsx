"use client";

import React from "react";
import { useHelper } from "@react-three/drei";
import { SpotLightHelper } from "three";
import * as THREE from "three";

type SpotlightProps = {
  color?: string;
  pointAt?: [number, number, number];
} & Omit<React.ComponentProps<"spotLight">, "ref" | "color">;

const SpotlightWithHelper = ({
  color,
  pointAt = [0, 0, 0],
  target,
  ...props
}: SpotlightProps) => {
  const light = React.useRef<any>(null);
  useHelper(light, SpotLightHelper, color);
  return <spotLight ref={light} {...props} target={target} />;
};

const Spotlight = ({
  color,
  pointAt = [0, 0, 0],
  useHelper,
  ...props
}: SpotlightProps & { useHelper?: boolean }) => {
  const light = React.useRef<any>(null);
  const target = new THREE.Object3D();
  target.position.set(pointAt[0], pointAt[1], pointAt[2]); // new target point
  if (useHelper) {
    return (
      <SpotlightWithHelper
        color={color}
        pointAt={pointAt}
        target={target}
        {...props}
      />
    );
  }
  return <spotLight ref={light} {...props} target={target} />;
};

export default Spotlight;
