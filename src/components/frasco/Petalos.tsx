import { motion } from "framer-motion";
import { TOTAL_PETALOS } from "../../data/frasco";

const PETALOS = Array.from({ length: TOTAL_PETALOS }, (_, i) => ({
  id: i,
  salida: ((i * 29) % 36) - 18, // dónde nace, cerca del centro de la flor (px)
  deriva: ((i * 47) % 80) - 40, // cuánto se desvía al caer
  giro: ((i * 83) % 240) - 120,
  caida: 104 + (i % 4) * 4, // hasta dónde baja: la base del frasco
  duracion: 5 + (i % 4) * 0.8,
  ancho: 11 + (i % 3) * 3,
}));

const TIEMPOS = [0, 0.3, 0.65, 1];

interface Props {
  cantidad: number; // cuántos ya se soltaron
  ronda: number; // cambia al repetir: reinicia los pétalos
}

export default function Petalos({ cantidad, ronda }: Props) {
  return (
    <>
      {PETALOS.slice(0, cantidad).map((p) => (
        <motion.span
          key={`${ronda}-${p.id}`}
          aria-hidden
          className="absolute rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-linear-to-b from-sol-200 to-sol-500"
          style={{
            left: -p.ancho / 2,
            top: 0,
            width: p.ancho,
            height: p.ancho * 1.4,
          }}
          initial={{ x: p.salida, y: 0, rotate: 0, opacity: 0, scale: 0.5 }}
          animate={{
            x: [
              p.salida,
              p.salida + p.deriva * 0.6,
              p.salida + p.deriva * 0.2,
              p.salida + p.deriva,
            ],
            y: p.caida,
            rotate: [0, p.giro * 0.4, p.giro * 0.8, p.giro],
            opacity: 1,
            scale: 1,
          }}
          transition={{
            x: { duration: p.duracion, times: TIEMPOS, ease: "easeInOut" },
            rotate: { duration: p.duracion, times: TIEMPOS, ease: "easeInOut" },
            y: { duration: p.duracion, ease: "easeInOut" },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
          }}
        />
      ))}
    </>
  );
}