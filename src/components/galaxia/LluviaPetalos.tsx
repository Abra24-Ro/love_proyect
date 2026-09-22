import { motion } from "framer-motion";

const N = 26;
const PETALOS = Array.from({ length: N }, (_, i) => ({
  id: i,
  izquierda: ((i * 37 + 11) % 100), // %
  rosa: i % 2 === 0,
  ancho: 9 + (i % 3) * 3,
  demora: (i % 10) * 0.35,
  duracion: 6 + (i % 5) * 1.1,
  deriva: ((i * 53) % 60) - 30, // px de vaivén lateral
  giro: ((i * 71) % 300) - 150,
}));

export default function LluviaPetalos() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PETALOS.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-linear-to-b ${
            p.rosa ? "from-rosa-400 to-[#d6336c]" : "from-sol-200 to-sol-500"
          }`}
          style={{
            left: `${p.izquierda}%`,
            top: -40,
            width: p.ancho,
            height: p.ancho * 1.4,
          }}
          initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "110vh",
            x: [0, p.deriva, -p.deriva * 0.6, 0],
            rotate: p.giro,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duracion,
            delay: p.demora,
            ease: "linear",
            x: { duration: p.duracion, ease: "easeInOut" },
            opacity: { duration: p.duracion, times: [0, 0.08, 0.85, 1] },
          }}
        />
      ))}
    </div>
  );
}