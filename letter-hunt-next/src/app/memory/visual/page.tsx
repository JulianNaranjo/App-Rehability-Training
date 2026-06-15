'use client';

import dynamic from 'next/dynamic';

const VisualMemoryGame = dynamic(
  () => import('@/components/memory/visual/VisualMemoryGame').then(m => m.VisualMemoryGame),
  { ssr: false, loading: () => <div className="flex justify-center p-12 text-text-secondary">Cargando...</div> }
);

import { RequireAuth } from '@/components/auth/RequireAuth';

export default function VisualMemoryPage() {
  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <VisualMemoryGame />
      </div>
    </RequireAuth>
  );
}
