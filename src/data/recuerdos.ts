export interface Recuerdo {
  id: string;
  foto: string;
  fecha: string; // formato AAAA-MM-DD; se muestra como "11 de julio de 2026"
  mensaje: string; // ideal: menos de ~140 caracteres
  enfoque?: string; // object-position CSS. "50% 0%" = mostrar la parte de arriba de la foto
}

const RECUERDOS_SIN_ORDEN: Recuerdo[] = [
  {
    id: "01",
    foto: "/recuerdos/01.webp",
    fecha: "2026-07-11",
    mensaje: "Me pierdo en tus ojos y me encuentro en tu corazón, siempre.",
  },
  {
    id: "02",
    foto: "/recuerdos/02.webp",
    fecha: "2026-08-16",
    mensaje:
      "Incluso cuando caminas dándome la espalda, me dejas sin palabras. Qué afortunado soy de poder seguir tus pasos.",
  },
  {
    id: "03",
    foto: "/recuerdos/03.webp",
    fecha: "2026-09-10",
    mensaje: "Lo mejor de mi día es cuando por fin te tengo así en mis brazos.",
  },
  {
    id: "04",
    foto: "/recuerdos/04.webp",
    fecha: "2026-08-17",
    mensaje:
      "Me encanta cómo encajamos a la perfección. Abrazándote fuerte en plena calle, el resto del mundo desaparece. Es todo lo que necesito.",
  },
  {
    id: "05",
    foto: "/recuerdos/05.webp",
    fecha: "2026-09-02",
    mensaje: "Caminar un rato contigo al atardecer… mi parte favorita del día.",
  },
  {
    id: "06",
    foto: "/recuerdos/06.webp",
    fecha: "2026-08-18",
    mensaje: "Mi lugar favorito para descansar siempre va a ser cerquita de ti.",
  },
];

// Siempre en orden cronológico: así la pila cuenta su historia de principio a fin
export const RECUERDOS = [...RECUERDOS_SIN_ORDEN].sort((a, b) =>
  a.fecha.localeCompare(b.fecha),
);

export const MENSAJE_FINAL = "Y faltan tantas más por vivir…";
export const FIRMA_FINAL = "Con todo mi amor";

// Lo que muestra la pila: cada foto y, al final, una tarjeta de cierre
export type ItemPila =
  | { tipo: "foto"; recuerdo: Recuerdo }
  | { tipo: "final"; mensaje: string; firma?: string };

export const ITEMS: ItemPila[] = [
  ...RECUERDOS.map((recuerdo): ItemPila => ({ tipo: "foto", recuerdo })),
  { tipo: "final", mensaje: MENSAJE_FINAL, firma: FIRMA_FINAL },
];