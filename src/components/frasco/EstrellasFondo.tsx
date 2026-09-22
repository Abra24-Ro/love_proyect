const ESTRELLAS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  izquierda: ((i * 37 + 11) % 96) + 2, // %
  arriba: ((i * 53 + 7) % 90) + 4, // %
  tam: 2 + (i % 3),
  espera: (i % 7) * 0.45,
  duracion: 2.4 + (i % 4) * 0.6,
}));

export default function EstrellasFondo() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {ESTRELLAS.map((e) => (
        <span
          key={e.id}
          className="absolute animate-twinkle rounded-full bg-sol-200"
          style={{
            left: `${e.izquierda}%`,
            top: `${e.arriba}%`,
            width: e.tam,
            height: e.tam,
            animationDelay: `${e.espera}s`,
            animationDuration: `${e.duracion}s`,
            boxShadow: "0 0 6px 1px rgb(255 225 77 / 0.8)",
          }}
        />
      ))}
    </div>
  );
}