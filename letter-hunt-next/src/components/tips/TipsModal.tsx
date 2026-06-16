'use client';

// src/components/tips/TipsModal.tsx

import { Lightbulb, Moon, Target } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { hasSteps } from '@/skills/tips/tips-data';
import type { Tip } from '@/skills/tips/tips-data';

// ---------------------------------------------------------------------------
// Icon allow-list map — NO dynamic namespace indexing
// ---------------------------------------------------------------------------
const ICON_MAP = {
  Moon: <Moon className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Lightbulb: <Lightbulb className="w-5 h-5" />,
} as const;

type IconName = keyof typeof ICON_MAP;

function TipIcon({ name }: { name: string }) {
  const icon = ICON_MAP[name as IconName];
  if (!icon) return <Lightbulb className="w-5 h-5" />;
  return icon;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface TipsModalProps {
  tip: Tip;
  onDismiss: () => void;
  onSeeAll: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function TipsModal({ tip, onDismiss, onSeeAll }: TipsModalProps) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const primaryBtnRef = useRef<HTMLButtonElement>(null);

  // Only portal after mount — eliminates SSR/hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape key handler
  useEffect(() => {
    if (!mounted) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismiss();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mounted, onDismiss]);

  // Focus primary button on open
  useEffect(() => {
    if (mounted) {
      primaryBtnRef.current?.focus();
    }
  }, [mounted]);

  if (!mounted) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      data-testid="tips-modal-backdrop"
      onClick={(e) => {
        // Dismiss only when clicking the backdrop itself, not the card
        if (e.target === e.currentTarget) onDismiss();
      }}
    >
      <Card
        variant="glass"
        padding="lg"
        className="w-full max-w-md relative"
      >
        {/* Dialog semantics */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="flex flex-col gap-5"
        >
          {/* Header */}
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 p-2 rounded-lg bg-primary-50 text-primary-600">
              <TipIcon name="Lightbulb" />
            </span>
            <h2
              id={titleId}
              className="text-lg font-semibold text-text-primary leading-snug"
            >
              {tip.title}
            </h2>
          </div>

          {/* Body */}
          <div className="text-text-secondary">
            {hasSteps(tip) ? (
              <ol className="space-y-3 list-none p-0">
                {tip.steps.map((s) => (
                  <li key={s.step} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold flex items-center justify-center">
                      {s.step}
                    </span>
                    <span className="text-sm leading-relaxed">{s.text}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm leading-relaxed">{tip.body}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={onDismiss} className="sm:order-1">
              Cerrar
            </Button>
            <Button
              ref={primaryBtnRef}
              variant="primary"
              size="sm"
              onClick={onSeeAll}
              className="flex-1 sm:order-2"
            >
              Ver todos los consejos
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return createPortal(content, document.body);
}
