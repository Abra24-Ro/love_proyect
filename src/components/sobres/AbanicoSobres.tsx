import { useState } from 'react'
import { motion } from 'framer-motion'
import { tocar } from '../../audio/sonido'
import { SOBRES, type SobreId } from '../../data/sobres'
import { useSobresStore } from '../../store/useSobresStore'
import { DELAY_SOBRES } from '../regalo/tiempos'
import Sobre from './Sobre'
import { T_SOLAPA } from './tiempos'

export default function AbanicoSobres({ origenY }: { origenY: number }) {
  const [llegaron, setLlegaron] = useState<SobreId[]>([])
  const activo = useSobresStore((s) => s.activo)
  const abrir = useSobresStore((s) => s.abrir)

  const interactivo = llegaron.length >= SOBRES.length && activo === null

  function tocarSobre(id: SobreId, el: HTMLElement) {
    const r = el.getBoundingClientRect()
    abrir(id, {
      x: r.left + r.width / 2 - window.innerWidth / 2,
      y: r.top + r.height / 2 - window.innerHeight / 2,
    })
    tocar('magia.mp3', { retraso: T_SOLAPA, volumen: 0.7 })
  }

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
            onAnimationComplete={() =>
              setLlegaron((l) => (l.includes(s.id) ? l : [...l, s.id]))
            }
          >
            {/* Se oculta mientras su copia está en el centro */}
            <motion.div
              animate={{ opacity: activo === s.id ? 0 : 1 }}
              transition={{ duration: 0 }}
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
                <motion.button
                  type="button"
                  aria-label={s.etiqueta}
                  disabled={!interactivo}
                  className="block"
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => tocarSobre(s.id, e.currentTarget)}
                >
                  <Sobre emblema={s.emblema} etiqueta={s.etiqueta} tema={s.tema} />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}