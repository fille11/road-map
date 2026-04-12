import { useRef, Suspense, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Clone } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "https://xonbkazvfxllffjbqfdm.supabase.co/storage/v1/object/public/models/snowstick1.glb";

// Snow wind particle system around the rising pole
function SnowWind({ scrollProgress }) {
  const particlesRef = useRef();
  const particleCount = 600;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Spawn in a cylinder around the pole
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 4;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 8 - 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius + Math.random() * 6 - 3;
      
      // Wind velocities - moving sideways and slightly up
      velocities[i * 3] = (Math.random() - 0.3) * 0.15;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    return { positions, velocities };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const progress = scrollProgress.get();
    const time = state.clock.elapsedTime;
    
    // Only show particles when pole is rising (progress > 0.2)
    const intensity = Math.max(0, Math.min(1, (progress - 0.2) * 3));
    
    const posArray = particlesRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < particleCount; i++) {
      // Add wind movement
      posArray[i * 3] += velocities[i * 3] * intensity;
      posArray[i * 3 + 1] += velocities[i * 3 + 1] + Math.sin(time * 2 + i) * 0.01;
      posArray[i * 3 + 2] += velocities[i * 3 + 2];
      
      // Add swirl effect
      const angle = time * 0.5 + i * 0.01;
      posArray[i * 3] += Math.sin(angle) * 0.02 * intensity;
      posArray[i * 3 + 2] += Math.cos(angle) * 0.02 * intensity;
      
      // Reset particles that go too far
      if (Math.abs(posArray[i * 3]) > 8 || 
          Math.abs(posArray[i * 3 + 2]) > 8 ||
          posArray[i * 3 + 1] > 6) {
        const resetAngle = Math.random() * Math.PI * 2;
        const resetRadius = 1 + Math.random() * 3;
        posArray[i * 3] = Math.cos(resetAngle) * resetRadius;
        posArray[i * 3 + 1] = -2 + Math.random() * 2;
        posArray[i * 3 + 2] = Math.sin(resetAngle) * resetRadius;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.material.opacity = intensity * 0.7;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Blue glow effect for the top section
function BlueGlowEffect({ scrollProgress }) {
  const glowRef = useRef();
  
  useFrame(() => {
    if (!glowRef.current) return;
    
    const progress = scrollProgress.get();
    
    // Glow appears after 60% scroll
    const glowIntensity = Math.max(0, (progress - 0.6) * 2.5);
    
    // Position follows the rising pole
    const poleY = THREE.MathUtils.lerp(-2.5, 1.5, progress);
    glowRef.current.position.y = poleY + 2.2; // Position at top of pole
    
    // Scale and opacity based on progress
    const scale = THREE.MathUtils.lerp(0.3, 0.8, glowIntensity);
    glowRef.current.scale.setScalar(scale);
    glowRef.current.material.opacity = glowIntensity * 0.9;
  });

  return (
    <mesh ref={glowRef} position={[0, 3, 0]}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshBasicMaterial
        color="#00aaff"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Temperature display component
function TemperatureDisplay({ scrollProgress }) {
  const opacity = useTransform(
    scrollProgress,
    [0.65, 0.75],
    [0, 1]
  );

  const y = useTransform(
    scrollProgress,
    [0.65, 0.75],
    [20, 0]
  );

  return (
    <motion.div
      className="temperature-display"
      style={{ opacity, y }}
    >
      <span className="temp-value">+2°C</span>
      <span className="temp-indicator blue-active" />
    </motion.div>
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
      {/* Main road surface */}
      <mesh receiveShadow>
        <planeGeometry args={[12, 50]} />
        <primitive object={roadMaterial} attach="material" />
      </mesh>
      
      {/* Center line markings */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, -22 + i * 4, 0.01]}>
          <planeGeometry args={[0.15, 2.5]} />
          <primitive object={markingMaterial} attach="material" />
        </mesh>
      ))}
      
      {/* Edge lines */}
      <mesh position={[-5, 0, 0.01]}>
        <planeGeometry args={[0.1, 50]} />
        <primitive object={markingMaterial} attach="material" />
      </mesh>
      <mesh position={[5, 0, 0.01]}>
        <planeGeometry args={[0.1, 50]} />
        <primitive object={markingMaterial} attach="material" />
      </mesh>
      
      {/* Snow on road edges */}
      <mesh position={[-7, 0, 0.02]}>
        <planeGeometry args={[4, 50]} />
        <meshStandardMaterial color="#e8e8e8" roughness={1} />
      </mesh>
      <mesh position={[7, 0, 0.02]}>
        <planeGeometry args={[4, 50]} />
        <meshStandardMaterial color="#e8e8e8" roughness={1} />
      </mesh>
    </group>
  );
}

// Static snow pole placed along the road
function StaticSnowPole({ position, rotation = 0, scale = 1.8 }) {
  const { scene } = useGLTF(MODEL_URL);
  
  return (
    <Clone
      object={scene}
      scale={scale}
      position={position}
      rotation={[0, rotation, 0]}
    />
  );
}

// Main animated snow pole that rises up with color change
function RisingSnowPole({ scrollProgress }) {
  const modelRef = useRef();
  const blueOverlayRef = useRef();
  const { scene } = useGLTF(MODEL_URL);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  useFrame(() => {
    if (modelRef.current) {
      const progress = scrollProgress.get();
      
      // Pull up from the road animation
      modelRef.current.position.y = THREE.MathUtils.lerp(-2.5, 1.5, progress);
      
      // Slight rotation as it lifts
      modelRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 0.15, progress);
      
      // Subtle tilt for dynamic feel
      modelRef.current.rotation.x = THREE.MathUtils.lerp(0.05, -0.02, progress);
      modelRef.current.rotation.z = THREE.MathUtils.lerp(-0.02, 0.02, progress);
      
      // Scale slightly as it rises
      const scale = THREE.MathUtils.lerp(1.8, 2.8, progress);
      modelRef.current.scale.setScalar(scale);
    }
    
    // Blue overlay for the top section
    if (blueOverlayRef.current) {
      const progress = scrollProgress.get();
      const poleY = THREE.MathUtils.lerp(-2.5, 1.5, progress);
      const scale = THREE.MathUtils.lerp(1.8, 2.8, progress);
      
      // Position the blue cylinder at the top of the pole (above reflector)
      blueOverlayRef.current.position.y = poleY + (1.8 * scale / 2.8);
      blueOverlayRef.current.scale.set(scale * 0.06, scale * 0.25, scale * 0.06);
      
      // Blue color intensity based on scroll
      const blueIntensity = Math.max(0, (progress - 0.6) * 2.5);
      blueOverlayRef.current.material.opacity = blueIntensity * 0.85;
      blueOverlayRef.current.material.emissiveIntensity = blueIntensity * 2;
    }
  });

  return (
    <group>
      <primitive
        ref={modelRef}
        object={clonedScene}
        scale={1.8}
        position={[0, -2.5, 0]}
        castShadow
      />
      {/* Blue overlay for the orange section above reflector */}
      <mesh ref={blueOverlayRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 1, 16]} />
        <meshStandardMaterial
          color="#00aaff"
          emissive="#0088ff"
          emissiveIntensity={0}
          transparent
          opacity={0}
          blending={THREE.NormalBlending}
        />
      </mesh>
    </group>
  );
}

// All the poles along the roadside
function RoadsidePoles() {
  // Positions for poles on left side of road (negative x)
  const leftPoles = [
    { pos: [-5.5, -2.5, -18], rot: 0.1 },
    { pos: [-5.5, -2.5, -12], rot: -0.05 },
    { pos: [-5.5, -2.5, -6], rot: 0.08 },
    { pos: [-5.5, -2.5, 6], rot: -0.1 },
    { pos: [-5.5, -2.5, 12], rot: 0.05 },
    { pos: [-5.5, -2.5, 18], rot: -0.08 },
  ];

  // Positions for poles on right side of road (positive x)
  const rightPoles = [
    { pos: [5.5, -2.5, -18], rot: -0.1 },
    { pos: [5.5, -2.5, -12], rot: 0.05 },
    { pos: [5.5, -2.5, -6], rot: -0.08 },
    { pos: [5.5, -2.5, 6], rot: 0.1 },
    { pos: [5.5, -2.5, 12], rot: -0.05 },
    { pos: [5.5, -2.5, 18], rot: 0.08 },
  ];

  return (
    <group>
      {leftPoles.map((pole, i) => (
        <StaticSnowPole
          key={`left-${i}`}
          position={pole.pos}
          rotation={pole.rot}
          scale={1.6}
        />
      ))}
      {rightPoles.map((pole, i) => (
        <StaticSnowPole
          key={`right-${i}`}
          position={pole.pos}
          rotation={pole.rot}
          scale={1.6}
        />
      ))}
    </group>
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
    scene.fog = new THREE.Fog("#0a0a0a", 10, 35);
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
        <RoadsidePoles />
        <RisingSnowPole scrollProgress={scrollProgress} />
        <SnowWind scrollProgress={scrollProgress} />
        <BlueGlowEffect scrollProgress={scrollProgress} />
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
            camera={{ position: [0, 2, 12], fov: 50 }}
            dpr={[1, 2]}
            shadows
            gl={{ antialias: true, alpha: true }}
          >
            <Scene scrollProgress={modelProgress} />
          </Canvas>
          
          {/* Subtle glow behind model */}
          <div className="model-glow-bg" />
          
          {/* Temperature indicator overlay */}
          <TemperatureDisplay scrollProgress={smoothProgress} />
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
            Under 2°C turns blue. Intelligent warning system that alerts drivers
            to freezing conditions ahead, keeping roads safer in winter weather.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// Preload the model
useGLTF.preload(MODEL_URL);
