import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { FLORES, TITULO_FINAL } from "../../data/galaxia";
import { puntosCorazon } from "../../utils/corazon";
import { useTamano } from "../../hooks/useTamano";
import { useGalaxiaStore } from "../../store/useGalaxiaStore";
import { tocar } from "../../audio/sonido";
import CierreGalaxia from "./CierreGalaxia";
import ContadorFlores from "./ContadorFlores";
import FlorOrbitante from "./FlorOrbitante";
import { DefsFlores } from "./FlorSVG";
import GalaxiaCanvas from "./GalaxiaCanvas";
import LluviaPetalos from "./LluviaPetalos";
import MensajeFlor from "./MensajeFlor";
import MensajeUltimo from "./MensajeUltimo";
import Nucleo from "./Nucleo";

const CENTRO_Y = 0.46; // fracción de la altura donde vive el núcleo
const GRADOS_POR_SEGUNDO = 14; // giro automático de fondo
const GRADOS_POR_PIXEL = 0.35; // cuánto gira por cada px arrastrado
const FRICCION = 0.94; // qué tan rápido frena la inercia (por fotograma a 60 fps)

type EstadoGuardado = "listo" | "generando" | "hecho" | "error";

export default function EscenaGalaxia() {
  const { ref, ancho, alto } = useTamano<HTMLDivElement>();
  const reducirMovimiento = useReducedMotion();
  const rotacion = useMotionValue(0);
  const abrir = useGalaxiaStore((s) => s.abrir);
  const activa = useGalaxiaStore((s) => s.activa !== null);
  const capturaRef = useRef<HTMLDivElement>(null);
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("listo");

  const completa = useGalaxiaStore((s) => s.completa);
  const yaLlovio = useRef(false);
  if (completa) yaLlovio.current = true;

  // Estado del arrastre, en refs: no necesita re-render
  const arrastrando = useRef(false);
  const xAnterior = useRef(0);
  const inercia = useRef(0);
  const ultimoDelta = useRef(0);

  const k = Math.min(1.5, Math.max(0.7, Math.min(ancho / 380, alto / 700)));
  const puntosCorazon14 = useMemo(
    () => puntosCorazon(FLORES.length, 8.4 * k),
    [k],
  );

  useAnimationFrame((_, delta) => {
    if (reducirMovimiento || completa) return;
    const seg = Math.min(delta, 50) / 1000;

    if (arrastrando.current) {
      // Mientras se arrastra, el giro lo pone directamente onPointerMove
      return;
    }

    if (Math.abs(inercia.current) > 0.01) {
      rotacion.set(rotacion.get() + inercia.current);
      inercia.current *= FRICCION;
    } else {
      rotacion.set(rotacion.get() + seg * GRADOS_POR_SEGUNDO);
    }
  });

  function alBajar(e: React.PointerEvent) {
    if (activa || completa) return;
    arrastrando.current = true;
    xAnterior.current = e.clientX;
    inercia.current = 0;
    ultimoDelta.current = 0;
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function alMover(e: React.PointerEvent) {
    if (!arrastrando.current) return;
    const delta = (e.clientX - xAnterior.current) * GRADOS_POR_PIXEL;
    xAnterior.current = e.clientX;
    ultimoDelta.current = delta;
    rotacion.set(rotacion.get() + delta);
  }

  function alSoltar() {
    if (!arrastrando.current) return;
    arrastrando.current = false;
    inercia.current = ultimoDelta.current * 2.2; // impulso al soltar
  }

  function tocarFlor(id: string, tam: number) {
    abrir(id);
    tocar("magia.mp3", { volumen: Math.min(1, 0.5 + tam / 80) });
  }

  async function guardarRecuerdo() {
    const el = capturaRef.current;
    if (!el || estadoGuardado === "generando") return;

    setEstadoGuardado("generando");
    try {
      const url = await toPng(el, {
        backgroundColor: "#05060f",
        pixelRatio: 2,
        filter: (nodo) => {
          const dataset = (nodo as HTMLElement).dataset;
          return !dataset?.excluirCaptura;
        },
      });
      const a = document.createElement("a");
      a.href = url;
      a.download = "nuestra-galaxia.png";
      a.click();
      setEstadoGuardado("hecho");
      setTimeout(() => setEstadoGuardado("listo"), 2500);
    } catch (err) {
      console.warn("No se pudo generar la imagen", err);
      setEstadoGuardado("error");
      setTimeout(() => setEstadoGuardado("listo"), 2500);
    }
  }

  const textoBoton: Record<EstadoGuardado, string> = {
    listo: "Guardar este recuerdo",
    generando: "Guardando…",
    hecho: "¡Guardado! 💛",
    error: "No se pudo, intenta de nuevo",
  };

  return (
    <div
      ref={(nodo) => {
        ref.current = nodo;
        capturaRef.current = nodo;
      }}
      className="absolute inset-0 isolate overflow-hidden touch-none"
      onPointerDown={alBajar}
      onPointerMove={alMover}
      onPointerUp={alSoltar}
      onPointerCancel={alSoltar}
    >
      <DefsFlores />

      {ancho > 0 && (
        <>
          <GalaxiaCanvas ancho={ancho} alto={alto} centroY={CENTRO_Y} k={k} />

          <div
            className="absolute left-1/2"
            style={{ top: `${CENTRO_Y * 100}%` }}
          >
            <Nucleo visible={!completa} />
            {FLORES.map((flor, i) => (
              <FlorOrbitante
                key={flor.id}
                flor={flor}
                indice={i}
                rotacion={rotacion}
                k={k}
                onTocar={tocarFlor}
                formando={completa}
                puntoCorazon={puntosCorazon14[i]}
              />
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 z-[200] flex justify-center text-center"
            style={{ top: "4.5rem" }}
          >
            <motion.h2
              key={completa ? "final" : "inicio"}
              className="font-script text-5xl text-sol-300 text-glow"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {completa ? TITULO_FINAL : "Para siempre"}
            </motion.h2>
          </div>

          {completa && <CierreGalaxia />}
          {completa && yaLlovio.current && <LluviaPetalos />}
          {completa && <MensajeUltimo />}

          {completa && (
            <motion.button
              type="button"
              data-excluir-captura="true"
              disabled={estadoGuardado === "generando"}
              className="pointer-events-auto absolute inset-x-0 z-[200] mx-auto w-fit whitespace-nowrap rounded-full border border-sol-300/30 bg-noche-950/60 px-5 py-1.5 font-hand text-lg text-sol-200/80 disabled:opacity-60"
              style={{
                bottom: "max(7.5rem, calc(7rem + env(safe-area-inset-bottom)))",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              onClick={guardarRecuerdo}
            >
              {textoBoton[estadoGuardado]}
            </motion.button>
          )}

          <ContadorFlores />
          <MensajeFlor />
        </>
      )}
    </div>
  );
}