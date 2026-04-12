import { useRef, Suspense, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Text } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "https://xonbkazvfxllffjbqfdm.supabase.co/storage/v1/object/public/models/snowstick1.glb";

// Snowstorm particle system
function Snowstorm({ scrollProgress }) {
  const particlesRef = useRef();
  const particleCount = 800;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 15 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = -0.02 - Math.random() * 0.03;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const progress = scrollProgress.get();
      const intensity = Math.min(progress * 2, 1);
      
      const positions = particlesRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particles.velocities[i * 3] * intensity * 2;
        positions[i * 3 + 1] += particles.velocities[i * 3 + 1] * intensity * 1.5;
        positions[i * 3 + 2] += particles.velocities[i * 3 + 2] * intensity * 2;
        
        // Wind effect
        positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.003 * intensity;
        
        // Reset particles that fall below
        if (positions[i * 3 + 1] < -3) {
          positions[i * 3] = (Math.random() - 0.5) * 30;
          positions[i * 3 + 1] = 12;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Fade in snow with scroll
      particlesRef.current.material.opacity = Math.min(progress * 1.5, 0.8);
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.08}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Road plane component
function Road({ scrollProgress }) {
  const roadRef = useRef();
  
  const roadMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      roughness: 0.9,
      metalness: 0.1,
    });
  }, []);

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
      roadRef.current.rotation.x = THREE.MathUtils.lerp(-Math.PI / 2.2, -Math.PI / 2.5, progress);
      roadRef.current.position.y = THREE.MathUtils.lerp(-2.5, -3.5, progress);
      roadRef.current.position.z = THREE.MathUtils.lerp(0, -2, progress);
    }
  });

  return (
    <group ref={roadRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -2.5, 0]}>
      <mesh receiveShadow>
        <planeGeometry args={[12, 40]} />
        <primitive object={roadMaterial} attach="material" />
      </mesh>
      
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, -18 + i * 3.5, 0.01]}>
          <planeGeometry args={[0.15, 2]} />
          <primitive object={markingMaterial} attach="material" />
        </mesh>
      ))}
      
      <mesh position={[-5, 0, 0.01]}>
        <planeGeometry args={[0.1, 40]} />
        <primitive object={markingMaterial} attach="material" />
      </mesh>
      <mesh position={[5, 0, 0.01]}>
        <planeGeometry args={[0.1, 40]} />
        <primitive object={markingMaterial} attach="material" />
      </mesh>
      
      <mesh position={[-7, 0, 0.02]}>
        <planeGeometry args={[4, 40]} />
        <meshStandardMaterial color="#d8d8d8" roughness={1} />
      </mesh>
      <mesh position={[7, 0, 0.02]}>
        <planeGeometry args={[4, 40]} />
        <meshStandardMaterial color="#d8d8d8" roughness={1} />
      </mesh>
    </group>
  );
}

// Static snow pole on side of road
function StaticSnowPole({ position, rotation = 0, scale = 1.8 }) {
  const { scene } = useGLTF(MODEL_URL);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  return (
    <primitive
      object={clonedScene}
      scale={scale}
      position={position}
      rotation={[0, rotation, 0]}
    />
  );
}

// Main snow pole with pull-up animation and color change
function MainSnowPole({ scrollProgress }) {
  const modelRef = useRef();
  const blueMaterialRef = useRef();
  const { scene } = useGLTF(MODEL_URL);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  // Find and modify materials for the blue color effect
  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);
  
  useFrame(() => {
    if (modelRef.current) {
      const progress = scrollProgress.get();
      
      // Pull up animation
      modelRef.current.position.y = THREE.MathUtils.lerp(-2.5, 1.5, progress);
      modelRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 0.15, progress);
      modelRef.current.rotation.x = THREE.MathUtils.lerp(0.05, -0.02, progress);
      
      const scale = THREE.MathUtils.lerp(2.2, 2.8, progress);
      modelRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <primitive
        ref={modelRef}
        object={clonedScene}
        scale={2.2}
        position={[0, -2.5, 0]}
        castShadow
      />
      {/* Blue glow effect on top part - appears with scroll */}
      <BlueGlowEffect scrollProgress={scrollProgress} />
    </group>
  );
}

// Blue glow effect for the top reflective part
function BlueGlowEffect({ scrollProgress }) {
  const glowRef = useRef();
  
  useFrame(() => {
    if (glowRef.current) {
      const progress = scrollProgress.get();
      
      // Position follows the main pole
      const poleY = THREE.MathUtils.lerp(-2.5, 1.5, progress);
      glowRef.current.position.y = poleY + 2.2; // Offset to top part
      
      // Fade in the blue color effect after 60% scroll
      const blueProgress = Math.max(0, (progress - 0.6) / 0.4);
      glowRef.current.material.opacity = blueProgress * 0.6;
      glowRef.current.material.emissiveIntensity = blueProgress * 2;
      
      // Scale with pole
      const scale = THREE.MathUtils.lerp(2.2, 2.8, progress);
      glowRef.current.scale.set(scale * 0.15, scale * 0.35, scale * 0.15);
    }
  });

  return (
    <mesh ref={glowRef} position={[0, 0, 0]}>
      <cylinderGeometry args={[1, 1, 1, 16]} />
      <meshStandardMaterial
        color="#2997ff"
        emissive="#2997ff"
        emissiveIntensity={0}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Temperature text display
function TemperatureText({ scrollProgress }) {
  const textRef = useRef();
  
  useFrame(() => {
    if (textRef.current) {
      const progress = scrollProgress.get();
      
      // Position below the pole
      const poleY = THREE.MathUtils.lerp(-2.5, 1.5, progress);
      textRef.current.position.y = poleY - 0.8;
      
      // Fade in after 70% scroll
      const textProgress = Math.max(0, (progress - 0.7) / 0.3);
      textRef.current.material.opacity = textProgress;
      
      // Scale with progress
      const scale = THREE.MathUtils.lerp(0.3, 0.5, progress);
      textRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Text
      ref={textRef}
      position={[0, -2, 0.5]}
      fontSize={1}
      color="#2997ff"
      anchorX="center"
      anchorY="middle"
      font="/fonts/Geist-Bold.ttf"
      material-transparent
      material-opacity={0}
    >
      +2°C
    </Text>
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

// Scene with all elements
function Scene({ scrollProgress }) {
  const { scene } = useThree();
  
  useMemo(() => {
    scene.fog = new THREE.Fog("#0a0a0a", 8, 30);
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#b4d4ff" />
      
      <spotLight
        position={[0, 8, 3]}
        angle={0.4}
        penumbra={1}
        intensity={0.6}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[3, 3, 2]} intensity={0.4} color="#2997ff" />
      <pointLight position={[-3, 3, 2]} intensity={0.4} color="#2997ff" />
      
      <Suspense fallback={<ModelLoader />}>
        <Road scrollProgress={scrollProgress} />
        
        {/* Multiple static poles along the road sides */}
        <StaticSnowPole position={[-5.5, -2.5, -8]} rotation={0.1} scale={1.6} />
        <StaticSnowPole position={[-5.5, -2.5, -4]} rotation={-0.05} scale={1.7} />
        <StaticSnowPole position={[-5.5, -2.5, 0]} rotation={0.08} scale={1.6} />
        <StaticSnowPole position={[-5.5, -2.5, 4]} rotation={-0.1} scale={1.65} />
        <StaticSnowPole position={[-5.5, -2.5, 8]} rotation={0.05} scale={1.7} />
        <StaticSnowPole position={[-5.5, -2.5, 12]} rotation={-0.08} scale={1.6} />
        
        <StaticSnowPole position={[5.5, -2.5, -10]} rotation={-0.08} scale={1.65} />
        <StaticSnowPole position={[5.5, -2.5, -6]} rotation={0.12} scale={1.7} />
        <StaticSnowPole position={[5.5, -2.5, -2]} rotation={-0.05} scale={1.6} />
        <StaticSnowPole position={[5.5, -2.5, 2]} rotation={0.1} scale={1.65} />
        <StaticSnowPole position={[5.5, -2.5, 6]} rotation={-0.1} scale={1.7} />
        <StaticSnowPole position={[5.5, -2.5, 10]} rotation={0.05} scale={1.6} />
        
        {/* Main pole that rises up */}
        <MainSnowPole scrollProgress={scrollProgress} />
        
        {/* Temperature display */}
        <TemperatureText scrollProgress={scrollProgress} />
        
        {/* Snowstorm effect */}
        <Snowstorm scrollProgress={scrollProgress} />
        
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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 25,
    restDelta: 0.0001,
  });

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
            camera={{ position: [0, 2, 10], fov: 50 }}
            dpr={[1, 2]}
            shadows
            gl={{ antialias: true, alpha: true }}
          >
            <Scene scrollProgress={modelProgress} />
          </Canvas>
          
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
            Smart Temperature Sensing
          </motion.h2>
          <motion.p
            className="model-3d-description"
            style={{
              opacity: descOpacity,
              y: descY,
            }}
          >
            Advanced reflective technology with real-time temperature monitoring.
            The blue indicator activates above freezing point.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

useGLTF.preload(MODEL_URL);
