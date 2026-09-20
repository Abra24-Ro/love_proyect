import { create } from 'zustand'

export type Escena = 'regalo' | 'frasco' | 'carta' | 'galaxia' | 'final'

interface EscenaState {
  escena: Escena
  ir: (escena: Escena) => void
}

export const useEscenaStore = create<EscenaState>((set) => ({
  escena: 'regalo',
  ir: (escena) => set({ escena }),
}))