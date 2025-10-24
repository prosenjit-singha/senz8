import * as THREE from "three";
import { shaderChange } from "@/helpers/threejs/water-shaders";
import { Shader } from "@/types/water-ripple.types";

export class WaterMaterial extends THREE.MeshStandardMaterial {
  public extra: { [key: string]: any };
  public defines: { [key: string]: string };
  public userData: { shader?: Shader } = {};

  constructor(
    parameters: THREE.MeshStandardMaterialParameters & {
      [key: string]: any;
    } = {}
  ) {
    super();

    this.defines = {
      STANDARD: "",
      USE_UV: "",
      WIDTH: "128.0",
      BOUNDS: "6.0",
    };

    this.extra = {};
    this.addParameter("heightmap", null);
    this.setValues(parameters);
  }

  addParameter(name: string, value: any): void {
    this.extra[name] = value;
    Object.defineProperty(this, name, {
      get: () => this.extra[name],
      set: (v: any) => {
        this.extra[name] = v;
        if (this.userData.shader && this.userData.shader.uniforms[name]) {
          this.userData.shader.uniforms[name].value = this.extra[name];
        }
      },
    });
  }

  onBeforeCompile(shader: Shader): void {
    for (const name in this.extra) {
      shader.uniforms[name] = { value: this.extra[name] };
    }

    shader.vertexShader = shader.vertexShader.replace("#include <common>", shaderChange.common);
    shader.vertexShader = shader.vertexShader.replace(
      "#include <beginnormal_vertex>",
      shaderChange.beginnormal_vertex
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      shaderChange.begin_vertex
    );

    this.userData.shader = shader;
  }
}
