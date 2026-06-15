'use client';

import dynamic from 'next/dynamic';

const VisoVerbalGame = dynamic(
  () => import('@/components/memory/visual-verbal/VisoVerbalGame').then(m => m.VisoVerbalGame),
  { ssr: false, loading: () => <div className="flex justify-center p-12 text-text-secondary">Cargando...</div> }
);

import { RequireAuth } from '@/components/auth/RequireAuth';

export default function VisualVerbalMemoryPage() {
  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <VisoVerbalGame />
      </div>
    </RequireAuth>
  );
}
