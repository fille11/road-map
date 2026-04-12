import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function HeroSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring physics for premium feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  // Text animations with breathing room:
  // 0-0.15: invisible, waiting
  // 0.15-0.35: fade in + scale up
  // 0.35-0.55: hold visible (breathing room)
  // 0.55-0.75: fade out + move up
  // 0.75-1: gone
  const textOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.35, 0.55, 0.75],
    [0, 0, 1, 1, 0]
  );

  const textScale = useTransform(
    smoothProgress,
    [0, 0.15, 0.35, 0.55, 0.75],
    [0.95, 0.95, 1, 1, 1.02]
  );

  const textY = useTransform(
    smoothProgress,
    [0, 0.15, 0.35, 0.55, 0.75],
    [30, 30, 0, 0, -60]
  );

  // Subtle video zoom for cinematic depth
  const videoScale = useTransform(
    smoothProgress,
    [0, 1],
    [1, 1.15]
  );

  // Overlay darkens as we scroll
  const overlayOpacity = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [0.3, 0.5, 0.85]
  );

  return (
    <section ref={sectionRef} className="hero-section">
      <div className="video-container">
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
          style={{ scale: videoScale }}
        >
          <source
            src="https://videos.pexels.com/video-files/855207/855207-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </motion.video>
        <motion.div
          className="video-overlay"
          style={{ opacity: overlayOpacity }}
        />
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
