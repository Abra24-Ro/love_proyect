let ctx: AudioContext | undefined
let master: GainNode | undefined
let musica: HTMLAudioElement | undefined
const buffers = new Map<string, AudioBuffer>()

function motor() {
  if (!ctx || !master) {
    ctx = new AudioContext()
    master = ctx.createGain() // volumen general (para silenciar todo)
    master.connect(ctx.destination)
  }
  return { ctx, master }
}

// Descarga y decodifica los efectos antes de necesitarlos
export async function precargar(archivos: string[]) {
  const { ctx: c } = motor()
  await Promise.all(
    archivos.map(async (nombre) => {
      if (buffers.has(nombre)) return
      try {
        const res = await fetch(`/audio/${nombre}`)
        const datos = await res.arrayBuffer()
        buffers.set(nombre, await c.decodeAudioData(datos))
      } catch {
        console.warn(`No se pudo cargar /audio/${nombre}`)
      }
    }),
  )
}

// Llamar dentro de un click: los navegadores lo exigen
export function desbloquear() {
  return motor().ctx.resume()
}

export function tocar(nombre: string, opciones: { retraso?: number; volumen?: number } = {}) {
  const { retraso = 0, volumen = 1 } = opciones
  const { ctx: c, master: m } = motor()
  const buffer = buffers.get(nombre)
  if (!buffer) return

  const fuente = c.createBufferSource()
  const ganancia = c.createGain()
  fuente.buffer = buffer
  ganancia.gain.value = volumen
  fuente.connect(ganancia).connect(m)
  fuente.start(c.currentTime + retraso)
}

// Música con entrada suave (fade in de 3 s)
export function iniciarMusica(src: string, volumen = 0.5) {
  if (musica) return
  const { ctx: c, master: m } = motor()

  musica = new Audio(src)
  musica.loop = true

  const ganancia = c.createGain()
  ganancia.gain.setValueAtTime(0, c.currentTime)
  ganancia.gain.linearRampToValueAtTime(volumen, c.currentTime + 3)

  c.createMediaElementSource(musica).connect(ganancia).connect(m)
  void musica.play()
}

export function silenciar(mudo: boolean) {
  const { ctx: c, master: m } = motor()
  m.gain.setTargetAtTime(mudo ? 0 : 1, c.currentTime, 0.05)
}