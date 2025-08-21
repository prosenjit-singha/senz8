import React, { useRef, useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Sky, SkyProps, calcPosFromAngles } from "@react-three/drei";
import GUI from "lil-gui";
import * as THREE from "three";

export interface SkyParameters {
  inclination: number;
  azimuth: number;
  turbidity: number;
  rayleigh: number;
  mieCoefficient: number;
  mieDirectionalG: number;
  exposure: number;
}

interface SkyWithGUIProps extends SkyProps {
  showGUI?: boolean;
  onParametersChange?: (params: SkyParameters) => void;
}

const SkyWithGUI: React.FC<SkyWithGUIProps> = ({
  showGUI = false,
  onParametersChange,
  ...skyProps
}) => {
  const [parameters, setParameters] = useState<SkyParameters>({
    inclination: skyProps.inclination ?? 0.6,
    azimuth: skyProps.azimuth ?? 0.1,
    turbidity: skyProps.turbidity ?? 10,
    rayleigh: skyProps.rayleigh ?? 0.5,
    mieCoefficient: skyProps.mieCoefficient ?? 0.005,
    mieDirectionalG: skyProps.mieDirectionalG ?? 0.8,
    exposure: 0.5,
  });

  const guiRef = useRef<GUI>(null);
  const { gl } = useThree();
  const sunPositionRef = useRef(
    calcPosFromAngles(parameters.inclination, parameters.azimuth)
  );

  // Initialize GUI
  useEffect(() => {
    if (!showGUI) return;

    const gui = new GUI({ title: "Sky Parameters", width: 300 });
    guiRef.current = gui;

    gui
      .add(parameters, "turbidity", 0.0, 20.0, 0.1)
      .name("Turbidity")
      .onChange((value: number) => updateParameter("turbidity", value));

    gui
      .add(parameters, "rayleigh", 0.0, 4, 0.001)
      .name("Rayleigh")
      .onChange((value: number) => updateParameter("rayleigh", value));

    gui
      .add(parameters, "mieCoefficient", 0.0, 0.1, 0.001)
      .name("Mie Coefficient")
      .onChange((value: number) => updateParameter("mieCoefficient", value));

    gui
      .add(parameters, "mieDirectionalG", 0.0, 1, 0.001)
      .name("Mie Directional G")
      .onChange((value: number) => updateParameter("mieDirectionalG", value));

    gui
      .add(parameters, "inclination", 0, 1, 0.01)
      .name("Inclination")
      .onChange((value: number) => updateParameter("inclination", value));

    gui
      .add(parameters, "azimuth", 0, 1, 0.01)
      .name("Azimuth")
      .onChange((value: number) => updateParameter("azimuth", value));

    gui
      .add(parameters, "exposure", 0, 1, 0.0001)
      .name("Exposure")
      .onChange((value: number) => updateParameter("exposure", value));

    // Position the GUI
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "10px";
    gui.domElement.style.right = "10px";
    document.body.appendChild(gui.domElement);

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
      }
    };
  }, [showGUI]);

  const updateParameter = (key: keyof SkyParameters, value: number) => {
    setParameters((prev) => {
      const newParams = { ...prev, [key]: value };

      // Update sun position if inclination or azimuth changes
      if (key === "inclination" || key === "azimuth") {
        sunPositionRef.current = calcPosFromAngles(
          key === "inclination" ? value : newParams.inclination,
          key === "azimuth" ? value : newParams.azimuth
        );
      }

      // Update exposure if it changes
      if (key === "exposure") {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = value;
      }

      onParametersChange?.(newParams);
      return newParams;
    });
  };

  // Set initial exposure
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = parameters.exposure;
  }, [gl]);

  return (
    <Sky
      {...skyProps}
      turbidity={parameters.turbidity}
      rayleigh={parameters.rayleigh}
      mieCoefficient={parameters.mieCoefficient}
      mieDirectionalG={parameters.mieDirectionalG}
      inclination={parameters.inclination}
      azimuth={parameters.azimuth}
      sunPosition={sunPositionRef.current}
    />
  );
};

export default SkyWithGUI;
