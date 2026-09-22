import type { Anillo } from "../data/galaxia";

// Toda la galaxia está ligeramente girada, como un disco visto en perspectiva
export const INCLINACION_GRADOS = -14;
export const INCLINACION_RAD = (INCLINACION_GRADOS * Math.PI) / 180;

export interface PuntoOrbital {
  x: number;
  y: number;
  escala: number;
  opacidad: number;
  profundidad: number; // 0 = al fondo, 1 = al frente
}

export function proyectar(grados: number, anillo: Anillo, k: number): PuntoOrbital {
  const a = (grados * Math.PI) / 180;
  const seno = Math.sin(a);
  const px = Math.cos(a) * anillo.radioX * k;
  const py = seno * anillo.radioY * k;
  const profundidad = (seno + 1) / 2;

  return {
    x: px * Math.cos(INCLINACION_RAD) - py * Math.sin(INCLINACION_RAD),
    y: px * Math.sin(INCLINACION_RAD) + py * Math.cos(INCLINACION_RAD),
    escala: 0.62 + 0.5 * profundidad,
    opacidad: 0.55 + 0.45 * profundidad,
    profundidad,
  };
}