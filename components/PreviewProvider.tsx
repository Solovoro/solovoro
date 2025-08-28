'use client'
import type { ReactNode } from 'react'

type Props = { children: ReactNode }

export default function PreviewProvider({ children }: Props) {
  // keep it dead-simple to satisfy the compiler
  return <div>{children}</div>
}
