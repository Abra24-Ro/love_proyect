import { AnimatePresence } from 'framer-motion'
import { useEscenaStore } from './store/useEscenaStore'
import Regalo from './scenes/Regalo'
import BotonSonido from './components/sonido/BotonSonido'


export default function App() {
  const escena = useEscenaStore((s) => s.escena)

  return (
    <>
      <BotonSonido />
      <AnimatePresence mode="wait">
        {escena === 'regalo' && <Regalo key="regalo" />}
      </AnimatePresence>
    </>
  )
}