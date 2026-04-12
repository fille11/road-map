import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function SnowStick() {
  const { scene } = useGLTF(
    "https://xonbkazvfxllffjbqfdm.supabase.co/storage/v1/object/public/models/snowstick1.glb"
  );
  return <primitive object={scene} scale={1.5} />;
}

export default function HeroProduct() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Fade controls
  const videoOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const infoOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const modelOpacity = useTransform(scrollYProgress, [0.65, 0.85], [0, 1]);

  return (
    <div ref={ref} className="bg-black text-white">

      {/* ===== VIDEO SECTION ===== */}
      <section className="h-screen w-full sticky top-0 overflow-hidden">
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          style={{ opacity: videoOpacity }}
          className="absolute w-full h-full object-cover"
        >
          <source
            src="https://xonbkazvfxllffjbqfdm.supabase.co/storage/v1/object/sign/videos/Videoprojekt%203.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NmFmNGE4OC1jMDQxLTQyMzMtYWNmZC0wZTEwZTgzODAyOTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvVmlkZW9wcm9qZWt0IDMubXA0IiwiaWF0IjoxNzc1OTk1Nzc1LCJleHAiOjQ4OTgwNTk3NzV9.WApkgYEwczioPXb9Iv-K0UYLuMXpn0tg_ifloFTIpek"
            type="video/mp4"
          />
        </motion.video>

        {/* TEXT OVER VIDEO */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute inset-0 flex items-center justify-center text-center px-6"
        >
          <h1 className="text-5xl md:text-7xl font-semibold text-blue-400">
            Vintervägar dödar.
          </h1>
        </motion.div>
      </section>

      {/* ===== INFO SECTION ===== */}
      <section className="h-screen flex items-center justify-center px-6">
        <motion.div
          style={{ opacity: infoOpacity }}
          className="max-w-3xl text-center"
        >
          <h2 className="text-4xl md:text-6xl font-semibold text-blue-400 mb-6">
            Över 1000 olyckor varje vinter
          </h2>
          <p className="text-lg text-gray-300">
            Halkolyckor orsakar varje år tusentals skador. 
            Is, snö och dålig sikt gör vägar farliga – 
            och reaktionstiden blir avgörande.
          </p>
        </motion.div>
      </section>

      {/* ===== TRANSITION TEXT ===== */}
      <section className="h-screen flex items-center justify-center">
        <h2 className="text-5xl md:text-7xl font-semibold text-blue-400 text-center">
          En lösning.
        </h2>
      </section>

      {/* ===== 3D MODEL SECTION ===== */}
      <section className="h-screen w-full sticky top-0">
        <motion.div
          style={{ opacity: modelOpacity }}
          className="w-full h-full"
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={1} />
            <directionalLight position={[2, 2, 2]} />
            <SnowStick />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </motion.div>
      </section>

      {/* EXTRA SPACE FOR SCROLL */}
      <div className="h-[100vh]" />
    </div>
  );
}
