import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF(
    "https://xonbkazvfxllffjbqfdm.supabase.co/storage/v1/object/public/models/snowstick1.glb"
  );

  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
}

export default function SnowStick3D() {
  return (
    <Canvas camera={{ position: [0, 1, 5] }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 2, 2]} intensity={2} />

      <Model />

      <OrbitControls />
    </Canvas>
  );
}
