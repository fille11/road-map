import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// ===== 3D MODEL =====
function SnowStick() {
  const { scene } = useGLTF(
    "https://xonbkazvfxllffjbqfdm.supabase.co/storage/v1/object/public/models/snowstick1.glb"
  );
  return <primitive object={scene} scale={1.5} />;
}

// ===== MAIN COMPONENT =====
export default function HeroProduct() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // ===== ANIMATIONS =====
  const videoOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.2]);

  const text1Opacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  const text1Y = useTransform(scrollYProgress, [0.2, 0.35], [50, 0]);

  const text2Opacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const text2Y = useTransform(scrollYProgress, [0.4, 0.6], [50, 0]);

  const modelOpacity = useTransform(scrollYProgress, [0.65, 0.9], [0, 1]);

  return (
    <div ref={ref} className="h-[300vh] bg-black text-white">

      {/* ===== STICKY VIEWPORT ===== */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ===== VIDEO ===== */}
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
          style={{ opacity: videoOpacity }}
        >
          <source
            src="https://xonbkazvfxllffjbqfdm.supabase.co/storage/v1/object/sign/videos/Videoprojekt%203.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NmFmNGE4OC1jMDQxLTQyMzMtYWNmZC0wZTEwZTgzODAyOTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvVmlkZW9wcm9qZWt0IDMubXA0IiwiaWF0IjoxNzc1OTk2NTUzLCJleHAiOjE5MzM2NzY1NTN9.vOWLHZRQtGLUCiBFvCwf2INtdTOFrpYH1MXSqhhrC4Q"
            type="video/mp4"
          />
        </motion.video>

        {/* ===== TEXT 1 ===== */}
        <motion.div
          style={{ opacity: text1Opacity, y: text1Y }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <h1 className="text-5xl md:text-7xl font-semibold text-blue-400 text-center">
            Vintervägar dödar.
          </h1>
        </motion.div>

        {/* ===== TEXT 2 ===== */}
        <motion.div
          style={{ opacity: text2Opacity, y: text2Y }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <p className="text-xl md:text-2xl text-gray-300 text-center max-w-2xl">
            Över 1000 olyckor varje vinter.  
            Is, snö och dålig sikt gör vägar livsfarliga –  
            och reaktionstiden blir avgörande.
          </p>
        </motion.div>

        {/* ===== 3D MODEL ===== */}
        <motion.div
          style={{ opacity: modelOpacity }}
          className="absolute inset-0"
        >
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
            <ambientLight intensity={1} />
            <directionalLight position={[2, 2, 2]} />
            <SnowStick />
          </Canvas>
        </motion.div>

      </div>
    </div>
  );
}
