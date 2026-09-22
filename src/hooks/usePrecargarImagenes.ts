import { useEffect } from 'react'

export function usePrecargarImagenes(urls: string[]) {
  const clave = urls.join('|')

  useEffect(() => {
    if (!clave) return
    for (const url of clave.split('|')) {
      const img = new Image()
      img.src = url
    }
  }, [clave])
}