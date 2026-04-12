import { motion } from "framer-motion";
import SnowStick3D from "./SnowStick3D";

export default function HeroProduct() {
  return (
    <>
      {/* 🎬 SECTION 1 – VIDEO + EMOTION */}
      <section
        style={{
          position: "relative",
          height: "120vh",
          overflow: "hidden",
        }}
      >
        {/* VIDEO */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source
            src="https://res.cloudinary.com/dologmyu6/video/upload/v1775673374/Videoprojekt_21_rreief.mp4"
            type="video/mp4"
          />
        </video>

        {/* DARK OVERLAY */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
          }}
        />

        {/* TEXT */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: "48px", marginBottom: "20px" }}
          >
            Vägar fryser snabbare än du tror.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ color: "#ccc", maxWidth: "600px" }}
          >
            Tusentals olyckor sker varje vinter på grund av halka.
          </motion.p>

          {/* DATA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ marginTop: "30px", color: "#60a5fa" }}
          >
            <h2 style={{ fontSize: "40px" }}>~15 000 olyckor / år</h2>
            <p style={{ color: "#aaa" }}>Flera hundra allvarligt skadade</p>
          </motion.div>
        </div>
      </section>

      {/* 📊 SECTION 2 – PROBLEM */}
      <section
        style={{
          height: "100vh",
          background: "black",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: "40px" }}
        >
          Problemet är inte snön.
          <br />
          Det är temperaturen.
        </motion.h2>
      </section>

      {/* 🧊 SECTION 3 – PRODUKT */}
      <section
        style={{
          height: "120vh",
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
            padding: "20px",
          }}
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            style={{ fontSize: "40px", marginBottom: "40px", textAlign: "center" }}
          >
            Vid +2°C reagerar den direkt.
          </motion.h2>

          {/* 3D MODEL */}
          <div style={{ width: "400px", height: "400px" }}>
            <SnowStick3D />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ color: "#aaa", marginTop: "20px", textAlign: "center" }}
          >
            En visuell varning direkt på vägen.
          </motion.p>
        </div>
      </section>

      {/* 🚀 SECTION 4 – CTA */}
      <section
        style={{
          height: "100vh",
          background: "black",
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
      </section>
    </>
  );
}
