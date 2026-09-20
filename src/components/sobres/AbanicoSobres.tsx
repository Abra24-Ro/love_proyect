import { motion } from 'framer-motion'
import { SOBRES } from '../../data/sobres'
import { DELAY_SOBRES } from '../regalo/tiempos'
import Sobre from './Sobre'

export default function AbanicoSobres({ origenY }: { origenY: number }) {
  return (
    <div className="absolute left-1/2" style={{ top: origenY }}>
      {SOBRES.map((s, i) => {
        const inicio = DELAY_SOBRES + s.salida * 0.35

        return (
          <motion.div
            key={s.id}
            className="absolute"
            style={{ left: -62, top: -42, zIndex: s.z }}
            initial={{ x: 0, y: 0, scale: 0.2, rotate: 0, opacity: 0 }}
            animate={{ x: s.x, y: s.y, scale: s.escala, rotate: s.giro, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 70,
              damping: 12,
              delay: inicio,
              opacity: { duration: 0.6, delay: inicio },
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            >
              <Sobre emblema={s.emblema} etiqueta={s.etiqueta} tema={s.tema} />
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}