import { create } from "zustand";
import { FLORES } from "../data/galaxia";
interface GalaxiaState {
  activa: string | null;
  leidas: string[];
  completa: boolean; // ya descubrió todas
  abrir: (id: string) => void;
  cerrar: () => void;
}


export const useGalaxiaStore = create<GalaxiaState>((set, get) => ({
  activa: null,
  leidas: [],
  completa: false,

  abrir: (id) => {
    if (get().activa) return;
    set((s) => {
      const leidas = s.leidas.includes(id) ? s.leidas : [...s.leidas, id];
      return { activa: id, leidas, completa: leidas.length >= FLORES.length };
    });
  },

  cerrar: () => set({ activa: null }),
}));