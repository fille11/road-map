import { useRef, Suspense, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

// Road plane component
function Road({ scrollProgress }) {
  const roadRef = useRef();
  
  // Create road texture pattern
  const roadMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      roughness: 0.9,
      metalness: 0.1,
    });
  }, []);

  // Create road markings
  const markingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.5,
      metalness: 0,
      emissive: "#ffffff",
      emissiveIntensity: 0.1,
    });
  }, []);

  useFrame(() => {
    if (roadRef.current) {
      const progress = scrollProgress.get();
      // Slight perspective shift as pole lifts
      roadRef.current.rotation.x = THREE.MathUtils.lerp(-Math.PI / 2.2, -Math.PI / 2.5, progress);
      roadRef.current.position.y = THREE.MathUtils.lerp(-2.5, -3.5, progress);
      roadRef.current.position.z = THREE.MathUtils.lerp(0, -2, progress);
    }
  });

  return (
    <group ref={roadRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2.5, 0]}>
      {/* Main road surface */}
      <mesh receiveShadow>
        <planeGeometry args={[12, 30]} />
        <primitive object={roadMaterial} attach="material" />
      </mesh>
      
      {/* Center line markings */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, -12 + i * 3.5, 0.01]}>
          <planeGeometry args={[0.15, 2]} />
          <primitive object={markingMaterial} attach="material" />
        </mesh>
      ))}
      
      {/* Edge lines */}
      <mesh position={[-5, 0, 0.01]}>
        <planeGeometry args={[0.1, 30]} />
        <primitive object={markingMaterial} attach="material" />
      </mesh>
      <mesh position={[5, 0, 0.01]}>
        <planeGeometry args={[0.1, 30]} />
        <primitive object={markingMaterial} attach="material" />
      </mesh>
      
      {/* Snow on road edges */}
      <mesh position={[-6.5, 0, 0.02]}>
        <planeGeometry args={[3, 30]} />
        <meshStandardMaterial color="#e8e8e8" roughness={1} />
      </mesh>
      <mesh position={[6.5, 0, 0.02]}>
        <planeGeometry args={[3, 30]} />
        <meshStandardMaterial color="#e8e8e8" roughness={1} />
      </mesh>
    </group>
  );
}

// Snow pole model with pull-up animation
function SnowPole({ scrollProgress }) {
  const modelRef = useRef();
  const { scene } = useGLTF("https://xonbkazvfxllffjbqfdm.supabase.co/storage/v1/object/public/models/snowstick1.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  useFrame(() => {
    if (modelRef.current) {
      const progress = scrollProgress.get();
      
      // Pull up from the road animation
      // Y position: starts embedded in road (-3), rises up to showcase height (1)
      modelRef.current.position.y = THREE.MathUtils.lerp(-2.5, 1.5, progress);
      
      // Slight rotation as it lifts
      modelRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 0.15, progress);
      
      // Subtle tilt for dynamic feel
      modelRef.current.rotation.x = THREE.MathUtils.lerp(0.05, -0.02, progress);
      modelRef.current.rotation.z = THREE.MathUtils.lerp(-0.02, 0.02, progress);
      
      // Scale slightly as it rises
      const scale = THREE.MathUtils.lerp(2.2, 2.8, progress);
      modelRef.current.scale.setScalar(scale);
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={clonedScene}
      scale={2.2}
      position={[0, -2.5, 0]}
      castShadow
    />
  );
}

// Loading placeholder
function ModelLoader() {
  return (
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[0.1, 0.15, 3, 8]} />
      <meshStandardMaterial color="#2997ff" transparent opacity={0.3} />
    </mesh>
  );
}

// Scene with fog and atmosphere
function Scene({ scrollProgress }) {
  const { scene } = useThree();
  
  useMemo(() => {
    scene.fog = new THREE.Fog("#0a0a0a", 8, 25);
  }, [scene]);

  return (
    <>
      {/* Ambient and key lights */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#b4d4ff" />
      
      {/* Accent lighting for dramatic effect */}
      <spotLight
        position={[0, 8, 3]}
        angle={0.4}
        penumbra={1}
        intensity={0.8}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[3, 2, 2]} intensity={0.3} color="#2997ff" />
      <pointLight position={[-3, 2, 2]} intensity={0.3} color="#2997ff" />
      
      <Suspense fallback={<ModelLoader />}>
        <Road scrollProgress={scrollProgress} />
        <SnowPole scrollProgress={scrollProgress} />
        <Environment preset="night" />
      </Suspense>
    </>
  );
}

export default function ModelSection() {
  const sectionRef = useRef();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring for cinematic feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 25,
    restDelta: 0.0001,
  });

  // Container fade in
  const containerOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.4, 0.85, 1],
    [0, 1, 1, 1, 0.8]
  );

  const containerScale = useTransform(
    smoothProgress,
    [0, 0.15, 0.4],
    [0.95, 1, 1]
  );

  const containerY = useTransform(
    smoothProgress,
    [0, 0.15, 0.4],
    [60, 0, 0]
  );

  // Text animations - appear after pole rises
  const titleOpacity = useTransform(
    smoothProgress,
    [0.35, 0.5, 0.8, 0.95],
    [0, 1, 1, 0.7]
  );

  const titleY = useTransform(
    smoothProgress,
    [0.35, 0.5],
    [50, 0]
  );

  const descOpacity = useTransform(
    smoothProgress,
    [0.42, 0.55, 0.8, 0.95],
    [0, 1, 1, 0.7]
  );

  const descY = useTransform(
    smoothProgress,
    [0.42, 0.55],
    [40, 0]
  );

  // Scroll progress for 3D - map to 0-1 for pull-up animation
  const modelProgress = useTransform(
    smoothProgress,
    [0.1, 0.7],
    [0, 1]
  );

  return (
    <section ref={sectionRef} className="model-section-3d">
      <div className="model-sticky-container">
        <motion.div
          className="model-canvas-wrapper"
          style={{
            opacity: containerOpacity,
            scale: containerScale,
            y: containerY,
          }}
        >
          <Canvas
            camera={{ position: [0, 2, 8], fov: 50 }}
            dpr={[1, 2]}
            shadows
            gl={{ antialias: true, alpha: true }}
          >
            <Scene scrollProgress={modelProgress} />
          </Canvas>
          
          {/* Subtle glow behind model */}
          <div className="model-glow-bg" />
        </motion.div>

        <div className="model-text-content">
          <motion.h2
            className="model-3d-title"
            style={{
              opacity: titleOpacity,
              y: titleY,
            }}
          >
            Built for the Elements
          </motion.h2>
          <motion.p
            className="model-3d-description"
            style={{
              opacity: descOpacity,
              y: descY,
            }}
          >
            Engineered with precision for unmatched performance in any condition.
            Experience control like never before.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// Preload the model
useGLTF.preload("https://xonbkazvfxllffjbqfdm.supabase.co/storage/v1/object/public/models/snowstick1.glb");
