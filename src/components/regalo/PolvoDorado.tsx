import { motion } from 'framer-motion'
import { DELAY_LUZ } from './tiempos'

const PARTICULAS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 90, // dónde nace
  deriva: (Math.random() - 0.5) * 220, // hacia dónde se desvía
  alto: 220 + Math.random() * 260, // cuánto sube
  tam: 2 + Math.random() * 4,
  dur: 2.6 + Math.random() * 2.4,
  espera: Math.random() * 3,
}))

export default function PolvoDorado({ origenY }: { origenY: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2" style={{ top: origenY }}>
      {PARTICULAS.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-sol-200"
          style={{
            width: p.tam,
            height: p.tam,
            left: p.x,
            boxShadow: '0 0 8px 2px rgb(255 210 31 / 0.8)',
          }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1, 0.6],
            x: p.deriva,
            y: -p.alto,
          }}
          transition={{
            duration: p.dur,
            delay: DELAY_LUZ + p.espera,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}