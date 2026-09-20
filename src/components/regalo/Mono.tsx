import type { CSSProperties } from 'react'
import Prisma from './Prisma'

const ANILLO =
  'absolute inset-0 rounded-[50%] border-[9px] border-sol-50 shadow-[inset_0_0_10px_rgb(224_138_0/0.55)]'

function Oreja({ lado }: { lado: 1 | -1 }) {
  return (
    <div
      className="absolute"
      style={{
        width: 70,
        height: 46,
        left: lado * 36 - 35,
        top: -46,
        transformStyle: 'preserve-3d',
        transform: `rotateZ(${lado * 25}deg)`,
      }}
    >
      <div className={ANILLO} />
      <div className={ANILLO} style={{ transform: 'rotateY(90deg)' }} />
    </div>
  )
}

export default function Mono({ style }: { style?: CSSProperties }) {
  return (
    <div
      className="absolute"
      style={{ width: 0, height: 0, transformStyle: 'preserve-3d', ...style }}
    >
      <Oreja lado={-1} />
      <Oreja lado={1} />
      {/* Nudo central */}
      <Prisma
        w={30}
        h={24}
        d={30}
        caraClass="bg-linear-to-b from-sol-50 to-sol-200"
        style={{ left: -15, top: -22 }}
      />
    </div>
  )
}