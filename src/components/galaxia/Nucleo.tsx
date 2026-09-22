import { motion } from "framer-motion";

interface Props {
  visible?: boolean; // false cuando el corazón ya se formó
}

// z-index 50: las flores del fondo (< 50) quedan detrás de la luz y las del frente delante
export default function Nucleo({ visible = true }: Props) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
      style={{ zIndex: 50, width: 190, height: 190 }}
      animate={
        visible
          ? { scale: [0.94, 1.06, 0.94], opacity: [0.85, 1, 0.85] }
          : { scale: 0.3, opacity: 0 }
      }
      transition={
        visible
          ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.8, ease: "easeInOut" }
      }
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(closest-side, rgb(255 244 200 / 0.95), rgb(255 200 90 / 0.55) 28%, rgb(255 143 171 / 0.22) 60%, transparent)",
        }}
      />
      <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_10px_rgb(255_235_170/0.9)]" />
    </motion.div>
  );
}