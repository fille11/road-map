import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ModelSection() {
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-15, 15]);

  return (
    <section ref={sectionRef} className="model-section">
      <motion.div
        className="model-container"
        style={{ opacity, scale }}
      >
        <motion.div
          className="model-placeholder"
          style={{ rotateY }}
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
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h2 className="model-title">Explore Every Angle</h2>
        <p className="model-description">
          Immerse yourself in the details with our interactive 3D experience
        </p>
      </motion.div>
    </section>
  );
}
