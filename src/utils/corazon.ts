export interface PuntoCorazon {
  x: number;
  y: number;
}

// Ecuación paramétrica del corazón, t en [0, 2π)
function punto(t: number): PuntoCorazon {
  const x = 16 * Math.sin(t) ** 3;
  const y = -(
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  );
  return { x, y };
}

// Genera n puntos repartidos uniformemente por el contorno (no por ángulo,
// porque el corazón no es circular y con ángulos parejos se amontonan en las puntas)
export function puntosCorazon(n: number, escala: number): PuntoCorazon[] {
  const MUESTRAS = 500;
  const DESFASE = 0.15; // evita empezar justo en el pico superior (cúspide)
  const curva = Array.from({ length: MUESTRAS }, (_, i) =>
    punto(DESFASE + (i / MUESTRAS) * Math.PI * 2),
  );

  const longitudes: number[] = [0];
  for (let i = 1; i < curva.length; i++) {
    const dx = curva[i].x - curva[i - 1].x;
    const dy = curva[i].y - curva[i - 1].y;
    longitudes.push(longitudes[i - 1] + Math.hypot(dx, dy));
  }
  const total = longitudes[longitudes.length - 1];

  const resultado: PuntoCorazon[] = [];
  for (let k = 0; k < n; k++) {
    const objetivo = (k / n) * total;
    let i = 0;
    while (i < longitudes.length - 1 && longitudes[i] < objetivo) i++;
    const p = curva[i];
    resultado.push({ x: p.x * escala, y: p.y * escala });
  }
  return resultado;
}
