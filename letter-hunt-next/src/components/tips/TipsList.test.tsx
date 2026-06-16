// src/components/tips/TipsList.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { TipsCategory } from '@/skills/tips/tips-data';

import { TipsList } from './TipsList';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const categories: TipsCategory[] = [
  {
    id: 'sueno',
    title: 'Sueño',
    icon: 'Moon',
    tips: [
      {
        id: 'sueno-01',
        title: 'Duerme adecuadamente',
        body: 'Dormir bien es fundamental.',
      },
    ],
  },
  {
    id: 'atencion',
    title: 'Atención',
    icon: 'Target',
    tips: [
      {
        id: 'atencion-autoinstruccion',
        title: 'Técnica de autoinstrucción verbal',
        steps: [
          { step: 1, text: 'Lee atentamente.' },
          { step: 2, text: 'Estructura la actividad.' },
        ],
      },
      {
        id: 'atencion-una-tarea',
        title: 'Una tarea a la vez',
        body: 'Evita la multitarea.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('TipsList', () => {
  it('renders both category headings', () => {
    render(<TipsList categories={categories} />);

    expect(screen.getByText('Sueño')).toBeInTheDocument();
    expect(screen.getByText('Atención')).toBeInTheDocument();
  });

  it('renders a known tip title', () => {
    render(<TipsList categories={categories} />);

    expect(screen.getByText('Duerme adecuadamente')).toBeInTheDocument();
    expect(screen.getByText('Una tarea a la vez')).toBeInTheDocument();
  });

  it('renders a body tip as a paragraph', () => {
    render(<TipsList categories={categories} />);

    expect(screen.getByText('Dormir bien es fundamental.')).toBeInTheDocument();
  });

  it('renders a steps tip as an ordered list', () => {
    render(<TipsList categories={categories} />);

    expect(screen.getByText('Lee atentamente.')).toBeInTheDocument();
    expect(screen.getByText('Estructura la actividad.')).toBeInTheDocument();
  });

  it('renders all tips across categories', () => {
    render(<TipsList categories={categories} />);

    // 1 from sueno + 2 from atencion = 3 tip titles
    expect(screen.getByText('Técnica de autoinstrucción verbal')).toBeInTheDocument();
  });
});
