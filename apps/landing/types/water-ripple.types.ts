import * as THREE from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";

export interface WaterSimulationProps {
  width?: number;
  bounds?: number;
  mouseSize?: number;
  mouseDeep?: number;
  viscosity?: number;
  speed?: number;
  ducksEnabled?: boolean;
}

export interface Shader {
  uniforms: { [uniform: string]: THREE.IUniform };
  vertexShader: string;
  fragmentShader: string;
}

export interface EffectController {
  mouseSize: number;
  mouseDeep: number;
  viscosity: number;
  speed: number;
  ducksEnabled: boolean;
  wireframe: boolean;
  shadow: boolean;
}

export interface DuckObject extends THREE.Object3D {
  userData: {
    velocity: THREE.Vector3;
  };
}

export interface GPUComputationState {
  gpuCompute: GPUComputationRenderer | null;
  heightmapVariable: any | null;
  smoothShader: THREE.ShaderMaterial | null;
  readWaterLevelShader: THREE.ShaderMaterial | null;
  readWaterLevelRenderTarget: THREE.WebGLRenderTarget | null;
  readWaterLevelImage: Uint8Array | null;
  tmpHeightmap: THREE.Texture | null;
}

export interface WaterMaterialUniforms {
  heightmap: THREE.IUniform<THREE.Texture | null>;
  [key: string]: THREE.IUniform<any>;
}
