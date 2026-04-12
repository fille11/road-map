import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF("/snowstick.glb");

  return <primitive object={scene} scale={2} />;
}

export default function SnowStick3D() {
  return (
    <Canvas camera={{ position: [0, 1, 5] }}>
      <ambientLight intensity={1} />
      <directionalLight position={[2, 2, 2]} />

      <Model />

      <OrbitControls />
    </Canvas>
  );
}
