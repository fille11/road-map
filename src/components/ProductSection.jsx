import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

function ProductBlock({ children, scrollYProgress, startAt, endAt, index }) {
  // Ultra-smooth spring for Apple-like feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 35,
    damping: 30,
    restDelta: 0.0001,
  });

  // Calculate animation phases with more breathing room
  const rangeSize = endAt - startAt;
  const fadeInStart = startAt;
  const fadeInEnd = startAt + rangeSize * 0.3;
  const holdEnd = startAt + rangeSize * 0.65;
  const fadeOutEnd = endAt;

  const opacity = useTransform(
    smoothProgress,
    [fadeInStart, fadeInEnd, holdEnd, fadeOutEnd],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    smoothProgress,
    [fadeInStart, fadeInEnd, holdEnd, fadeOutEnd],
    [100, 0, 0, -60]
  );

  const scale = useTransform(
    smoothProgress,
    [fadeInStart, fadeInEnd, holdEnd, fadeOutEnd],
    [0.92, 1, 1, 0.96]
  );

  // Blur effect for depth
  const blur = useTransform(
    smoothProgress,
    [fadeInStart, fadeInEnd, holdEnd, fadeOutEnd],
    [8, 0, 0, 4]
  );

  // Rotation for 3D feel
  const rotateX = useTransform(
    smoothProgress,
    [fadeInStart, fadeInEnd, holdEnd, fadeOutEnd],
    [8, 0, 0, -4]
  );

  return (
    <motion.div
      className="product-block"
      style={{ 
        opacity, 
        y, 
        scale,
        rotateX,
        filter: useTransform(blur, (b) => `blur(${b}px)`),
        transformPerspective: 1200,
      }}
    >
      {children}
    </motion.div>
  );
}

// Animated text that reveals word by word
function AnimatedText({ text, className, scrollYProgress, startAt, endAt }) {
  const words = text.split(" ");
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 30,
  });

  return (
    <span className={className}>
      {words.map((word, i) => {
        const wordStart = startAt + ((endAt - startAt) / words.length) * i * 0.5;
        const wordEnd = wordStart + 0.15;
        
        const opacity = useTransform(
          smoothProgress,
          [wordStart, wordEnd],
          [0.3, 1]
        );
        
        const y = useTransform(
          smoothProgress,
          [wordStart, wordEnd],
          [10, 0]
        );

        return (
          <motion.span
            key={i}
            style={{ 
              opacity, 
              y,
              display: "inline-block",
              marginRight: "0.3em",
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </span>
  );
}

export default function ProductSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background gradient that shifts with scroll
  const bgOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 0.5, 0.5, 0]
  );

  return (
    <section ref={sectionRef} className="product-section">
      {/* Subtle gradient background */}
      <motion.div 
        className="product-bg-gradient"
        style={{ opacity: bgOpacity }}
      />
      
      <div className="product-content">
        {/* Block 1: 0.05 - 0.35 */}
        <ProductBlock 
          scrollYProgress={scrollYProgress} 
          startAt={0.05} 
          endAt={0.35}
          index={0}
        >
          <span className="product-eyebrow">Innovation</span>
          <h2 className="product-title">Precision Engineering</h2>
          <p className="product-description">
            Every detail meticulously crafted for performance. Built with advanced
            materials that redefine what&apos;s possible on the road.
          </p>
        </ProductBlock>

        {/* Block 2: 0.35 - 0.65 */}
        <ProductBlock 
          scrollYProgress={scrollYProgress} 
          startAt={0.35} 
          endAt={0.65}
          index={1}
        >
          <span className="product-eyebrow">Technology</span>
          <h2 className="product-title">Intelligent Design</h2>
          <p className="product-description">
            Seamlessly integrated technology that anticipates your needs.
            A driving experience that feels intuitive and effortless.
          </p>
        </ProductBlock>

        {/* Block 3: 0.65 - 0.95 */}
        <ProductBlock 
          scrollYProgress={scrollYProgress} 
          startAt={0.65} 
          endAt={0.95}
          index={2}
        >
          <span className="product-eyebrow">Vision</span>
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
