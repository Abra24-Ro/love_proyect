import { motion, type Variants } from "framer-motion";
import Prisma, { type Cara } from "./Prisma";
import { DELAY_LUZ, DELAY_TAPA, DUR_TAPA } from "./tiempos";
import Mono from "./Mono";
import PolvoDorado from "./PolvoDorado";
import AbanicoSobres from "../sobres/AbanicoSobres";

// Cuerpo
const W = 180;
const H = 130;
const D = 180;
// Tapa
const LW = 196;
const LH = 40;
const LD = 196;
// Cinta
const CINTA = 30;
// Posición aproximada de la boca de la caja (desde arriba del contenedor)
const BOCA_Y = 45;

const DESPLAZ_ABIERTA = 180; // la caja baja para dejarle aire a los sobres

const giro: Variants = {
  cerrada: {
    rotateY: [-28, 28],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
  abierta: {
    rotateY: 0,
    transition: { duration: 0.9, ease: "easeInOut" },
  },
};

// Temblor → levantar → pausa breve → salir volando
const tapa: Variants = {
  cerrada: {
    y: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    transition: { duration: 0.6 },
  },
  abierta: {
    rotateZ: [0, -3, 3, -3, 0, 0, -6, 26],
    y: [0, 0, 0, 0, 0, 0, -70, -760],
    rotateX: [0, 0, 0, 0, 0, 0, 10, 50],
    rotateY: [0, 0, 0, 0, 0, 0, 0, 40],
    transition: {
      delay: DELAY_TAPA,
      duration: DUR_TAPA,
      ease: "easeInOut",
      times: [0, 0.08, 0.16, 0.24, 0.32, 0.42, 0.62, 1],
    },
  },
};

const haz: Variants = {
  cerrada: { opacity: 0, scaleY: 0, transition: { duration: 0.4 } },
  abierta: {
    opacity: [0, 1, 0.4],
    scaleY: [0, 1, 1],
    transition: {
      delay: DELAY_LUZ,
      duration: 3,
      times: [0, 0.45, 1],
      ease: "easeOut",
    },
  },
};

const resplandor: Variants = {
  cerrada: { opacity: 0 },
  abierta: {
    opacity: [0, 1, 0.8],
    transition: { delay: DELAY_LUZ, duration: 1.6, times: [0, 0.4, 1] },
  },
};

function cinta(cara: Cara) {
  if (cara === "abajo") return null;
  return (
    <>
      <span
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-sol-50"
        style={{ width: CINTA }}
      />
      {cara === "arriba" && (
        <span
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-sol-50"
          style={{ height: CINTA }}
        />
      )}
    </>
  );
}

interface Props {
  abierta: boolean;
}

export default function CajaRegalo({ abierta }: Props) {
  return (
    <motion.div
      animate={{ y: abierta ? DESPLAZ_ABIERTA : 0 }}
      transition={{
        duration: 1.4,
        ease: "easeInOut",
        delay: abierta ? DELAY_LUZ - 0.2 : 0,
      }}
    >
      <div className="animate-float">
        {/* Raíz de variants: los hijos heredan 'cerrada' / 'abierta' */}
        <motion.div
          className="relative"
          style={{ perspective: 1100 }}
          initial="cerrada"
          animate={abierta ? "abierta" : "cerrada"}
        >
          {/* Inclinación fija */}
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(-22deg)",
            }}
          >
            {/* Giro */}
            <motion.div
              className="relative"
              style={{
                width: W,
                height: LH + H,
                transformStyle: "preserve-3d",
              }}
              variants={giro}
            >
              {/* Cuerpo */}
              <Prisma
                w={W}
                h={H}
                d={D}
                omitir={["arriba"]}
                caraClass="bg-linear-to-b from-sol-400 to-ambar-600"
                renderCara={cinta}
                style={{ left: 0, top: LH }}
              />

              {/* Tapa: grupo animado que envuelve al prisma */}
              <motion.div
                className="absolute"
                style={{
                  left: (W - LW) / 2,
                  top: 0,
                  width: LW,
                  height: LH,
                  transformStyle: "preserve-3d",
                }}
                variants={tapa}
              >
                <Prisma
                  w={LW}
                  h={LH}
                  d={LD}
                  caraClass="bg-linear-to-b from-sol-300 to-sol-500"
                  renderCara={cinta}
                  style={{ left: 0, top: 0 }}
                />
                <Mono style={{ left: LW / 2, top: 0 }} />
              </motion.div>
            </motion.div>
          </div>

          {/* Columna de luz (2D, por encima de la caja) */}
          <motion.div
            aria-hidden
            variants={haz}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-full mix-blend-screen"
            style={{
              top: BOCA_Y,
              width: 200,
              height: 480,
              originY: 1,
              background:
                "linear-gradient(to top, rgb(255 240 138 / 0.9), rgb(255 210 31 / 0.35) 45%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, #000 35%, #000 65%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, #000 35%, #000 65%, transparent)",
            }}
          />

          {/* Resplandor en la boca de la caja */}
          <motion.div
            aria-hidden
            variants={resplandor}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-sol-50 via-sol-300/60 to-transparent mix-blend-screen"
            style={{ top: BOCA_Y, width: 190, height: 70 }}
          />
          {abierta && <PolvoDorado origenY={BOCA_Y} />}
          {abierta && <AbanicoSobres origenY={BOCA_Y} />}
        </motion.div>
      </div>
    </motion.div>
  );
}
