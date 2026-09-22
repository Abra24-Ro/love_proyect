import { useEffect, useState } from "react";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { SOBRES } from "../../data/sobres";
import { useEscalaVista } from "../../hooks/useEscalaVista";
import { useSobresStore } from "../../store/useSobresStore";
import ContenidoSobre from "./ContenidoSobre";
import Sobre from "./Sobre";
import { T_CARTA, T_OCULTAR_SOBRE, T_VUELO_REGRESO } from "./tiempos";

// Geometría del escenario (px). El (0, 0) es el centro de la pantalla.
const SOBRE_W = 124;
const SOBRE_H = 84;
const SOBRE_ESCALA = 1.9;
const SOBRE_Y = 175;
const BOCA_Y = SOBRE_Y - (SOBRE_H * SOBRE_ESCALA) / 2; // borde superior del sobre (≈ 95)

const CARTA_W = 280;
const CARTA_H = 340;
const HUECO = 12; // separación entre la carta y el sobre
const RANURA_W = 440;
const RANURA_H = 460;

// Cuánto baja la escena para quedar en el centro cuando el sobre se va (≈ 87)
const SUBIDA_SOLO = -(BOCA_Y - HUECO - CARTA_H / 2);

const PAPEL =
  "rounded-sm border border-sol-300/60 bg-linear-to-b from-sol-50 to-[#fff3bf] px-8 shadow-[0_12px_40px_rgb(0_0_0/0.5),0_0_50px_rgb(255_210_31/0.35)]";

const fondo: Variants = {
  fan: { opacity: 0 },
  centro: { opacity: 1, transition: { duration: 0.6 } },
  regreso: {
    opacity: 0,
    transition: { duration: 0.8, delay: T_VUELO_REGRESO },
  },
};

const luz: Variants = {
  fan: { opacity: 0, scale: 0.6 },
  centro: {
    opacity: [0, 0.9, 0.4],
    scale: [0.6, 1.1, 1],
    transition: { delay: T_CARTA - 0.1, duration: 1.8, times: [0, 0.4, 1] },
  },
  regreso: { opacity: 0, transition: { duration: 0.4 } },
};

const contenido: Variants = {
  fan: { opacity: 0, y: 8 },
  centro: {
    opacity: 1,
    y: 0,
    transition: { delay: T_CARTA + 0.9, duration: 0.8 },
  },
  regreso: { opacity: 0, transition: { duration: 0.2 } },
};

// Escena a pantalla completa: se expande desde el centro mientras el sobre se abre
const pantalla: Variants = {
  fan: { opacity: 0, scale: 0.6 },
  centro: {
    opacity: 1,
    scale: 1,
    transition: { delay: T_CARTA, duration: 1.4, ease: "easeOut" },
  },
  regreso: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } },
};

export default function SobreOverlay() {
  const activo = useSobresStore((s) => s.activo);
  const origen = useSobresStore((s) => s.origen);
  const cerrando = useSobresStore((s) => s.cerrando);
  const cerrar = useSobresStore((s) => s.cerrar);
  const terminar = useSobresStore((s) => s.terminar);
  const escala = useEscalaVista();
  const [listo, setListo] = useState(false);

  // Esc para volver (solo cuando ya terminó de abrirse)
  useEffect(() => {
    if (!listo) return;
    function alTeclear(e: KeyboardEvent) {
      if (e.key === "Escape") cerrar();
    }
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [listo, cerrar]);

  const info = SOBRES.find((s) => s.id === activo);
  if (!info || !origen) return null;

  const completa = info.pantallaCompleta === true;
  const solo = info.soloEscena === true || completa;

  // El escenario está escalado en pantallas cortas
  const escenario = { transform: `scale(${escala})` };

  // Dónde estaba el sobre en el abanico (por eso / escala)
  const fan = {
    x: origen.x / escala,
    y: origen.y / escala,
    scale: info.escala,
    rotate: info.giro,
    opacity: 1,
  };

  const sobre: Variants = {
    fan,
    centro: {
      x: 0,
      y: SOBRE_Y,
      scale: SOBRE_ESCALA,
      rotate: 0,
      opacity: solo ? 0 : 1,
      transition: {
        default: { type: "spring", stiffness: 70, damping: 15 },
        opacity: { delay: T_OCULTAR_SOBRE, duration: 0.9 },
      },
    },
    regreso: {
      ...fan,
      transition: {
        default: { duration: 0.9, delay: T_VUELO_REGRESO, ease: "easeInOut" },
        opacity: { duration: 0.4 }, // reaparece enseguida, antes de que la escena vuelva a entrar
      },
    },
  };

  // Si el sobre se va, la escena baja al centro de la pantalla
  const escena: Variants = {
    fan: { y: 0 },
    centro: {
      y: solo ? SUBIDA_SOLO : 0,
      transition: { delay: T_OCULTAR_SOBRE, duration: 1, ease: "easeInOut" },
    },
    regreso: { y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const carta: Variants = {
    fan: { y: CARTA_H + 40 },
    centro: {
      y: 0,
      transition: { delay: T_CARTA, duration: 1, ease: "easeOut" },
    },
    regreso: {
      y: CARTA_H + 40,
      // en modo solo espera a que la escena suba de nuevo a la boca del sobre
      transition: { duration: 0.6, delay: solo ? 0.3 : 0, ease: "easeIn" },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-40"
      initial="fan"
      animate={cerrando ? "regreso" : "centro"}
      onAnimationComplete={(def) => {
        if (def === "centro") setListo(true);
        if (def === "regreso") terminar();
      }}
    >
      <motion.div
        variants={fondo}
        className={`absolute inset-0 ${solo ? "bg-noche-950" : "bg-noche-950/95"}`}
      />

      {/* Resplandor: siempre detrás de todo lo demás */}
      <div className="absolute left-1/2 top-1/2" style={escenario}>
        <motion.div variants={escena} className="absolute left-0 top-0">
          <motion.div
            variants={luz}
            className="pointer-events-none absolute mix-blend-screen"
            style={{
              width: 560,
              height: 560,
              left: -280,
              top: BOCA_Y - HUECO - CARTA_H / 2 - 280,
              background:
                "radial-gradient(closest-side, rgb(255 225 77 / 0.55), rgb(255 210 31 / 0.18) 55%, transparent)",
            }}
          />
        </motion.div>
      </div>

      {/* Escena a pantalla completa (la galaxia): no cabe en la carta */}
      {completa && (
        <motion.div variants={pantalla} className="absolute inset-0">
          <ContenidoSobre id={info.id} etiqueta={info.etiqueta} />
        </motion.div>
      )}

      {/* transformPagePoint corrige el arrastre cuando el escenario está escalado */}
      <MotionConfig
        transformPagePoint={(p) => ({ x: p.x / escala, y: p.y / escala })}
      >
        <div className="absolute left-1/2 top-1/2" style={escenario}>
          {/* Sobre */}
          {(!solo || !listo || cerrando) && (
            <motion.div
              variants={sobre}
              className="pointer-events-none absolute"
              style={{ left: -SOBRE_W / 2, top: -SOBRE_H / 2 }}
            >
              <Sobre
                emblema={info.emblema}
                etiqueta={info.etiqueta}
                tema={info.tema}
              />
            </motion.div>
          )}

          {/* Carta: la ranura recorta en el borde del sobre para que parezca salir de él */}
          {!completa && (
            <motion.div variants={escena} className="absolute left-0 top-0">
              <div
                className={`pointer-events-none absolute ${listo && !cerrando ? "overflow-visible" : "overflow-hidden"}`}
                style={{
                  width: RANURA_W,
                  height: RANURA_H,
                  left: -RANURA_W / 2,
                  top: BOCA_Y - RANURA_H,
                }}
              >
                <motion.div
                  variants={carta}
                  className={`pointer-events-auto absolute flex flex-col items-center justify-center text-center ${info.conPapel === false ? "" : PAPEL}`}
                  style={{
                    width: CARTA_W,
                    height: CARTA_H,
                    left: (RANURA_W - CARTA_W) / 2,
                    bottom: HUECO,
                  }}
                >
                  <motion.div
                    variants={contenido}
                    className="flex flex-col items-center"
                  >
                    <ContenidoSobre id={info.id} etiqueta={info.etiqueta} />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {completa && (
            <motion.div variants={pantalla} className="absolute inset-0 z-10">
              <ContenidoSobre id={info.id} etiqueta={info.etiqueta} />
            </motion.div>
          )}
        </div>
      </MotionConfig>

      <motion.button
        className={
          completa
            ? "absolute left-4 rounded-full border border-sol-300/40 bg-noche-950/60 px-4 py-1.5 font-hand text-xl text-sol-100"
            : "btn-glow absolute left-1/2 -translate-x-1/2"
        }
        style={
          completa
            ? { top: "max(1rem, env(safe-area-inset-top))" }
            : { bottom: "max(1.5rem, env(safe-area-inset-bottom))" }
        }
        initial={false}
        animate={{ opacity: listo && !cerrando ? 1 : 0 }}
        disabled={!listo || cerrando}
        onClick={cerrar}
      >
        Volver
      </motion.button>
    </motion.div>
  );
}
