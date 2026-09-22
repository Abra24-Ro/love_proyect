import { MENSAJE_DE_VOZ, TOTAL_PETALOS } from "../../data/frasco";
import { useMensajeDeVoz, type EstadoVoz } from "../../hooks/useMensajeDeVoz";
import EstrellasFondo from "./EstrellasFondo";
import Frasco, { type ModoFrasco } from "./Frasco";
import Petalos from "./Petalos";

const ETIQUETA: Record<EstadoVoz, string> = {
  listo: "Escuchar",
  reproduciendo: "Pausar",
  pausado: "Continuar",
  terminado: "Escuchar otra vez",
  error: "Sin audio",
};

function modoDe(estado: EstadoVoz): ModoFrasco {
  if (estado === "reproduciendo") return "escuchando";
  if (estado === "terminado") return "final";
  return "reposo";
}

export default function EscenaFrasco() {
  const { estado, progreso, ronda, alternar } =
    useMensajeDeVoz(MENSAJE_DE_VOZ);

  // Un pétalo nuevo cada 1/12 del audio; al terminar ya cayeron todos
  const caidos = Math.ceil(progreso * TOTAL_PETALOS);

  return (
    <div className="relative h-[340px] w-[280px]">
      <EstrellasFondo />

      <div className="absolute left-1/2 top-3 -translate-x-1/2">
        <Frasco modo={modoDe(estado)}>
          <Petalos cantidad={caidos} ronda={ronda} />
        </Frasco>
      </div>

      <div className="absolute inset-x-0 bottom-3 flex flex-col items-center gap-3">
        <button
          type="button"
          disabled={estado === "error"}
          onClick={alternar}
          className="btn-glow min-w-[210px] whitespace-nowrap disabled:opacity-50"
        >
          {ETIQUETA[estado]}
        </button>

        <div className="flex h-5 items-center">
          {estado === "listo" && (
            <p className="font-hand text-lg text-sol-200/70">
              sube un poco el volumen
            </p>
          )}
          {estado === "error" && (
            <p className="font-hand text-lg text-sol-200/70">
              el audio no se pudo cargar
            </p>
          )}
          {estado !== "listo" && estado !== "error" && (
            <div className="h-1 w-36 overflow-hidden rounded-full bg-sol-300/20">
              <div
                className="h-full rounded-full bg-sol-300 shadow-[0_0_8px_rgb(255_210_31/0.8)] transition-[width] duration-300 ease-linear"
                style={{ width: `${progreso * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}