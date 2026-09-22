import type { TipoFlor } from "../../data/galaxia";

export interface EstiloFlor {
  petalo: "petalo-redondo" | "petalo-largo";
  gradiente: [string, string, string]; // base, medio, punta
  trazo: string;
  centro: { radio: number; colores: [string, string] };
  anillos: { angulos: number[]; escala: number }[];
  brillo: string; // color del halo
}

// n ángulos repartidos en el círculo
const repartir = (n: number, desfase = 0) =>
  Array.from({ length: n }, (_, i) => desfase + (360 / n) * i);

export const ESTILOS: Record<TipoFlor, EstiloFlor> = {
  rosaRosa: {
    petalo: "petalo-redondo",
    gradiente: ["#c2255c", "#ff8fab", "#ffd9e3"],
    trazo: "#a61e4d",
    centro: { radio: 6, colores: ["#ffb3c6", "#d6336c"] },
    anillos: [
      { angulos: repartir(8), escala: 1.25 },
      { angulos: [22, 82, 142, 202, 262, 322], escala: 0.95 },
      { angulos: [10, 82, 154, 226, 298], escala: 0.62 },
    ],
    brillo: "rgb(255 105 150 / 0.4)",
  },
  rosaAmarilla: {
    petalo: "petalo-redondo",
    gradiente: ["#e08a00", "#ffc21a", "#fff08a"],
    trazo: "#c77700",
    centro: { radio: 6, colores: ["#ffe14d", "#e08a00"] },
    anillos: [
      { angulos: repartir(8), escala: 1.25 },
      { angulos: [22, 82, 142, 202, 262, 322], escala: 0.95 },
      { angulos: [10, 82, 154, 226, 298], escala: 0.62 },
    ],
    brillo: "rgb(255 210 31 / 0.4)",
  },
  girasol: {
    petalo: "petalo-largo",
    gradiente: ["#e08a00", "#ffb703", "#ffe066"],
    trazo: "#b86a00",
    centro: { radio: 13, colores: ["#7a4a12", "#2a1408"] },
    anillos: [
      { angulos: repartir(14), escala: 1.05 },
      { angulos: repartir(14, 12.85), escala: 0.82 },
    ],
    brillo: "rgb(255 183 3 / 0.4)",
  },
};