import type { TemaSobre } from '../../data/sobres'

interface Props {
  emblema: string
  etiqueta: string
  tema: TemaSobre
}

const SOLAPA = 'polygon(0 0, 100% 0, 50% 100%)'
const degradado = ([a, b]: [string, string]) => `linear-gradient(to bottom, ${a}, ${b})`

export default function Sobre({ emblema, etiqueta, tema }: Props) {
  return (
    <div
      className="cursor-pointer relative h-[84px] w-[124px] overflow-hidden rounded-md"
      style={{
        background: degradado(tema.papel),
        border: `1px solid ${tema.borde}`,
        boxShadow: `0 8px 24px rgb(5 6 15 / 0.6), 0 0 28px rgb(${tema.brillo} / 0.45)`,
      }}
    >
      {/* Pliegues */}
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

      {/* Solapa: sombra fina + papel */}
      <div
        className="absolute inset-x-0 top-0 h-[60%] translate-y-[2px]"
        style={{ background: tema.pliegue, opacity: 0.35, clipPath: SOLAPA }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[60%]"
        style={{ background: degradado(tema.solapa), clipPath: SOLAPA }}
      />

      {/* Sello con el emblema */}
      <div
        className="absolute left-1/2 top-[46%] grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-md"
        style={{ background: `linear-gradient(135deg, ${tema.sello[0]}, ${tema.sello[1]})` }}
      >
        <img src={emblema} alt="" draggable={false} className="size-5 object-contain drop-shadow-sm" />
      </div>

      {/* Texto escrito a mano */}
      <p
        className="absolute inset-x-0 bottom-1 text-center font-hand text-[19px] font-semibold leading-none"
        style={{ color: tema.tinta }}
      >
        {etiqueta}
      </p>
    </div>
  )
}