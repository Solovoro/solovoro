'use client';

import { ReactNode } from 'react';

export default function PreviewProvider({ children }: { children: ReactNode }) {
  // Preview disabled: pass-through provider
  return <>{children}</>;
}


