import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CajaRegalo from "../components/regalo/CajaRegalo";
import {
  DELAY_LUZ,
  DELAY_SOBRES,
  DELAY_TAPA,
} from "../components/regalo/tiempos";
import { desbloquear, iniciarMusica, precargar, tocar } from "../audio/sonido";
import { useEscalaVista } from "../hooks/useEscalaVista";

export default function Regalo() {
  const [abierta, setAbierta] = useState(false);
  const escala = useEscalaVista();

  useEffect(() => {
    void precargar(["tapa.mp3", "magia.mp3"]);
  }, []);

  function abrir() {
    setAbierta(true);
    void desbloquear();
    iniciarMusica("/audio/musica.mp3", 0.5);
    tocar("tapa.mp3", { retraso: DELAY_TAPA });
    tocar("magia.mp3", { retraso: DELAY_LUZ });
  }

  return (
    <motion.main
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Brillo suave de fondo */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-radial from-sol-400/30 via-sol-500/10 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: abierta ? 1 : 0 }}
        transition={{ duration: 2, delay: abierta ? DELAY_LUZ : 0 }}
      />

      {/* Nivel 1: título, siempre arriba */}
      <div
        className="absolute inset-x-0 z-10 flex justify-center px-6 text-center"
        style={{ top: "max(2.5rem, env(safe-area-inset-top))" }}
      >
        <AnimatePresence mode="wait">
          <motion.h1
            key={abierta ? "elige" : "tengo"}
            className="font-script text-4xl text-sol-300 text-glow sm:text-5xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.4, delay: 0 } }}
            transition={{
              duration: 0.8,
              delay: abierta ? DELAY_SOBRES - 0.6 : 0,
            }}
          >
            {abierta ? "Elige uno..." : "Tengo algo para ti..."}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Niveles 2 y 3: sobres y caja */}
      <div
        className="flex flex-col items-center gap-14"
        style={{ transform: `scale(${escala})` }}
      >
        <CajaRegalo abierta={abierta} />

        <motion.button
          className={`btn-glow animate-pulse-glow ${abierta ? "pointer-events-none" : ""}`}
          whileTap={{ scale: 0.95 }}
          animate={{ opacity: abierta ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          disabled={abierta}
          onClick={abrir}
        >
          Abrir
        </motion.button>
      </div>

      {import.meta.env.DEV && (
        <button
          className="absolute bottom-4 right-4 text-xs text-sol-200/40"
          onClick={() => setAbierta(false)}
        >
          ↺ reiniciar (dev)
        </button>
      )}
    </motion.main>
  );
}
