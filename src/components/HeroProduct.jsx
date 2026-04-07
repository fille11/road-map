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
          Vägar fryser snabbare än du tror.
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
          <h2 style={{ fontSize: "40px", marginBottom: "40px" }}>
            Vid +2°C reagerar den direkt.
          </h2>

          {/* Stick again */}
          <div>
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
