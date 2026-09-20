import type { CSSProperties, ReactNode } from 'react'

export type Cara = 'frente' | 'atras' | 'derecha' | 'izquierda' | 'arriba' | 'abajo'

// Sombreado falso por cara para dar sensación de luz
const BRILLO: Record<Cara, number> = {
  frente: 1,
  atras: 0.7,
  derecha: 0.8,
  izquierda: 0.62,
  arriba: 1.18,
  abajo: 0.5,
}

interface PrismaProps {
  w: number
  h: number
  d: number
  omitir?: Cara[]
  caraClass?: string
  renderCara?: (cara: Cara) => ReactNode
  style?: CSSProperties
}

export default function Prisma({
  w,
  h,
  d,
  omitir = [],
  caraClass = '',
  renderCara,
  style,
}: PrismaProps) {
  const caras: Record<Cara, CSSProperties> = {
    frente:    { width: w, height: h, left: 0, top: 0, transform: `translateZ(${d / 2}px)` },
    atras:     { width: w, height: h, left: 0, top: 0, transform: `rotateY(180deg) translateZ(${d / 2}px)` },
    derecha:   { width: d, height: h, left: (w - d) / 2, top: 0, transform: `rotateY(90deg) translateZ(${w / 2}px)` },
    izquierda: { width: d, height: h, left: (w - d) / 2, top: 0, transform: `rotateY(-90deg) translateZ(${w / 2}px)` },
    arriba:    { width: w, height: d, left: 0, top: (h - d) / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)` },
    abajo:     { width: w, height: d, left: 0, top: (h - d) / 2, transform: `rotateX(-90deg) translateZ(${h / 2}px)` },
  }

  return (
    <div
      className="absolute"
      style={{ width: w, height: h, transformStyle: 'preserve-3d', ...style }}
    >
      {(Object.keys(caras) as Cara[])
        .filter((c) => !omitir.includes(c))
        .map((c) => (
          <div
            key={c}
            className={`absolute overflow-hidden ${caraClass}`}
            style={{ ...caras[c], filter: `brightness(${BRILLO[c]})` }}
          >
            {renderCara?.(c)}
          </div>
        ))}
    </div>
  )
}