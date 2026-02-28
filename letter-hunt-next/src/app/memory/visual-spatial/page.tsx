'use client';

import { VisualSpatialMemoryGame } from '@/components/memory/visual-spatial/VisualSpatialMemoryGame';

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
