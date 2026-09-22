import type { TipoFlor } from "../../data/galaxia";
import { ESTILOS, type EstiloFlor } from "./estilosFlor";

// Se renderiza una vez en la escena; las flores referencian sus ids
export function DefsFlores() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <path id="petalo-redondo" d="M0 0 C-18 -4 -20 -24 -8 -33 C-3 -37 3 -37 8 -33 C20 -24 18 -4 0 0 Z" />
        <path id="petalo-largo" d="M0 0 C-7 -8 -8 -30 0 -42 C8 -30 7 -8 0 0 Z" />
        {(Object.entries(ESTILOS) as [TipoFlor, EstiloFlor][]).map(([tipo, e]) => (
          <g key={tipo}>
            <linearGradient id={`flor-${tipo}-g`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={e.gradiente[0]} />
              <stop offset="0.55" stopColor={e.gradiente[1]} />
              <stop offset="1" stopColor={e.gradiente[2]} />
            </linearGradient>
            <radialGradient id={`flor-${tipo}-c`}>
              <stop offset="0" stopColor={e.centro.colores[0]} />
              <stop offset="1" stopColor={e.centro.colores[1]} />
            </radialGradient>
          </g>
        ))}
      </defs>
    </svg>
  );
}

interface Props {
  tipo: TipoFlor;
  className?: string;
}

export default function FlorSVG({ tipo, className }: Props) {
  const e = ESTILOS[tipo];

  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden>
      <g stroke={e.trazo} strokeOpacity="0.45" strokeWidth="0.6">
        {e.anillos.map((anillo) => (
          <g key={anillo.escala} fill={`url(#flor-${tipo}-g)`}>
            {anillo.angulos.map((a) => (
              <use
                key={a}
                href={`#${e.petalo}`}
                transform={`rotate(${a}) scale(${anillo.escala})`}
              />
            ))}
          </g>
        ))}
      </g>
      <circle r={e.centro.radio} fill={`url(#flor-${tipo}-c)`} />
    </svg>
  );
}