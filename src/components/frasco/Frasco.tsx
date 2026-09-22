import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import RosaAmarilla from "./RosaAmarilla";

export type ModoFrasco = "reposo" | "escuchando" | "final";

// Centro de la flor dentro del frasco (px): de ahí caen los pétalos
const FLOR_Y = 94;

const halo: Variants = {
  reposo: { opacity: 0.3, scale: 1, transition: { duration: 0.8 } },
  escuchando: {
    opacity: [0.6, 1, 0.6],
    scale: [1, 1.15, 1],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  // Destello de floración: sube fuerte y se queda encendido
  final: {
    opacity: [0.6, 1, 0.55],
    scale: [1, 1.7, 1.15],
    transition: { duration: 2.2, ease: "easeOut" },
  },
};

const rosa: Variants = {
  reposo: { rotate: 0, scale: 1, transition: { duration: 0.6 } },
  escuchando: {
    rotate: [-1.5, 1.5],
    scale: 1,
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
  final: {
    rotate: 0,
    scale: [1, 1.12, 1],
    transition: { duration: 1.4, ease: "easeOut" },
  },
};

interface Props {
  modo: ModoFrasco;
  children?: ReactNode;
}

export default function Frasco({ modo, children }: Props) {
  return (
    <div className="relative h-[226px] w-[190px]">
      {/* Base con sombra y un halo cálido */}
      <div
        className="absolute bottom-0 left-1/2 h-9 w-[190px] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #6b3a10 0%, #2a1408 75%)",
          boxShadow:
            "0 10px 30px rgb(0 0 0 / 0.6), 0 0 40px rgb(255 183 3 / 0.35)",
        }}
      />
      {/* Luz sobre la base */}
      <div className="absolute bottom-[14px] left-1/2 h-4 w-[130px] -translate-x-1/2 rounded-[50%] bg-sol-300/80 blur-[6px]" />

      {/* Halo de la flor */}
      <motion.div
        aria-hidden
        variants={halo}
        initial="reposo"
        animate={modo}
        className="pointer-events-none absolute left-1/2 size-[170px] -translate-x-1/2 -translate-y-1/2"
        style={{
          top: FLOR_Y,
          background:
            "radial-gradient(closest-side, rgb(255 210 31 / 0.6), transparent)",
        }}
      />

      {/* Rosa */}
      <div className="absolute bottom-[18px] left-1/2 -translate-x-1/2 animate-pulse-glow">
        <motion.div
          variants={rosa}
          initial="reposo"
          animate={modo}
          style={{ originY: 1 }}
        >
          <RosaAmarilla className="h-[168px] w-auto" />
        </motion.div>
      </div>

      {/* Pétalos: nacen en el centro de la flor y caen dentro de la campana */}
      <div className="absolute left-1/2" style={{ top: FLOR_Y }}>
        {children}
      </div>

      {/* Campana de cristal */}
      <div
        className="absolute left-1/2 top-0 h-[200px] w-[150px] -translate-x-1/2 rounded-t-[75px] rounded-b-[6px] border border-white/35"
        style={{
          background:
            "linear-gradient(90deg, rgb(255 255 255 / 0.18), rgb(255 255 255 / 0.03) 28%, rgb(255 255 255 / 0.02) 72%, rgb(255 255 255 / 0.14))",
          boxShadow:
            "inset 0 0 28px rgb(255 210 31 / 0.14), 0 0 30px rgb(255 210 31 / 0.12)",
        }}
      >
        {/* Reflejos */}
        <span className="absolute left-4 top-7 h-24 w-1.5 rounded-full bg-white/35" />
        <span className="absolute left-4 top-[132px] size-1.5 rounded-full bg-white/35" />
      </div>

      {/* Perilla */}
      <span className="absolute -top-2 left-1/2 size-3 -translate-x-1/2 rounded-full border border-white/40 bg-white/10" />
    </div>
  );
}