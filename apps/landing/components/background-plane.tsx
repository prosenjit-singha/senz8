// import { TextureLoader } from "three";
// import { useLoader } from "@react-three/fiber";

function BackgroundPlane() {
  // Load a paper texture from /public/textures/paper.jpg
  //   const texture = useLoader(TextureLoader, "/textures/paper.jpg");

  return (
    <mesh
      position={[0, 0, -2]} // behind the model
      rotation={[0, 0, 0]}
      scale={[10, 10, 1]} // make it large enough to fill the view
      receiveShadow
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}
