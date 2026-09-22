import { FLORES } from "../../data/galaxia";
import { useGalaxiaStore } from "../../store/useGalaxiaStore";

export default function ContadorFlores() {
  const cantidad = useGalaxiaStore((s) => s.leidas.length);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-[200] flex justify-center"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <span className="rounded-full border border-sol-300/30 bg-noche-950/60 px-4 py-1 font-hand text-lg text-sol-200/80">
        {cantidad} de {FLORES.length} descubiertas
      </span>
    </div>
  );
}