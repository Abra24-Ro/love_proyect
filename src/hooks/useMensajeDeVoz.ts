import { useCallback, useEffect, useRef, useState } from "react";
import { atenuarMusica, suscribirSilencio } from "../audio/sonido";

export type EstadoVoz =
  | "listo"
  | "reproduciendo"
  | "pausado"
  | "terminado"
  | "error";

export function useMensajeDeVoz(src: string) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [estado, setEstado] = useState<EstadoVoz>("listo");
  const [progreso, setProgreso] = useState(0); // 0 a 1
  const [ronda, setRonda] = useState(0); // sube cada vez que se repite

  useEffect(() => {
    const el = new Audio(src);
    el.preload = "auto";
    audio.current = el;

    const alAvanzar = () =>
      setProgreso(el.duration ? el.currentTime / el.duration : 0);
    const alReproducir = () => {
      setEstado("reproduciendo");
      atenuarMusica(true);
    };
    const alPausar = () => {
      if (el.ended) return;
      setEstado("pausado");
      atenuarMusica(false);
    };
    const alTerminar = () => {
      setProgreso(1);
      setEstado("terminado");
      atenuarMusica(false);
    };
    const alFallar = () => {
      console.warn(`No se pudo cargar ${src}`);
      setEstado("error");
    };

    el.addEventListener("timeupdate", alAvanzar);
    el.addEventListener("play", alReproducir);
    el.addEventListener("pause", alPausar);
    el.addEventListener("ended", alTerminar);
    el.addEventListener("error", alFallar);
    const dejarDeEscuchar = suscribirSilencio((mudo) => {
      el.muted = mudo;
    });

    return () => {
      el.pause();
      el.removeEventListener("timeupdate", alAvanzar);
      el.removeEventListener("play", alReproducir);
      el.removeEventListener("pause", alPausar);
      el.removeEventListener("ended", alTerminar);
      el.removeEventListener("error", alFallar);
      dejarDeEscuchar();
      atenuarMusica(false); // si se cierra el sobre a media voz, la música vuelve
      audio.current = null;
    };
  }, [src]);

  const alternar = useCallback(() => {
    const el = audio.current;
    if (!el) return;

    if (el.ended) {
      el.currentTime = 0;
      setProgreso(0);
      setRonda((r) => r + 1);
    }

    if (el.paused) {
      el.play().catch(() => setEstado("error"));
    } else {
      el.pause();
    }
  }, []);

  return { estado, progreso, ronda, alternar };
}