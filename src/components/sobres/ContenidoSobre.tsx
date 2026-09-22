import type { SobreId } from '../../data/sobres'
import EscenaFrasco from '../frasco/EscenaFrasco'
import EscenaGalaxia from '../galaxia/EscenaGalaxia'
import PilaRecuerdos from '../recuerdos/PilaRecuerdos'

interface Props {
  id: SobreId
  etiqueta: string
}

export default function ContenidoSobre({ id, etiqueta }: Props) {
  if (id === 'recuerdos') return <PilaRecuerdos />
  if (id === "frasco") return <EscenaFrasco />;
  if (id === "galaxia") return <EscenaGalaxia />;

  // Provisional hasta que construyamos los otros dos sobres
  return (
    <>
  
      <p className="font-script text-5xl text-tinta">{etiqueta}</p>
      <p className="mt-4 font-hand text-2xl leading-snug text-tinta/80">
        Aquí irá el contenido de este sobre ({id}).
      </p>
    </>
  )
}