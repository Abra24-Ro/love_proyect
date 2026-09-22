import { motion, type Variants } from 'framer-motion'
import type { TemaSobre } from '../../data/sobres'
import { T_CIERRA_SOLAPA, T_SOLAPA } from './tiempos'

interface Props {
  emblema: string
  etiqueta: string
  tema: TemaSobre
}

const TRIANGULO = 'polygon(0 0, 100% 0, 50% 100%)'
const FRENTE = 'polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)'

const degradado = ([a, b]: [string, string]) => `linear-gradient(to bottom, ${a}, ${b})`

// Se activa solo cuando el sobre vive dentro de SobreOverlay (fan / centro / regreso).
// En el abanico no hay ningún estado que la mueva, así que se queda cerrada.
const solapaVariants: Variants = {
  fan: { rotateX: 0 },
  centro: { rotateX: 180, transition: { delay: T_SOLAPA, duration: 0.8, ease: 'easeInOut' } },
  regreso: { rotateX: 0, transition: { delay: T_CIERRA_SOLAPA, duration: 0.5, ease: 'easeInOut' } },
}

export default function Sobre({ emblema, etiqueta, tema }: Props) {
  const interior = `color-mix(in srgb, ${tema.papel[1]} 72%, ${tema.pliegue})`
  const borde = `1px solid ${tema.borde}`

  return (
    <div className="relative h-[84px] w-[124px]" style={{ perspective: 500 }}>
      {/* Fondo: lo que se ve por dentro al abrir la solapa */}
      <div
        className="absolute inset-0 rounded-md"
        style={{
          background: interior,
          border: borde,
          boxShadow: `0 8px 24px rgb(5 6 15 / 0.6), 0 0 28px rgb(${tema.brillo} / 0.45)`,
        }}
      />

      {/* Frente: tres pliegues que dejan una V abierta arriba */}
      <div
        className="absolute inset-0 rounded-md"
        style={{ background: degradado(tema.papel), border: borde, clipPath: FRENTE }}
      >
        <div
          className="absolute inset-0"
          style={{ background: tema.pliegue, opacity: 0.2, clipPath: 'polygon(0 0, 52% 58%, 0 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: tema.pliegue, opacity: 0.2, clipPath: 'polygon(100% 0, 48% 58%, 100% 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: tema.pliegue, opacity: 0.12, clipPath: 'polygon(0 100%, 50% 45%, 100% 100%)' }}
        />
      </div>

      {/* Sombra bajo la solapa */}
      <div
        className="absolute inset-x-0 top-0 h-[60%] translate-y-[2px]"
        style={{ background: tema.pliegue, opacity: 0.25, clipPath: TRIANGULO }}
      />

      {/* Texto escrito a mano */}
      <p
        className="absolute inset-x-0 bottom-0.5 text-center font-hand text-[18px] font-semibold leading-none"
        style={{ color: tema.tinta }}
      >
        {etiqueta}
      </p>

      {/* Solapa: gira sobre su borde superior */}
      <motion.div
        className="absolute inset-x-0 top-0 z-10 h-[60%]"
        style={{ originY: 0, transformStyle: 'preserve-3d' }}
        variants={solapaVariants}
      >
        {/* Cara exterior */}
        <div
          className="absolute inset-0"
          style={{ background: degradado(tema.solapa), clipPath: TRIANGULO, backfaceVisibility: 'hidden' }}
        />
        {/* Cara interior: aparece cuando la solapa ya giró */}
        <div
          className="absolute inset-0"
          style={{
            background: interior,
            clipPath: TRIANGULO,
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        />
        {/* Sello pegado a la punta; gira con la solapa y desaparece al abrirse */}
        <div
          className="absolute bottom-0 left-1/2 grid size-7 place-items-center rounded-full shadow-md"
          style={{
            transform: 'translate(-50%, 50%)',
            background: `linear-gradient(135deg, ${tema.sello[0]}, ${tema.sello[1]})`,
            backfaceVisibility: 'hidden',
          }}
        >
          <img src={emblema} alt="" draggable={false} className="size-[18px] object-contain drop-shadow-sm" />
        </div>
      </motion.div>
    </div>
  )
}