import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection() {
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7], [0, 1, 1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7], [0.8, 1, 1.05, 1.1]);
  const textY = useTransform(scrollYProgress, [0.5, 0.7], [0, -50]);

  return (
    <section ref={sectionRef} className="hero-section">
      <div className="video-container">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
        >
          <source
            src="https://videos.pexels.com/video-files/855207/855207-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="video-overlay" />
      </div>

      <div className="hero-content">
        <motion.div
          className="hero-text-wrapper"
          style={{
            opacity: textOpacity,
            scale: textScale,
            y: textY,
          }}
        >
          <h1 className="hero-title">
            <span className="gradient-text">The Road Ahead</span>
          </h1>
          <p className="hero-subtitle">Experience the journey like never before</p>
        </motion.div>
      </div>
    </section>
  );
}
