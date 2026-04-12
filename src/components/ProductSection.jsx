import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

function ProductBlock({ children, scrollYProgress, startAt, endAt }) {
  // Smooth spring for premium feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  // Calculate animation phases within this block's range
  const rangeSize = endAt - startAt;
  const fadeInEnd = startAt + rangeSize * 0.25;
  const holdStart = fadeInEnd;
  const holdEnd = startAt + rangeSize * 0.7;
  const fadeOutEnd = endAt;

  const opacity = useTransform(
    smoothProgress,
    [startAt, fadeInEnd, holdStart, holdEnd, fadeOutEnd],
    [0, 1, 1, 1, 0]
  );

  const y = useTransform(
    smoothProgress,
    [startAt, fadeInEnd, holdStart, holdEnd, fadeOutEnd],
    [60, 0, 0, 0, -40]
  );

  const scale = useTransform(
    smoothProgress,
    [startAt, fadeInEnd, holdStart, holdEnd, fadeOutEnd],
    [0.96, 1, 1, 1, 0.98]
  );

  return (
    <motion.div
      className="product-block"
      style={{ opacity, y, scale }}
    >
      {children}
    </motion.div>
  );
}

export default function ProductSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={sectionRef} className="product-section">
      <div className="product-content">
        {/* Block 1: 0.05 - 0.35 */}
        <ProductBlock scrollYProgress={scrollYProgress} startAt={0.05} endAt={0.35}>
          <h2 className="product-title">Precision Engineering</h2>
          <p className="product-description">
            Every detail meticulously crafted for performance. Built with advanced
            materials that redefine what&apos;s possible on the road.
          </p>
        </ProductBlock>

        {/* Block 2: 0.35 - 0.65 */}
        <ProductBlock scrollYProgress={scrollYProgress} startAt={0.35} endAt={0.65}>
          <h2 className="product-title">Intelligent Design</h2>
          <p className="product-description">
            Seamlessly integrated technology that anticipates your needs.
            A driving experience that feels intuitive and effortless.
          </p>
        </ProductBlock>

        {/* Block 3: 0.65 - 0.95 */}
        <ProductBlock scrollYProgress={scrollYProgress} startAt={0.65} endAt={0.95}>
          <h2 className="product-title">Endless Possibilities</h2>
          <p className="product-description">
            Where innovation meets the horizon. Every journey becomes an adventure
            waiting to unfold.
          </p>
        </ProductBlock>
      </div>
    </section>
  );
}
