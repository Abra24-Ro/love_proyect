import { motion } from "framer-motion";
import { MENSAJE_FINAL_GALAXIA } from "../../data/galaxia";

export default function CierreGalaxia() {
  return (
    <motion.p
      className="pointer-events-none absolute inset-x-0 z-[200] px-10 text-center font-hand text-xl text-sol-200/85"
      style={{ top: "9.5rem" }}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 1 }}
    >
      {MENSAJE_FINAL_GALAXIA}
    </motion.p>
  );
}