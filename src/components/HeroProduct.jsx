import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SnowStick3D from "../components/SnowStick3D";

export default function HeroProduct() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 🔵 glow styrs av scroll
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5], [0.2, 0.6]);

  // 🧠 text fade in
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <>
      {/* 🔥 HERO SECTION */}
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
          {/* ✨ Glow bakom */}
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

          {/* 🧊 3D MODEL */}
          <div style={{ marginBottom: "40px", width: "300px" }}>
            <SnowStick3D />
          </div>

          {/* 🧠 TEXT */}
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
              fontSize: "18px",
            }}
          >
            En intelligent snökäpp kopplad till realtidsdata.
          </motion.p>
        </div>
      </section>

      {/* ❄️ SECTION 2 – PROBLEM */}
      <section
        style={{
          height: "100vh",
          background: "black",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ fontSize: "40px", textAlign: "center", maxWidth: "700px" }}>
          {"Vägar fryser snabbare än du tror.".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ color: "#555" }}
              whileInView={{ color: "#60a5fa" }}
              transition={{
                delay: i * 0.05,
              }}
              viewport={{ once: true }}
            >
              {char}
            </motion.span>
          ))}
        </h2>
      </section>

      {/* ⚡ SECTION 3 – REACTION */}
      <section
        style={{
          height: "100vh",
          background: "black",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          style={{
            fontSize: "40px",
            marginBottom: "20px",
            color: "#60a5fa",
          }}
        >
          Vid +2°C reagerar den direkt.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            color: "#aaa",
            fontSize: "16px",
          }}
        >
          Realtidsvarning direkt på vägen.
        </motion.p>
      </section>
    </>
  );
}
