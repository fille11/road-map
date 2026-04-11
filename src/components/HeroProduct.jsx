import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroProduct() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 🔵 färg för toppen
  const topColor = useTransform(
    scrollYProgress,
    [0.3, 0.6],
    ["#ffffff", "#3b82f6"]
  );

  // ✨ glow
  const glowOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 0.6]);

  return (
    <div ref={ref}>
      {/* 🔥 HERO */}
      <section
        style={{
          height: "150vh",
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
          }}
        >
          <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
            Se vintern innan den slår till.
          </h1>

          <p style={{ color: "#aaa" }}>
            En intelligent snökäpp kopplad till realtidsdata.
          </p>
        </div>
      </section>

      {/* ❄️ PROBLEM */}
      <section
        style={{
          height: "100vh",
          background: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ fontSize: "40px", maxWidth: "700px", textAlign: "center" }}>
          {"Vägar fryser snabbare än du tror.".split("").map((char, i) => {
            const start = i / 40;
            const end = start + 0.02;

            const color = useTransform(
              scrollYProgress,
              [start, end],
              ["#444", "#60a5fa"]
            );

            return (
              <motion.span key={i} style={{ color }}>
                {char}
              </motion.span>
            );
          })}
        </h2>
      </section>

      {/* 🧊 SOLUTION */}
      <section
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
          }}
        >
          <h2 style={{ fontSize: "40px", marginBottom: "20px" }}>
            Vid +2°C reagerar den direkt.
          </h2>

          {/* glow */}
          <motion.div
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              background: "#3b82f6",
              opacity: glowOpacity,
              filter: "blur(120px)",
              borderRadius: "50%",
            }}
          />

          {/* PRODUCT */}
          <div style={{ position: "relative", marginTop: "40px" }}>
            {/* stick */}
            <div
              style={{
                width: "10px",
                height: "200px",
                background: "#aaa",
                margin: "0 auto",
              }}
            />

            {/* top */}
            <motion.div
              style={{
                backgroundColor: topColor,
                width: "30px",
                height: "60px",
                borderRadius: "20px",
                margin: "-20px auto 0",
                boxShadow: "0 0 40px rgba(59,130,246,0.8)",
              }}
            />
          </div>
        </div>
      </section>

      {/* 💎 VALUE */}
      <section
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
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: "600px", height: "400px" }}>
            {[
              "Färre olyckor",
              "Stabilare trafik",
              "Mindre salt",
              "Lägre kostnader",
              "Bättre miljö",
              "Datadriven drift",
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                style={{
                  position: "absolute",
                  color: "#ccc",
                  fontSize: "14px",

                  top: ["20%", "20%", "50%", "50%", "75%", "75%"][i],
                  left: ["30%", "70%", "25%", "75%", "40%", "60%"][i],
                }}
              >
                {text}
              </motion.div>
            ))}

            {/* PRODUCT */}
            <div style={{ position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)" }}>
              <div
                style={{
                  width: "10px",
                  height: "200px",
                  background: "#aaa",
                  margin: "0 auto",
                }}
              />

              <div
                style={{
                  width: "30px",
                  height: "60px",
                  background: "#3b82f6",
                  borderRadius: "20px",
                  margin: "-20px auto 0",
                  boxShadow: "0 0 40px rgba(59,130,246,0.8)",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
