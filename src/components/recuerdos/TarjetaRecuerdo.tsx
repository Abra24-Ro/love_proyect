import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
  type Variants,
} from "framer-motion";
import type { ItemPila } from "../../data/recuerdos";
import { formatearFecha } from "../../utils/fecha";

interface Props {
  item: ItemPila;
  posicion: number; // 0 = la de arriba
  volteada: boolean;
  pista: boolean;
  onVoltear: () => void;
  onSoltar: (direccion: 1 | -1) => void;
}

// Dónde descansa cada tarjeta según su lugar en la pila
const REPOSO = [
  { y: 0, scale: 1, rotate: 0 },
  { y: 18, scale: 0.95, rotate: -4 },
  { y: 34, scale: 0.9, rotate: 4 },
];

// La de arriba sale hacia el lado que indica AnimatePresence (custom)
const salida: Variants = {
  salir: (dir: number) => ({
    x: dir * 480,
    rotate: dir * 18,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  }),
};

const DESAPARECER = { opacity: 0, transition: { duration: 0.15 } };

const CARA =
  "absolute inset-0 overflow-hidden rounded-md bg-linear-to-b from-sol-50 to-[#fff3bf] shadow-[0_10px_30px_rgb(0_0_0/0.45)]";

// Se muestra si la foto no existe todavía
const PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe14d"/><stop offset="1" stop-color="#e08a00"/></linearGradient></defs><rect width="220" height="240" fill="url(#g)"/><text x="110" y="128" font-size="20" text-anchor="middle" fill="#7a4a00" font-family="sans-serif">tu foto aquí</text></svg>',
)}`;

// Texto más chico si el mensaje es largo, para que siempre quepa
function tamanoMensaje(texto: string) {
  if (texto.length <= 80) return "text-2xl";
  if (texto.length <= 140) return "text-xl";
  return "text-lg";
}

export default function TarjetaRecuerdo({
  item,
  posicion,
  volteada,
  pista,
  onVoltear,
  onSoltar,
}: Props) {
  const x = useMotionValue(0);
  const inclinar = useTransform(x, [-200, 0, 200], [-14, 0, 14]);
  const [fallo, setFallo] = useState(false);

  const esTope = posicion === 0;
  const esFoto = item.tipo === "foto";

  function alSoltar(_: unknown, info: PanInfo) {
    const lejos =
      Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500;
    if (lejos) onSoltar(info.offset.x >= 0 ? 1 : -1);
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: 10 - posicion }}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ ...REPOSO[posicion], opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      variants={salida}
      exit={esTope ? "salir" : DESAPARECER}
    >
      {/* Arrastre horizontal (solo la de arriba) */}
      <motion.div
        className={`h-full w-full ${esTope && esFoto ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{ x, rotate: inclinar, perspective: 900, touchAction: "pan-y" }}
        drag={esTope && esFoto ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        onDragEnd={alSoltar}
        onTap={esTope && esFoto ? onVoltear : undefined}
      >
        {/* Volteo 3D */}
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: volteada ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        >
          {/* Frente */}
          <div className={CARA} style={{ backfaceVisibility: "hidden" }}>
            {item.tipo === "foto" ? (
              <div className="flex h-full flex-col p-2.5">
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-[3px] bg-sol-200/40">
                  <img
                    src={fallo ? PLACEHOLDER : item.recuerdo.foto}
                    alt="Un recuerdo de nosotros"
                    draggable={false}
                    onError={() => setFallo(true)}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: item.recuerdo.enfoque }}
                  />
                  {pista && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-noche-950/60 px-2.5 py-0.5 font-hand text-sm text-sol-200">
                      toca para leer
                    </span>
                  )}
                </div>
                <p className="flex h-[46px] items-center justify-center font-hand text-lg text-tinta">
                  {formatearFecha(item.recuerdo.fecha)}
                </p>
              </div>
            ) : (
              // Tarjeta final: frase de cierre y firma
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <p className="font-script text-4xl leading-tight text-tinta">
                  {item.mensaje}
                </p>
                {item.firma && (
                  <>
                    <span className="my-5 h-px w-12 bg-tinta/25" />
                    <p className="font-hand text-xl text-tinta/70">
                      {item.firma}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Dorso: el mensaje */}
          {item.tipo === "foto" && (
            <div
              className={CARA}
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <p
                  className={`text-balance font-hand leading-snug text-tinta ${tamanoMensaje(item.recuerdo.mensaje)}`}
                >
                  {item.recuerdo.mensaje}
                </p>
                <span className="my-4 h-px w-10 bg-tinta/25" />
                <p className="font-hand text-lg text-tinta/60">
                  {formatearFecha(item.recuerdo.fecha)}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}