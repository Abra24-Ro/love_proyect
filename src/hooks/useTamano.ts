import { useEffect, useRef, useState } from "react";

// Mide un elemento y se actualiza si cambia de tamaño (girar el celular, redimensionar)
export function useTamano<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [tam, setTam] = useState({ ancho: 0, alto: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observador = new ResizeObserver(([entrada]) => {
      const { width, height } = entrada.contentRect;
      setTam({ ancho: width, alto: height });
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return { ref, ancho: tam.ancho, alto: tam.alto };
}