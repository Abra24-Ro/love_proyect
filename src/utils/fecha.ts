const formato = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC", // sin esto, en Perú (UTC-5) "2026-07-11" saldría como "10 de julio"
});

export function formatearFecha(iso: string): string {
  return formato.format(new Date(iso));
}