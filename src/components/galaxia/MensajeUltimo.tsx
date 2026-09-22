import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FECHA_SELLO, FIRMA_ULTIMA, MENSAJE_ULTIMO } from "../../data/galaxia";

function tamanoMensaje(texto: string) {
  if (texto.length <= 200) return "text-2xl";
  if (texto.length <= 400) return "text-xl";
  return "text-lg";
}

export default function MensajeUltimo() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        className="pointer-events-auto absolute inset-x-0 mx-auto w-fit rounded-full border border-sol-300/30 px-5 py-1.5 font-hand text-lg text-sol-200/80"
        style={{
          bottom: "max(4rem, calc(3.5rem + env(safe-area-inset-bottom)))",
          background: "rgb(5 6 15 / 0.6)",
          zIndex: 400,
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: abierto ? 0 : 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        onClick={() => setAbierto(true)}
      >
        Léeme una vez más
      </motion.button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center px-6"
            style={{ zIndex: 500, background: "#05060f" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute size-[420px] rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgb(255 225 130 / 0.3), transparent)",
              }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />

            <motion.button
              type="button"
              className="relative flex max-h-[80vh] w-full max-w-md flex-col items-center overflow-y-auto rounded-lg px-6 py-8 text-center"
              style={{
                background: "rgb(18 22 51 / 0.85)",
                border: "1px solid rgb(255 210 31 / 0.25)",
              }}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              onClick={() => setAbierto(false)}
            >
              <p
                className={`text-balance font-hand leading-snug text-sol-100 ${tamanoMensaje(MENSAJE_ULTIMO)}`}
              >
                {MENSAJE_ULTIMO}
              </p>
              <span className="my-5 h-px w-16 bg-sol-200/25" />
              <p className="font-hand text-xl text-sol-200/80">{FIRMA_ULTIMA}</p>
              <p className="mt-1 font-hand text-base text-sol-200/50">{FECHA_SELLO}</p>
              <span className="mt-5 font-hand text-base text-sol-200/50">
                toca para volver
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}