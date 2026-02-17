'use client';

/**
 * Working Memory Game Page
 * 
 * Route: /memory/working
 * Working memory training game - Level 1
 * 
 * @module WorkingMemoryPage
 */

import { useEffect } from 'react';
import { WorkingMemoryGame } from '@/components/memory/WorkingMemoryGame';
import { useWorkingMemoryStore } from '@/store/working-memory-store';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function WorkingMemoryPage() {
  const { generateNewGame } = useWorkingMemoryStore();
  
  // Initialize game when component mounts
  useEffect(() => {
    generateNewGame();
  }, [generateNewGame]);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>
        
        {/* Game Component */}
        <WorkingMemoryGame />
      </div>
    </div>
  );
}
