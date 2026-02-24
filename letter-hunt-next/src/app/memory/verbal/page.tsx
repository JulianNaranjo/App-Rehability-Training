'use client';

/**
 * Verbal Memory Game Page
 * 
 * Route: /memory/verbal
 * Verbal memory training game - Level 1
 * 
 * @module VerbalMemoryPage
 */

import { useEffect } from 'react';
import { VerbalMemoryGame } from '@/components/memory/verbal/VerbalMemoryGame';
import { useVerbalMemoryStore } from '@/store/verbal-memory-store';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function VerbalMemoryPage() {
  const { startGame } = useVerbalMemoryStore();

  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>

        <VerbalMemoryGame />
      </div>
    </div>
  );
}
