import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF("/snowstick.glb");
  return <primitive object={scene} scale={2} />;
}

export default function SnowStick3D() {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} />

        <Model />

        {/* valfri rotation med mus */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
