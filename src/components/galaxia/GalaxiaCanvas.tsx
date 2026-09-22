import { useEffect, useRef } from "react";
import { ANILLOS } from "../../data/galaxia";
import { INCLINACION_RAD } from "../../utils/orbita";

const FLATTEN = 0.34; // qué tan "aplastado" se ve el disco

type RGB = readonly [number, number, number];
const ORO: RGB = [255, 214, 102];
const CREMA: RGB = [255, 236, 160];
const ROSA: RGB = [255, 143, 171];
const ROSA_CLARO: RGB = [255, 190, 208];
const BLANCO: RGB = [255, 250, 235];

interface Particula {
  r: number; // 0 (centro) a 1 (borde)
  theta: number;
  altura: number;
  tam: number;
  css: string;
  brillo: number;
  fase: number;
  vel: number;
}

// Números pseudoaleatorios con semilla: siempre la misma galaxia
function mulberry32(semilla: number) {
  let a = semilla;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function elegirColor(u: number): RGB {
  if (u < 0.28) return ORO;
  if (u < 0.45) return CREMA;
  if (u < 0.75) return ROSA;
  if (u < 0.9) return ROSA_CLARO;
  return BLANCO;
}

function crearParticulas(n: number): Particula[] {
  const rnd = mulberry32(2109);
  return Array.from({ length: n }, () => {
    const r = Math.pow(rnd(), 1.35); // más densidad hacia el centro
    const brazo = Math.floor(rnd() * 3);
    const dispersion = (rnd() - rnd()) * (0.75 - 0.45 * r);
    const [rojo, verde, azul] = elegirColor(rnd());
    return {
      r,
      theta: brazo * ((Math.PI * 2) / 3) + r * 5.2 + dispersion,
      altura: (rnd() - 0.5) * 34 * (1 - r),
      tam: 0.7 + Math.pow(rnd(), 3) * 2.6,
      css: `rgb(${rojo}, ${verde}, ${azul})`,
      brillo: 0.35 + rnd() * 0.65,
      fase: rnd() * Math.PI * 2,
      vel: 0.0008 + rnd() * 0.002,
    };
  });
}

const PARTICULAS = crearParticulas(1100);

interface Props {
  ancho: number;
  alto: number;
  centroY: number;
  k: number;
  atenuado?: boolean;
}

export default function GalaxiaCanvas({
  ancho,
  alto,
  centroY,
  k,
  atenuado = false,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);
    ctx.scale(dpr, dpr);

    const cx = ancho / 2;
    const cy = alto * centroY;
    const radio = Math.min(ancho * 0.6, alto * 0.5);
    const cos = Math.cos(INCLINACION_RAD);
    const sin = Math.sin(INCLINACION_RAD);
    const cantidad = ancho < 500 ? 700 : PARTICULAS.length;
    const quieto = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;

    const dibujar = (ms: number) => {
      ctx.clearRect(0, 0, ancho, alto);
      const factor = atenuado ? 0.35 : 1; // b) se aplica a las dos secciones de opacidad
      const giro = ms * 0.00007;

      // Órbitas tenues
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 224, 140, 0.13)";
      ctx.globalAlpha = factor;
      for (const a of ANILLOS) {
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          a.radioX * k,
          a.radioY * k,
          INCLINACION_RAD,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }

      // Polvo de estrellas
      for (let i = 0; i < cantidad; i++) {
        const p = PARTICULAS[i];
        const ang = p.theta + giro;
        const dx = Math.cos(ang) * p.r * radio;
        const dy = Math.sin(ang) * p.r * radio * FLATTEN + p.altura;
        const x = cx + dx * cos - dy * sin;
        const y = cy + dx * sin + dy * cos;
        ctx.globalAlpha =
          p.brillo * (0.65 + 0.35 * Math.sin(ms * p.vel + p.fase)) * factor;

        ctx.globalAlpha =
          p.brillo * (0.65 + 0.35 * Math.sin(ms * p.vel + p.fase));
        ctx.fillStyle = p.css;
        if (p.tam > 1.7) {
          ctx.beginPath();
          ctx.arc(x, y, p.tam, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, p.tam, p.tam);
        }
      }
      ctx.globalAlpha = 1;

      if (!quieto) frame = requestAnimationFrame(dibujar);
    };

    frame = requestAnimationFrame(dibujar);
    return () => cancelAnimationFrame(frame);
  }, [ancho, alto, centroY, k, atenuado]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      data-excluir-captura="true"
      className="absolute inset-0"
      style={{ width: ancho, height: alto }}
    />
  );
}
