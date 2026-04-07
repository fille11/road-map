import { motion } from "framer-motion";

export default function HeroProduct() {
  return (
    <section style={{
      height: "100vh",
      background: "black",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }}>

      {/* Glow */}
      <div style={{
        position: "absolute",
        width: "500px",
        height: "500px",
        background: "#3b82f6",
        opacity: 0.2,
        filter: "blur(120px)",
        borderRadius: "50%"
      }} />

      {/* Product */}
      <div style={{ marginBottom: "40px", position: "relative" }}>

        {/* Stick */}
        <div style={{
          width: "10px",
          height: "200px",
          background: "#aaa",
          margin: "0 auto"
        }} />

        {/* Top (animated) */}
        <motion.div
          initial={{ backgroundColor: "#ffffff" }}
          animate={{
            backgroundColor: ["#ffffff", "#60a5fa", "#3b82f6"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            width: "30px",
            height: "60px",
            borderRadius: "20px",
            margin: "-20px auto 0",
            boxShadow: "0 0 40px rgba(59,130,246,0.8)"
          }}
        />

      </div>

      {/* Text */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ fontSize: "48px", textAlign: "center" }}
      >
        Se vintern innan den slår till.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ color: "#aaa", marginTop: "20px" }}
      >
        En intelligent snökäpp kopplad till realtidsdata.
      </motion.p>

    </section>
  );
}
