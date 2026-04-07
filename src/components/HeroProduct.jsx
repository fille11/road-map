import { motion } from "framer-motion";

export default function HeroProduct() {
  return (
    <section className="h-screen w-full bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">

      {/* Glow background */}
      <div className="absolute w-[600px] h-[600px] bg-blue-500 opacity-20 blur-3xl rounded-full" />

      {/* PRODUCT */}
      <div className="relative mb-12">

        {/* Bottom part */}
        <div className="w-6 h-64 bg-gray-400 rounded-full mx-auto" />

        {/* Top part (magic) */}
        <motion.div
          initial={{ backgroundColor: "#ffffff" }}
          animate={{
            backgroundColor: ["#ffffff", "#60a5fa", "#3b82f6"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-10 h-16 rounded-full mx-auto -mt-6 shadow-[0_0_40px_rgba(59,130,246,0.8)]"
        />

      </div>

      {/* TEXT */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-semibold text-center max-w-3xl"
      >
        Se vintern innan den slår till.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-400 mt-6 text-lg text-center max-w-xl"
      >
        En intelligent snökäpp kopplad till realtidsdata om vägar och temperatur.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10"
      >
        <button className="px-8 py-4 bg-white text-black rounded-full text-lg font-medium hover:scale-105 transition">
          Utforska plattformen
        </button>
      </motion.div>

    </section>
  );
}
