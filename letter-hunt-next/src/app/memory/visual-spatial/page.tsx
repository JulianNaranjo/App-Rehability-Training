'use client';

import dynamic from 'next/dynamic';

const VisualSpatialMemoryGame = dynamic(
  () => import('@/components/memory/visual-spatial/VisualSpatialMemoryGame').then(m => m.VisualSpatialMemoryGame),
  { ssr: false, loading: () => <div className="flex justify-center p-12 text-text-secondary">Cargando...</div> }
);

/**
 * Visual-Spatial Memory Game Page
 * 
 * Route: /memory/visual-spatial
 * Visual-spatial memory training game
 * 
 * @module VisualSpatialMemoryPage
 */

export default function VisualSpatialMemoryPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <VisualSpatialMemoryGame />
    </div>
  );
}
