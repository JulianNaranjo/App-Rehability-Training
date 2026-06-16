// src/components/tips/TipsModal.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { TipBody, TipSteps } from '@/skills/tips/tips-data';

import { TipsModal } from './TipsModal';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const bodyTip: TipBody = {
  id: 'sueno-01',
  title: 'Duerme adecuadamente',
  body: 'Dormir adecuadamente es fundamental para el funcionamiento cerebral.',
};

const stepsTip: TipSteps = {
  id: 'atencion-autoinstruccion',
  title: 'Técnica de autoinstrucción verbal',
  steps: [
    { step: 1, text: 'Lee atentamente la instrucción.' },
    { step: 2, text: 'Estructura la actividad.' },
  ],
};

const noop = () => {};

beforeEach(() => {
  // createPortal needs document.body in jsdom
  document.body.innerHTML = '';
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('TipsModal', () => {
  describe('rendering — body-shaped tip', () => {
    it('renders the tip title', () => {
      render(<TipsModal tip={bodyTip} onDismiss={noop} onSeeAll={noop} />);
      expect(screen.getByText('Duerme adecuadamente')).toBeInTheDocument();
    });

    it('renders the body as a paragraph', () => {
      render(<TipsModal tip={bodyTip} onDismiss={noop} onSeeAll={noop} />);
      expect(screen.getByText(/Dormir adecuadamente es fundamental/)).toBeInTheDocument();
    });

    it('does NOT render an ordered list for a body tip', () => {
      render(<TipsModal tip={bodyTip} onDismiss={noop} onSeeAll={noop} />);
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });

  describe('rendering — steps-shaped tip', () => {
    it('renders the tip title', () => {
      render(<TipsModal tip={stepsTip} onDismiss={noop} onSeeAll={noop} />);
      expect(screen.getByText('Técnica de autoinstrucción verbal')).toBeInTheDocument();
    });

    it('renders steps as an ordered list', () => {
      render(<TipsModal tip={stepsTip} onDismiss={noop} onSeeAll={noop} />);
      expect(screen.getByRole('list')).toBeInTheDocument();
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(2);
    });

    it('renders each step text', () => {
      render(<TipsModal tip={stepsTip} onDismiss={noop} onSeeAll={noop} />);
      expect(screen.getByText('Lee atentamente la instrucción.')).toBeInTheDocument();
      expect(screen.getByText('Estructura la actividad.')).toBeInTheDocument();
    });

    it('does NOT render a paragraph body for a steps tip', () => {
      render(<TipsModal tip={stepsTip} onDismiss={noop} onSeeAll={noop} />);
      // body content should not appear
      expect(screen.queryByText(/Dormir adecuadamente/)).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has role="dialog" on the modal panel', () => {
      render(<TipsModal tip={bodyTip} onDismiss={noop} onSeeAll={noop} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal="true"', () => {
      render(<TipsModal tip={bodyTip} onDismiss={noop} onSeeAll={noop} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('is labelled by the tip title', () => {
      render(<TipsModal tip={bodyTip} onDismiss={noop} onSeeAll={noop} />);
      const dialog = screen.getByRole('dialog');
      const labelId = dialog.getAttribute('aria-labelledby');
      expect(labelId).toBeTruthy();
      const labelEl = document.getElementById(labelId!);
      expect(labelEl?.textContent).toContain('Duerme adecuadamente');
    });
  });

  describe('user interactions', () => {
    it('calls onDismiss when the Cerrar button is clicked', async () => {
      const onDismiss = vi.fn();
      const user = userEvent.setup();
      render(<TipsModal tip={bodyTip} onDismiss={onDismiss} onSeeAll={noop} />);

      await user.click(screen.getByRole('button', { name: /cerrar/i }));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('calls onSeeAll when "Ver todos los consejos" is clicked', async () => {
      const onSeeAll = vi.fn();
      const user = userEvent.setup();
      render(<TipsModal tip={bodyTip} onDismiss={noop} onSeeAll={onSeeAll} />);

      await user.click(screen.getByRole('button', { name: /ver todos los consejos/i }));
      expect(onSeeAll).toHaveBeenCalledTimes(1);
    });

    it('calls onDismiss when Escape key is pressed', async () => {
      const onDismiss = vi.fn();
      const user = userEvent.setup();
      render(<TipsModal tip={bodyTip} onDismiss={onDismiss} onSeeAll={noop} />);

      await user.keyboard('{Escape}');
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('calls onDismiss when the backdrop is clicked', async () => {
      const onDismiss = vi.fn();
      const user = userEvent.setup();
      render(<TipsModal tip={bodyTip} onDismiss={onDismiss} onSeeAll={noop} />);

      // The backdrop is the outermost div (fixed overlay)
      const backdrop = document.querySelector('[data-testid="tips-modal-backdrop"]');
      expect(backdrop).toBeTruthy();
      await user.click(backdrop!);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });
});
