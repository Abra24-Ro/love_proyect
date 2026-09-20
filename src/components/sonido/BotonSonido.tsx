import { useState } from "react";
import { silenciar } from "../../audio";
import { Volume2, VolumeOff } from "lucide-react";

export default function BotonSonido() {
  const [mudo, setMudo] = useState(false);

  function alternar() {
    silenciar(!mudo);
    setMudo(!mudo);
  }

  return (
    <button
      onClick={alternar}
      aria-label={mudo ? "Activar sonido" : "Silenciar"}
      className="fixed right-4 z-50 rounded-full border border-sol-300/40 bg-noche-900/60 px-3 py-2 text-lg backdrop-blur-sm"
      style={{ top: "max(1rem, env(safe-area-inset-top))" }}
    >
      {mudo ? (
        <VolumeOff className="ml-1 inline h-5 w-5" />
      ) : (
        <Volume2 className="ml-1 inline h-5 w-5" />
      )}
    </button>
  );
}
