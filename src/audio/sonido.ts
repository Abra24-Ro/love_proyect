let ctx: AudioContext | undefined;
let master: GainNode | undefined;
let musica: HTMLAudioElement | undefined;
const buffers = new Map<string, AudioBuffer>();

let gananciaMusica: GainNode | undefined;
let volumenMusica = 0.5;
let silenciado = false;
const oyentesSilencio = new Set<(mudo: boolean) => void>();

function motor() {
  if (!ctx || !master) {
    ctx = new AudioContext();
    master = ctx.createGain(); // volumen general (para silenciar todo)
    master.connect(ctx.destination);
  }
  return { ctx, master };
}

// Descarga y decodifica los efectos antes de necesitarlos
export async function precargar(archivos: string[]) {
  const { ctx: c } = motor();
  await Promise.all(
    archivos.map(async (nombre) => {
      if (buffers.has(nombre)) return;
      try {
        const res = await fetch(`/audio/${nombre}`);
        const datos = await res.arrayBuffer();
        buffers.set(nombre, await c.decodeAudioData(datos));
      } catch {
        console.warn(`No se pudo cargar /audio/${nombre}`);
      }
    }),
  );
}

// Llamar dentro de un click: los navegadores lo exigen
export function desbloquear() {
  return motor().ctx.resume();
}

export function tocar(
  nombre: string,
  opciones: { retraso?: number; volumen?: number } = {},
) {
  const { retraso = 0, volumen = 1 } = opciones;
  const { ctx: c, master: m } = motor();
  const buffer = buffers.get(nombre);
  if (!buffer) return;

  const fuente = c.createBufferSource();
  const ganancia = c.createGain();
  fuente.buffer = buffer;
  ganancia.gain.value = volumen;
  fuente.connect(ganancia).connect(m);
  fuente.start(c.currentTime + retraso);
}

// Música con entrada suave (fade in de 3 s)
export function iniciarMusica(src: string, volumen = 0.5) {
  if (musica) return;
  const { ctx: c, master: m } = motor();

  musica = new Audio(src);
  musica.loop = true;

  const ganancia = c.createGain();

  gananciaMusica = ganancia;
  volumenMusica = volumen;

  ganancia.gain.setValueAtTime(0, c.currentTime);
  ganancia.gain.linearRampToValueAtTime(volumen, c.currentTime + 3);

  c.createMediaElementSource(musica).connect(ganancia).connect(m);
  void musica.play();
}

export function silenciar(mudo: boolean) {
  silenciado = mudo;
  const { ctx: c, master: m } = motor();
  m.gain.setTargetAtTime(mudo ? 0 : 1, c.currentTime, 0.05);
  oyentesSilencio.forEach((avisar) => avisar(mudo));
}

// Para que otros (la voz) se enteren del botón de silencio
export function suscribirSilencio(avisar: (mudo: boolean) => void) {
  oyentesSilencio.add(avisar);
  avisar(silenciado);
  return () => {
    oyentesSilencio.delete(avisar);
  };
}

// Baja la música mientras habla la voz y la devuelve después
export function atenuarMusica(atenuar: boolean) {
  if (!ctx || !gananciaMusica) return;
  const g = gananciaMusica.gain;
  g.cancelScheduledValues(ctx.currentTime);
  g.setValueAtTime(g.value, ctx.currentTime);
  g.linearRampToValueAtTime(
    atenuar ? volumenMusica * 0.15 : volumenMusica,
    ctx.currentTime + 0.8,
  );
}