import { create } from 'zustand'
import type { SobreId } from '../data/sobres'

// Posición del sobre respecto al centro de la pantalla, en px
export interface Origen {
  x: number
  y: number
}

interface SobresState {
  activo: SobreId | null
  origen: Origen | null
  cerrando: boolean
  abiertos: SobreId[]
  abrir: (id: SobreId, origen: Origen) => void
  cerrar: () => void
  terminar: () => void
}

export const useSobresStore = create<SobresState>((set, get) => ({
  activo: null,
  origen: null,
  cerrando: false,
  abiertos: [],

  abrir: (id, origen) => {
    if (get().activo) return
    set({ activo: id, origen, cerrando: false })
  },

  cerrar: () => set({ cerrando: true }),

  // Se llama cuando el sobre ya volvió al abanico: ahí lo damos por abierto
  terminar: () =>
    set((s) => ({
      activo: null,
      origen: null,
      cerrando: false,
      abiertos: s.activo && !s.abiertos.includes(s.activo) ? [...s.abiertos, s.activo] : s.abiertos,
    })),
}))