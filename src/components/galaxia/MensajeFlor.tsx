import { AnimatePresence, motion } from "framer-motion";
import { FLORES } from "../../data/galaxia";
import { useGalaxiaStore } from "../../store/useGalaxiaStore";

export default function MensajeFlor() {
  const activa = useGalaxiaStore((s) => s.activa);
  const cerrar = useGalaxiaStore((s) => s.cerrar);
  const flor = FLORES.find((f) => f.id === activa);
  const completa = useGalaxiaStore((s) => s.completa);
  return (
    <AnimatePresence>
      {flor && !completa && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[280] flex items-center justify-center px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Destello detrás del texto */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute size-[340px] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgb(255 225 130 / 0.35), transparent)",
            }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          <motion.button
            type="button"
            className="pointer-events-auto max-w-xs text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            onClick={cerrar}
          >
            <p className="text-balance font-script text-4xl leading-snug text-sol-100 text-glow">
              {flor.mensaje}
            </p>
            <span className="mt-5 block font-hand text-lg text-sol-200/60">
              toca para volver
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
