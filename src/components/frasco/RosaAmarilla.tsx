interface Props {
  className?: string;
}

// Cada anillo: pétalos repartidos alrededor del centro, del más grande al más pequeño
const ANILLOS = [
  { angulos: [0, 45, 90, 135, 180, 225, 270, 315], escala: 1.25 },
  { angulos: [22, 82, 142, 202, 262, 322], escala: 0.95 },
  { angulos: [10, 82, 154, 226, 298], escala: 0.62 },
];

export default function RosaAmarilla({ className }: Props) {
  return (
    <svg viewBox="0 0 120 200" className={className} role="img" aria-label="Una rosa amarilla">
      <defs>
        <linearGradient id="rosa-petalo-g" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e08a00" />
          <stop offset="0.55" stopColor="#ffc21a" />
          <stop offset="1" stopColor="#fff08a" />
        </linearGradient>
        <radialGradient id="rosa-centro-g">
          <stop offset="0" stopColor="#ffe14d" />
          <stop offset="1" stopColor="#e08a00" />
        </radialGradient>
        <linearGradient id="rosa-hoja-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7cc257" />
          <stop offset="1" stopColor="#2f6b2a" />
        </linearGradient>
        {/* Un pétalo redondeado, apuntando hacia arriba */}
        <path
          id="rosa-petalo"
          d="M0 0 C-18 -4 -20 -24 -8 -33 C-3 -37 3 -37 8 -33 C20 -24 18 -4 0 0 Z"
        />
      </defs>

      {/* Tallo y hojas */}
      <path
        d="M60 100 C57 130 64 160 60 200"
        stroke="#3f7d2c"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M60 152 C42 148 30 154 22 140 C40 134 56 140 60 152 Z" fill="url(#rosa-hoja-g)" />
      <path d="M61 132 C78 126 90 130 98 116 C80 112 66 118 61 132 Z" fill="url(#rosa-hoja-g)" />

      {/* Flor */}
      <g transform="translate(60 64)" stroke="#c77700" strokeOpacity="0.45" strokeWidth="0.6">
        {ANILLOS.map((anillo) => (
          <g key={anillo.escala} fill="url(#rosa-petalo-g)">
            {anillo.angulos.map((a) => (
              <use key={a} href="#rosa-petalo" transform={`rotate(${a}) scale(${anillo.escala})`} />
            ))}
          </g>
        ))}
        <circle r="6" fill="url(#rosa-centro-g)" />
      </g>
    </svg>
  );
}