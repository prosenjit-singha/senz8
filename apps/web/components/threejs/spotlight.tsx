"use client";

import React from "react";
import { useHelper } from "@react-three/drei";
import { SpotLightHelper } from "three";
import * as THREE from "three";
import { useMergeRefs } from "@/hooks/common.hooks";

type SpotlightProps = {
  color?: string;
  pointAt?: [number, number, number];
  ref?: React.RefObject<THREE.SpotLight | null>;
} & Omit<React.ComponentProps<"spotLight">, "ref" | "color">;

const SpotlightWithHelper = ({
  color,
  pointAt = [0, 0, 0],
  target,
  ref,
  ...props
}: SpotlightProps) => {
  const light = React.useRef<any>(null);
  const mergedRef = useMergeRefs(light, ref);

  useHelper(light, SpotLightHelper, color);
  return <spotLight ref={mergedRef} {...props} target={target} />;
};

const Spotlight = ({
  color,
  pointAt = [0, 0, 0],
  useHelper,
  ref,
  ...props
}: SpotlightProps & { useHelper?: boolean }) => {
  const light = React.useRef<any>(null);
  const mergedRef = useMergeRefs(light, ref);
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
  return <spotLight ref={mergedRef} {...props} target={target} />;
};

export default Spotlight;
