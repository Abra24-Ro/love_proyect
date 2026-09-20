import { useSyncExternalStore } from 'react'

const ALTO_REF = 760 // altura a la que todo se ve a tamaño completo

function suscribir(cb: () => void) {
  window.addEventListener('resize', cb)
  return () => window.removeEventListener('resize', cb)
}

export function useEscalaVista() {
  const alto = useSyncExternalStore(suscribir, () => window.innerHeight)
  return Math.min(1, Math.max(0.6, alto / ALTO_REF))
}