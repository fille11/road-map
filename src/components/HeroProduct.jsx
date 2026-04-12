import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

export default function HeroProduct() {
  // 🎯 refs
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  // 📜 scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 🎥 scroll → video sync (APPLE STYLE)
  useEffect(() => {
    const video = videoRef.current;

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (video && video.duration) {
        video.currentTime = progress * video.duration;
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // 🎨 TEXT TIMING
  const text1Opacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);
  const text2Opacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);
  const dataOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);

  // 🔵 färgskifte
  const textColor = useTransform(
    scrollYProgress,
    [0.3, 0.5],
    ["#cccccc", "#60a5fa"]
  );

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          position: "relative",
          height: "200vh",
        }}
      >
        {/* 🎥 VIDEO */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source
            src="https://xonbkazvfxllffjbqfdm.supabase.co/storage/v1/object/sign/videos/Videoprojekt%203.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83NmFmNGE4OC1jMDQxLTQyMzMtYWNmZC0wZTEwZTgzODAyOTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvVmlkZW9wcm9qZWt0IDMubXA0IiwiaWF0IjoxNzc1OTk1NDY1LCJleHAiOjQ4OTgwNTk0NjV9.rfyuilFGi1zdFJQeqjBy34KNidRG2ghnB81M9oAcp6Y"
            type="video/mp4"
          />
        </video>

        {/* 🌑 OVERLAY */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
          }}
        />

        {/* 🧠 CONTENT */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "white",
            padding: "20px",
          }}
        >
          {/* TEXT 1 */}
          <motion.h1
            style={{
              opacity: text1Opacity,
              color: textColor,
              fontSize: "48px",
              maxWidth: "800px",
              marginBottom: "20px",
            }}
          >
            Vägar fryser snabbare än du tror.
          </motion.h1>

          {/* TEXT 2 */}
          <motion.p
            style={{
              opacity: text2Opacity,
              color: "#ccc",
              maxWidth: "600px",
              fontSize: "18px",
            }}
          >
            Varje vinter sker tusentals olyckor på grund av halka.
          </motion.p>

          {/* DATA */}
          <motion.div
            style={{
              opacity: dataOpacity,
              marginTop: "40px",
              color: "#60a5fa",
            }}
          >
            <h2 style={{ fontSize: "42px" }}>
              ~15 000 olyckor / år
            </h2>
            <p style={{ color: "#aaa" }}>
              Hundratals skadade varje vinter
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
