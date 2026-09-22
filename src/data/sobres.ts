export type SobreId = "frasco" | "recuerdos" | "galaxia";

export interface TemaSobre {
  papel: [string, string]; // degradado del cuerpo
  solapa: [string, string]; // degradado de la solapa
  pliegue: string; // pliegues y sombra de la solapa
  borde: string;
  sello: [string, string];
  brillo: string; // "r g b" del resplandor
  tinta: string; // color del texto
}

export interface SobreInfo {
  id: SobreId;
  etiqueta: string;
  emblema: string; // URL de un SVG (o PNG/WebP)
  tema: TemaSobre;
  x: number;
  y: number;
  giro: number;
  escala: number;
  salida: number; // orden de aparición (0 = primero)
  z: number; // cuál queda encima al solaparse
  conPapel?: boolean; // por defecto true; false = la escena trae su propio marco
  soloEscena?: boolean;
  pantallaCompleta?: boolean;
}

const ORO: TemaSobre = {
  papel: ["#fffbe6", "#fff08a"],
  solapa: ["#fffbe6", "#fff08a"],
  pliegue: "#e08a00",
  borde: "rgb(255 183 3 / 0.7)",
  sello: ["#ff8fab", "#d6336c"],
  brillo: "255 210 31",
  tinta: "#7a4a00",
};

const DURAZNO: TemaSobre = {
  papel: ["#fff4ec", "#ffd9c7"],
  solapa: ["#fff4ec", "#ffcdb8"],
  pliegue: "#d9663a",
  borde: "rgb(255 160 120 / 0.55)",
  sello: ["#ff9d7a", "#c8452b"],
  brillo: "255 150 110",
  tinta: "#8a3b1e",
};

const LILA: TemaSobre = {
  papel: ["#f7f4ff", "#ddd5ff"],
  solapa: ["#f7f4ff", "#d0c6ff"],
  pliegue: "#6a58d6",
  borde: "rgb(170 150 255 / 0.55)",
  sello: ["#8b7bff", "#4b3bb5"],
  brillo: "175 155 255",
  tinta: "#41358a",
};

// Provisional: usa el yellowf.svg de /public. Cuando tengas los tuyos:
//   import girasol from '../assets/emblemas/girasol.svg'
// y pones emblema: girasol
const PROVISIONAL = "/yellowf.svg";
const LOVE = "love.svg";
const FLOWER = "infinite.svg";

export const SOBRES: SobreInfo[] = [
  {
    soloEscena: true,
    conPapel: false,
    id: "frasco",
    etiqueta: "Para nosotros",
    emblema: PROVISIONAL,
    tema: DURAZNO,
    x: -96,
    y: -145,
    giro: -9,
    escala: 0.95,
    salida: 0,
    z: 1,
  },
  {
    conPapel: false,
    id: "recuerdos",
    etiqueta: "Para ti",
    emblema: LOVE,
    tema: ORO,
    x: 0,
    y: -205,
    giro: 0,
    escala: 1.3,
    salida: 2,
    z: 3,
  },
  {
    conPapel: false,
    soloEscena: true,
    pantallaCompleta: true,
    id: "galaxia",
    etiqueta: "Para siempre",
    emblema: FLOWER,
    tema: LILA,
    x: 96,
    y: -145,
    giro: 9,
    escala: 0.95,
    salida: 1,
    z: 2,
  },
];
