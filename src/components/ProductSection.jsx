import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ProductSection() {
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.5], [0, 1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.5], [80, 0, 0, -40]);

  const opacity2 = useTransform(scrollYProgress, [0.3, 0.5, 0.7, 0.8], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.3, 0.5, 0.7, 0.8], [80, 0, 0, -40]);

  const opacity3 = useTransform(scrollYProgress, [0.6, 0.8, 0.95], [0, 1, 1]);
  const y3 = useTransform(scrollYProgress, [0.6, 0.8, 0.95], [80, 0, 0]);

  return (
    <section ref={sectionRef} className="product-section">
      <div className="product-content">
        <motion.div
          className="product-block"
          style={{ opacity: opacity1, y: y1 }}
        >
          <h2 className="product-title">Precision Engineering</h2>
          <p className="product-description">
            Every detail meticulously crafted for performance. Built with advanced 
            materials that redefine what&apos;s possible on the road.
          </p>
        </motion.div>

        <motion.div
          className="product-block"
          style={{ opacity: opacity2, y: y2 }}
        >
          <h2 className="product-title">Intelligent Design</h2>
          <p className="product-description">
            Seamlessly integrated technology that anticipates your needs. 
            A driving experience that feels intuitive and effortless.
          </p>
        </motion.div>

        <motion.div
          className="product-block"
          style={{ opacity: opacity3, y: y3 }}
        >
          <h2 className="product-title">Endless Possibilities</h2>
          <p className="product-description">
            Where innovation meets the horizon. Every journey becomes an adventure 
            waiting to unfold.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
