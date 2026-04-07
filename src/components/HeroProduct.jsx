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
            <div
              style={{
                width: "10px",
                height: "200px",
                background: "#aaa",
                margin: "0 auto",
              }}
            />

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

      {/* 🌡️ SECTION 3 – MAGIC */}
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
          {/* TEXT */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ fontSize: "40px", marginBottom: "40px" }}
          >
            {"Vid +2°C reagerar den direkt.".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ color: "#555" }}
                whileInView={{ color: "#60a5fa" }}
                transition={{ delay: i * 0.04 }}
                viewport={{ once: true }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>

          {/* PRODUCT */}
          <div style={{ position: "relative" }}>
            {/* Stick */}
            <div
              style={{
                width: "10px",
                height: "200px",
                background: "#aaa",
                margin: "0 auto",
              }}
            />

            {/* 🔥 TOP (trigger animation) */}
            <motion.div
              initial={{ backgroundColor: "#ffffff", scale: 1 }}
              whileInView={{
                backgroundColor: "#3b82f6",
                scale: 1.2,
              }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              style={{
                width: "30px",
                height: "60px",
                borderRadius: "20px",
                margin: "-20px auto 0",
                boxShadow: "0 0 40px rgba(59,130,246,0.8)",
              }}
            />

            {/* ✨ Glow burst */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{
                opacity: 0.6,
                scale: 2,
              }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{
                position: "absolute",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100px",
                height: "100px",
                background: "#3b82f6",
                filter: "blur(40px)",
                borderRadius: "50%",
              }}
            />
          </div>
        </div>
      </section>

      {/* 🗺️ SECTION 4 – PLATFORM */}
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
        <h2 style={{ fontSize: "40px", marginBottom: "20px" }}>
          Kopplad till realtidsdata
        </h2>

        <p style={{ color: "#aaa" }}>
          Få full kontroll över vägnätet.
        </p>

        {/* Fake map */}
        <div
          style={{
            width: "600px",
            height: "300px",
            background: "#111",
            marginTop: "40px",
            borderRadius: "20px",
            border: "1px solid #333",
          }}
        />
      </section>
    </>
  );
}
