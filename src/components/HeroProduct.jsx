import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroProduct() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 🔵 färg ändras när man scrollar
  const bgColor = useTransform(
    scrollYProgress,
    [0.2, 0.5],
    ["#ffffff", "#3b82f6"]
  );

  // ✨ glow ökar lite
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5], [0.2, 0.6]);

  // 🧠 text fade in
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section
      ref={ref}
      style={{
        height: "200vh",
        background: "black",
        color: "white",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <motion.div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            background: "#3b82f6",
            opacity: glowOpacity,
            filter: "blur(120px)",
            borderRadius: "50%",
          }}
        />

        {/* Product */}
        <div style={{ marginBottom: "40px", position: "relative" }}>
          {/* Stick */}
          <div
            style={{
              width: "10px",
              height: "200px",
              background: "#aaa",
              margin: "0 auto",
            }}
          />

          {/* Top (scroll-controlled) */}
          <motion.div
            style={{
              backgroundColor: bgColor,
              width: "30px",
              height: "60px",
              borderRadius: "20px",
              margin: "-20px auto 0",
              boxShadow: "0 0 40px rgba(59,130,246,0.8)",
            }}
          />
        </div>

        {/* Text */}
        <motion.h1
          style={{
            opacity,
            fontSize: "48px",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Se vintern innan den slår till.
        </motion.h1>

        <motion.p
          style={{
            opacity,
            color: "#aaa",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          En intelligent snökäpp kopplad till realtidsdata.
        </motion.p>
      </div>
    </section>
  );
}
