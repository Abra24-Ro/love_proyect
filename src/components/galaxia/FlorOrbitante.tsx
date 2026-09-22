import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { ANILLOS, type FlorGalaxia } from "../../data/galaxia";
import { proyectar } from "../../utils/orbita";
import { useGalaxiaStore } from "../../store/useGalaxiaStore";
import { ESTILOS } from "./estilosFlor";
import FlorSVG from "./FlorSVG";
import type { PuntoCorazon } from "../../utils/corazon";

interface Props {
  flor: FlorGalaxia;
  indice: number;
  rotacion: MotionValue<number>;
  k: number;
  onTocar: (id: string, tam: number) => void;
  formando: boolean; // true una vez que se completó la galaxia
  puntoCorazon: PuntoCorazon;
}

export default function FlorOrbitante({
  flor,
  indice,
  rotacion,
  k,
  onTocar,
  formando,
  puntoCorazon,
}: Props) {
  const anillo = ANILLOS[flor.anillo];
  const tam = anillo.tamano * k;
  const estilo = ESTILOS[flor.tipo];

  const activa = useGalaxiaStore((s) => s.activa === flor.id);
  const leida = useGalaxiaStore((s) => s.leidas.includes(flor.id));
  const [enOrbita, setEnOrbita] = useState(true);

  const inicio = proyectar(
    flor.fase + rotacion.get() * anillo.velocidad,
    anillo,
    k,
  );
  const x = useMotionValue(inicio.x);
  const y = useMotionValue(inicio.y);
  const escala = useMotionValue(inicio.escala);
  const opacidad = useMotionValue(inicio.opacidad);
  const zIndex = useMotionValue(Math.round(inicio.profundidad * 100));

  // Mientras está en órbita, sigue al bucle de rotación
  useMotionValueEvent(rotacion, "change", (r) => {
    if (!enOrbita || formando) return;
    const p = proyectar(flor.fase + r * anillo.velocidad, anillo, k);
    x.set(p.x);
    y.set(p.y);
    escala.set(p.escala);
    opacidad.set(p.opacidad);
    zIndex.set(Math.round(p.profundidad * 100));
  });

  // Al tocarla: vuela al centro y se sale de la órbita
  useEffect(() => {
    if (activa || formando) {
      setEnOrbita(false);
      zIndex.set(activa ? 300 : 150 + indice);
    }
  }, [activa, formando, indice, zIndex]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: -tam / 2,
        top: -tam / 2,
        width: tam,
        height: tam,
        x,
        y,
        zIndex,
      }}
      animate={
        activa
          ? { x: 0, y: 0, scale: 2.6, opacity: 1 }
          : formando
            ? { x: puntoCorazon.x, y: puntoCorazon.y, scale: 1, opacity: 1 }
            : enOrbita
              ? undefined
              : { scale: escala.get(), opacity: opacidad.get() }
      }
      transition={
        formando && !activa
          ? { type: "spring", stiffness: 60, damping: 14, delay: 0.05 * indice }
          : { type: "spring", stiffness: 90, damping: 16 }
      }
      onAnimationComplete={() => {
        if (!activa && !enOrbita && !formando) setEnOrbita(true);
      }}
    >
      <motion.button
        type="button"
        aria-label={`Leer mensaje: ${flor.mensaje.slice(0, 24)}…`}
        className="relative block h-full w-full"
        style={!activa ? { scale: enOrbita ? undefined : escala } : undefined}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 12,
          delay: 0.5 + indice * 0.09,
        }}
        whileTap={!activa ? { scale: 1.15 } : undefined}
        onClick={() => onTocar(flor.id, tam)}
      >
        {/* Halo barato (un degradado, no un filtro) */}
        <span
          aria-hidden
          className="absolute -inset-[55%]"
          style={{
            background: `radial-gradient(closest-side, ${estilo.brillo}, transparent)`,
          }}
        />
        {/* Anillo dorado sutil: ya la leyó */}
        {leida && !activa && (
          <span
            aria-hidden
            className="absolute -inset-[8%] rounded-full border border-sol-200/70"
          />
        )}
        {/* Giro lento de la flor sobre sí misma (se detiene si está activa) */}
        <motion.div
          className="h-full w-full"
          animate={activa ? { rotate: 0 } : { rotate: 360 }}
          transition={
            activa
              ? { duration: 0.4 }
              : {
                  duration: 36 + (indice % 5) * 8,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
        >
          <FlorSVG tipo={flor.tipo} className="h-full w-full" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
