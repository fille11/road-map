import { useRef, Suspense } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

// Component that syncs scroll progress to 3D rotation
function ScrollLinkedModel({ scrollProgress }) {
  const modelRef = useRef();
  const { viewport } = useThree();
  
  // Load the snow pole model
  const { scene } = useGLTF("https://xonbkazvfxllffjbqfdm.supabase.co/storage/v1/object/public/models/snowstick1.glb");
  
  // Clone the scene to avoid mutation issues
  const clonedScene = scene.clone();
  
  useFrame(() => {
    if (modelRef.current) {
      const progress = scrollProgress.get();
      
      // Apple-style rotation - starts angled, rotates to front view
      // Rotation from -45deg to 15deg on Y axis
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        -Math.PI / 4,  // -45 degrees (angled)
        Math.PI / 12,  // 15 degrees (slight angle for depth)
        progress
      );
      
      // Subtle tilt on X axis for dynamic feel
      modelRef.current.rotation.x = THREE.MathUtils.lerp(
        0.15,  // Slight forward tilt
        -0.05, // Almost straight
        progress
      );
      
      // Very subtle Z rotation for polish
      modelRef.current.rotation.z = THREE.MathUtils.lerp(
        0.1,
        -0.05,
        progress
      );
      
      // Scale up slightly as it comes into view
      const scale = THREE.MathUtils.lerp(0.9, 1, Math.min(progress * 2, 1));
      modelRef.current.scale.setScalar(scale * 2.5);
      
      // Subtle vertical movement
      modelRef.current.position.y = THREE.MathUtils.lerp(-0.5, 0, progress);
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.1}
      floatIntensity={0.3}
    >
      <primitive
        ref={modelRef}
        object={clonedScene}
        scale={2.5}
        position={[0, 0, 0]}
      />
    </Float>
  );
}

// Loading placeholder
function ModelLoader() {
  return (
    <mesh>
      <boxGeometry args={[1, 3, 0.1]} />
      <meshStandardMaterial color="#2997ff" transparent opacity={0.3} />
    </mesh>
  );
}

export default function ModelSection() {
  const sectionRef = useRef();
  const canvasContainerRef = useRef();

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

  // Text animations - delayed from model
  const titleOpacity = useTransform(
    smoothProgress,
    [0.2, 0.35, 0.8, 0.95],
    [0, 1, 1, 0.7]
  );

  const titleY = useTransform(
    smoothProgress,
    [0.2, 0.35],
    [40, 0]
  );

  const descOpacity = useTransform(
    smoothProgress,
    [0.28, 0.42, 0.8, 0.95],
    [0, 1, 1, 0.7]
  );

  const descY = useTransform(
    smoothProgress,
    [0.28, 0.42],
    [30, 0]
  );

  // Scroll progress for 3D - map to 0-1 for rotation
  const modelRotationProgress = useTransform(
    smoothProgress,
    [0.1, 0.9],
    [0, 1]
  );

  return (
    <section ref={sectionRef} className="model-section-3d">
      <div className="model-sticky-container">
        <motion.div
          ref={canvasContainerRef}
          className="model-canvas-wrapper"
          style={{
            opacity: containerOpacity,
            scale: containerScale,
            y: containerY,
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#2997ff" />
            <spotLight
              position={[0, 10, 0]}
              angle={0.3}
              penumbra={1}
              intensity={0.5}
              color="#ffffff"
            />
            
            <Suspense fallback={<ModelLoader />}>
              <ScrollLinkedModel scrollProgress={modelRotationProgress} />
              <Environment preset="city" />
            </Suspense>
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
