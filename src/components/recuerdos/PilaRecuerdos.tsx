import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ITEMS, type ItemPila } from "../../data/recuerdos";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import TarjetaRecuerdo from "./TarjetaRecuerdo";

const TOTAL = ITEMS.length;

const claveDe = (item: ItemPila) =>
  item.tipo === "foto" ? item.recuerdo.id : "final";

export default function PilaRecuerdos() {
  const [indice, setIndice] = useState(0);
  const [direccion, setDireccion] = useState<1 | -1>(1);
  const [volteada, setVolteada] = useState(false);
  const [pista, setPista] = useState(true);

  const visibles = ITEMS.slice(indice, indice + 3);

  usePrecargarImagenes(
    ITEMS.slice(indice + 1, indice + 3).flatMap((it) =>
      it.tipo === "foto" ? [it.recuerdo.foto] : [],
    ),
  );

  const siguiente = (dir: 1 | -1 = 1) => {
    setDireccion(dir);
    setVolteada(false);
    setIndice((i) => Math.min(i + 1, TOTAL - 1));
  };

  const anterior = () => {
    setVolteada(false);
    setIndice((i) => Math.max(i - 1, 0));
  };

  const voltear = () => {
    setVolteada((v) => !v);
    setPista(false);
  };

  useEffect(() => {
    function alTeclear(e: KeyboardEvent) {
      if (e.key === "ArrowRight") siguiente();
      if (e.key === "ArrowLeft") anterior();
    }
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [siguiente, anterior]);

  return (
    <div className="flex flex-col items-center">
      {/* Navegación: arriba, en una píldora oscura para que se lea sobre cualquier fondo */}
      <div className="mb-3 flex items-center gap-1 rounded-full border border-sol-300/40 bg-noche-950/80 p-1 shadow-[0_0_20px_rgb(255_210_31/0.25)]">
        <button
          type="button"
          aria-label="Foto anterior"
          disabled={indice === 0}
          onClick={anterior}
          className="grid size-8 place-items-center rounded-full text-2xl leading-none text-sol-100 transition-colors hover:bg-sol-300/15 disabled:opacity-30"
        >
          ‹
        </button>
        <span className="min-w-16 text-center font-hand text-2xl font-semibold text-sol-100">
          {indice + 1} / {TOTAL}
        </span>
        <button
          type="button"
          aria-label="Foto siguiente"
          disabled={indice === TOTAL - 1}
          onClick={() => siguiente()}
          className="grid size-8 place-items-center rounded-full text-2xl leading-none text-sol-100 transition-colors hover:bg-sol-300/15 disabled:opacity-30"
        >
          ›
        </button>
      </div>

      {/* Pila */}
      <div className="relative h-[280px] w-[232px]">
        <AnimatePresence custom={direccion} initial={false}>
          {visibles.map((item, pos) => (
            <TarjetaRecuerdo
              key={claveDe(item)}
              item={item}
              posicion={pos}
              volteada={pos === 0 && volteada}
              pista={pos === 0 && pista}
              onVoltear={voltear}
              onSoltar={siguiente}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
