import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function ModelSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring for cinematic feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  // Model container animations
  // Fade in from 0.1 to 0.35, hold, slight fade at end
  const containerOpacity = useTransform(
    smoothProgress,
    [0, 0.1, 0.35, 0.8, 1],
    [0, 0, 1, 1, 0.9]
  );

  const containerScale = useTransform(
    smoothProgress,
    [0, 0.1, 0.35, 0.8],
    [0.92, 0.92, 1, 1]
  );

  const containerY = useTransform(
    smoothProgress,
    [0, 0.1, 0.35],
    [80, 80, 0]
  );

  // Subtle 3D rotation for depth
  const rotateY = useTransform(
    smoothProgress,
    [0.1, 0.5, 0.9],
    [-8, 0, 8]
  );

  const rotateX = useTransform(
    smoothProgress,
    [0.1, 0.5, 0.9],
    [5, 0, -3]
  );

  // Text info animations - delayed from model
  const textOpacity = useTransform(
    smoothProgress,
    [0.25, 0.45, 0.85, 1],
    [0, 1, 1, 0.8]
  );

  const textY = useTransform(
    smoothProgress,
    [0.25, 0.45],
    [50, 0]
  );

  return (
    <section ref={sectionRef} className="model-section">
      <motion.div
        className="model-container"
        style={{
          opacity: containerOpacity,
          scale: containerScale,
          y: containerY,
        }}
      >
        <motion.div
          className="model-placeholder"
          style={{
            rotateY,
            rotateX,
          }}
        >
          <div className="model-inner">
            <div className="model-glow" />
            <span className="model-label">3D Model</span>
            <p className="model-sublabel">Interactive Preview</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="model-info"
        style={{
          opacity: textOpacity,
          y: textY,
        }}
      >
        <h2 className="model-title">Explore Every Angle</h2>
        <p className="model-description">
          Immerse yourself in the details with our interactive 3D experience
        </p>
      </motion.div>
    </section>
  );
}
