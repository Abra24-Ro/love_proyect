export type TipoFlor = "rosaRosa" | "rosaAmarilla" | "girasol";

export interface Anillo {
  radioX: number; // px, pensado para una pantalla de ~380 px de ancho
  radioY: number; // más chico que radioX: así la galaxia se ve inclinada
  velocidad: number; // relativa (1 = la más rápida)
  tamano: number; // px de cada flor en este anillo
}

export const ANILLOS: Anillo[] = [
  { radioX: 84, radioY: 28, velocidad: 1, tamano: 30 },
  { radioX: 118, radioY: 40, velocidad: 0.72, tamano: 36 },
  { radioX: 150, radioY: 52, velocidad: 0.5, tamano: 42 },
];

export interface FlorGalaxia {
  id: string;
  tipo: TipoFlor;
  anillo: number; // índice dentro de ANILLOS
  fase: number; // ángulo inicial en grados
  mensaje: string;
}

// Mensajes de prueba: cámbialos por los tuyos (6 a 14 palabras cada uno)
// Mensajes de prueba: cámbialos por los tuyos (6 a 14 palabras cada uno)
export const FLORES: FlorGalaxia[] = [
  // Anillo interior
  {
    id: "f01",
    tipo: "rosaRosa",
    anillo: 0,
    fase: 20,
    mensaje: "Gracias por elegir quedarte de mi lado.",
  },
  {
    id: "f02",
    tipo: "rosaAmarilla",
    anillo: 0,
    fase: 110,
    mensaje: "Tus besos me saben a estar en casa.",
  },
  {
    id: "f03",
    tipo: "rosaRosa",
    anillo: 0,
    fase: 200,
    mensaje: "Me pierdo en tus ojos y no quiero encontrarme.",
  },
  {
    id: "f04",
    tipo: "girasol",
    anillo: 0,
    fase: 290,
    mensaje: "Ese gesto tuyo que hace sonreír a mi alma.",
  },

  // Anillo medio
  {
    id: "f05",
    tipo: "rosaRosa",
    anillo: 1,
    fase: 36,
    mensaje: "Contigo hasta el silencio se siente bonito.",
  },
  {
    id: "f06",
    tipo: "girasol",
    anillo: 1,
    fase: 108,
    mensaje: "Eres mi manera favorita de perder el tiempo.",
  },
  {
    id: "f07",
    tipo: "rosaRosa",
    anillo: 1,
    fase: 180,
    mensaje: "Cada abrazo tuyo es un lugar al que quiero volver.",
  },
  {
    id: "f08",
    tipo: "rosaAmarilla",
    anillo: 1,
    fase: 252,
    mensaje: "Me gusta cómo te ríes de tus propios chistes.",
  },
  {
    id: "f09",
    tipo: "rosaRosa",
    anillo: 1,
    fase: 324,
    mensaje: "Andamos un poco locos, pero de la mano.",
  },

  // Anillo exterior
  {
    id: "f10",
    tipo: "rosaAmarilla",
    anillo: 2,
    fase: 10,
    mensaje: "Gracias por hacerme sentir tan tranquilo estando contigo.",
  },
  {
    id: "f11",
    tipo: "rosaRosa",
    anillo: 2,
    fase: 82,
    mensaje: "Tu voz es de mis sonidos favoritos del mundo.",
  },
  {
    id: "f12",
    tipo: "girasol",
    anillo: 2,
    fase: 154,
    mensaje: "Me encanta descubrirte un poco más cada día.",
  },
  {
    id: "f13",
    tipo: "rosaRosa",
    anillo: 2,
    fase: 226,
    mensaje: "Contigo el tiempo se siente distinto, más nuestro.",
  },
  {
    id: "f14",
    tipo: "rosaRosa",
    anillo: 2,
    fase: 298,
    mensaje: "Te quiero así, sin prisa, para siempre.",
  },
];

export const TITULO_FINAL = "Formaste nuestro cielo";
export const MENSAJE_FINAL_GALAXIA =
  "Cada flor es un motivo, pero tú eres todos los motivos juntos.";

export const MENSAJE_ULTIMO =
  "Amor mio escribo esto desde el profundo de mi corazón, para decirte que eres la persona más importante en mi vida y que cada día a tu lado es un regalo que valoro infinitamente. Gracias por ser mi compañera, mi amiga y mi amor. Te amo con todo mi ser y siempre lo haré. Eres mi alegría, mi refugio y mi inspiración. No hay palabras suficientes para expresar lo que siento por ti, pero quiero que sepas que cada momento contigo es un tesoro que guardo en lo más profundo de mi corazón. Gracias por ser tú, por tu amor incondicional y por hacerme sentir completo. Te amo más de lo que las palabras pueden decir.";
export const FIRMA_ULTIMA = "Con todo mi amor";
export const FECHA_SELLO = "21 de septiembre de 2026"; // o "Día de las Flores Amarillas, 2026"
