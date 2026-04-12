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

  // Phase 1 (0-0.4): Video plays fullscreen, text not visible yet
  // Phase 2 (0.4-0.7): Video masks into the text, overlay darkens
  // Phase 3 (0.7-1): Text with video inside fades out, transitions to next section

  // Mask text opacity - fades in during transition
  const maskTextOpacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.4, 0.7, 0.85],
    [0, 0, 1, 1, 0]
  );

  // Scale of the mask text container
  const maskTextScale = useTransform(
    smoothProgress,
    [0, 0.25, 0.4, 0.7, 0.85],
    [0.9, 0.9, 1, 1, 1.05]
  );

  // Y position of the mask text
  const maskTextY = useTransform(
    smoothProgress,
    [0, 0.25, 0.4, 0.7, 0.85],
    [50, 50, 0, 0, -80]
  );

  // Black overlay that covers the video OUTSIDE the text
  // Starts transparent, becomes fully opaque during mask phase
  const blackOverlayOpacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.7],
    [0, 0, 1, 1]
  );

  // Subtle video zoom for cinematic depth
  const videoScale = useTransform(
    smoothProgress,
    [0, 1],
    [1, 1.2]
  );

  // Initial dark overlay on video (for readability)
  const initialOverlayOpacity = useTransform(
    smoothProgress,
    [0, 0.3, 0.5],
    [0.25, 0.25, 0]
  );

  // Subtitle opacity
  const subtitleOpacity = useTransform(
    smoothProgress,
    [0, 0.35, 0.45, 0.65, 0.8],
    [0, 0, 1, 1, 0]
  );

  const subtitleY = useTransform(
    smoothProgress,
    [0, 0.35, 0.45, 0.65, 0.8],
    [20, 20, 0, 0, -30]
  );

  return (
    <section ref={sectionRef} className="hero-section">
      {/* Sticky container that stays fixed while scrolling */}
      <div className="video-container">
        {/* Base video layer */}
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

        {/* Initial subtle overlay for better contrast */}
        <motion.div
          className="video-overlay"
          style={{ opacity: initialOverlayOpacity }}
        />

        {/* Black overlay that reveals video only through text */}
        <motion.div
          className="mask-overlay"
          style={{ opacity: blackOverlayOpacity }}
        />

        {/* Text with video visible inside (using mix-blend-mode) */}
        <div className="hero-content">
          <motion.div
            className="mask-text-wrapper"
            style={{
              opacity: maskTextOpacity,
              scale: maskTextScale,
              y: maskTextY,
            }}
          >
            {/* This creates the knockout effect - white text that reveals video underneath */}
            <h1 className="mask-text">THE ROAD</h1>
            <h1 className="mask-text">AHEAD</h1>
          </motion.div>

          <motion.p
            className="hero-subtitle-masked"
            style={{
              opacity: subtitleOpacity,
              y: subtitleY,
            }}
          >
            Experience the journey like never before
          </motion.p>
        </div>
      </div>
    </section>
  );
}
