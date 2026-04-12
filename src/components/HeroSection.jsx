import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function HeroSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Ultra-smooth spring physics for Apple-like feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 30,
    restDelta: 0.0001,
  });

  // Phase 1 (0-0.3): Video plays fullscreen with subtle zoom
  // Phase 2 (0.3-0.5): Text fades in beautifully
  // Phase 3 (0.5-0.8): Text holds with video inside
  // Phase 4 (0.8-1): Everything fades out elegantly

  // Mask text opacity with longer hold time
  const maskTextOpacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.35, 0.65, 0.85],
    [0, 0, 1, 1, 0]
  );

  // Scale animation - starts smaller, scales up smoothly
  const maskTextScale = useTransform(
    smoothProgress,
    [0, 0.2, 0.35, 0.65, 0.85],
    [0.85, 0.85, 1, 1.02, 1.08]
  );

  // Y position with elegant ease
  const maskTextY = useTransform(
    smoothProgress,
    [0, 0.2, 0.35, 0.65, 0.85],
    [80, 80, 0, 0, -100]
  );

  // Letter spacing animation for premium feel
  const letterSpacing = useTransform(
    smoothProgress,
    [0, 0.2, 0.35, 0.65],
    [-8, -8, -4, -2]
  );

  // Black overlay for video knockout effect
  const blackOverlayOpacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.45, 0.7],
    [0, 0, 1, 1]
  );

  // Cinematic video zoom
  const videoScale = useTransform(
    smoothProgress,
    [0, 1],
    [1, 1.3]
  );

  // Video brightness dims as we scroll
  const videoBrightness = useTransform(
    smoothProgress,
    [0, 0.5, 0.8],
    [1, 0.9, 0.7]
  );

  // Initial overlay
  const initialOverlayOpacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.45],
    [0.15, 0.15, 0]
  );

  // Subtitle with staggered timing
  const subtitleOpacity = useTransform(
    smoothProgress,
    [0, 0.32, 0.42, 0.6, 0.8],
    [0, 0, 1, 1, 0]
  );

  const subtitleY = useTransform(
    smoothProgress,
    [0, 0.32, 0.42, 0.6, 0.8],
    [30, 30, 0, 0, -40]
  );

  // Scroll indicator
  const scrollIndicatorOpacity = useTransform(
    smoothProgress,
    [0, 0.08, 0.15],
    [1, 1, 0]
  );

  return (
    <section ref={sectionRef} className="hero-section">
      {/* Sticky container */}
      <div className="video-container">
        {/* Video with cinematic zoom and brightness */}
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
          style={{ 
            scale: videoScale,
            filter: useTransform(videoBrightness, (v) => `brightness(${v})`)
          }}
        >
          <source
            src="https://xonbkazvfxllffjbqfdm.supabase.co/storage/v1/object/public/videos/Videoprojekt%203.mp4"
            type="video/mp4"
          />
        </motion.video>

        {/* Subtle initial overlay */}
        <motion.div
          className="video-overlay"
          style={{ opacity: initialOverlayOpacity }}
        />

        {/* Black overlay for text knockout */}
        <motion.div
          className="mask-overlay"
          style={{ opacity: blackOverlayOpacity }}
        />

        {/* Text with video visible inside */}
        <div className="hero-content">
          <motion.div
            className="mask-text-wrapper"
            style={{
              opacity: maskTextOpacity,
              scale: maskTextScale,
              y: maskTextY,
            }}
          >
            <motion.h1 
              className="mask-text"
              style={{ letterSpacing }}
            >
              THE ROAD
            </motion.h1>
            <motion.h1 
              className="mask-text"
              style={{ letterSpacing }}
            >
              AHEAD
            </motion.h1>
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

        {/* Scroll indicator */}
        <motion.div 
          className="scroll-indicator"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <div className="scroll-line" />
          <span className="scroll-text">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}
