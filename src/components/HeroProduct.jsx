import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SnowStick3D from "./SnowStick3D";

export default function HeroProduct() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 🧠 opacity för text
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  // 🔵 glow intensity
  const glow = useTransform(scrollYProgress, [0.2, 0.5], [0.2, 0.8]);

  // 🔵 scale effect
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  return (
    <section
      ref={ref}
      style={{
        height: "500vh",
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
        {/* 🔥 GLOW */}
        <motion.div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            background: "#3b82f6",
            opacity: glow,
            filter: "blur(150px)",
            borderRadius: "50%",
          }}
        />

        {/* 🧊 3D MODEL */}
        <motion.div style={{ scale }}>
          <SnowStick3D />
        </motion.div>

        {/* 🧠 SCENE TEXT */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "15%",
            textAlign: "center",
            opacity,
          }}
        >
          <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
            Se vintern innan den slår till.
          </h1>
          <p style={{ color: "#aaa" }}>
            En intelligent snökäpp kopplad till realtidsdata.
          </p>
        </motion.div>
      </div>

      {/* ⚠️ SCENE 2 */}
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ fontSize: "40px" }}>
          {"Vägar fryser snabbare än du tror.".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ color: "#444" }}
              whileInView={{ color: "#60a5fa" }}
              transition={{ delay: i * 0.05 }}
            >
              {char}
            </motion.span>
          ))}
        </h2>
      </div>

      {/* 🔵 SCENE 3 */}
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          style={{ fontSize: "40px", color: "#60a5fa" }}
        >
          Vid +2°C reagerar den direkt.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: "#aaa" }}
        >
          Realtidsvarning direkt på vägen.
        </motion.p>
      </div>

      {/* 💎 SCENE 4 */}
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {[
            "Färre olyckor",
            "Mindre salt",
            "Lägre kostnader",
            "Bättre miljö",
          ].map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              style={{ margin: "10px 0", fontSize: "20px" }}
            >
              {text}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🚀 SCENE 5 */}
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            background: "#3b82f6",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Se data
        </motion.button>
      </div>
    </section>
  );
}
