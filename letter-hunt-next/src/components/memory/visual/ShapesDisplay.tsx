'use client';

import { VisualShape } from '@/types/visual-memory';
import { cn } from '@/lib/utils';

interface ShapesDisplayProps {
  shapes: VisualShape[];
  className?: string;
}

function HappyFace({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill={color} stroke="#B8860B" strokeWidth="2" />
      <circle cx="35" cy="40" r="6" fill="#333" />
      <circle cx="65" cy="40" r="6" fill="#333" />
      <path d="M 30 60 Q 50 80 70 60" stroke="#333" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Lightning({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path
        d="M 55 5 L 30 50 L 50 50 L 40 95 L 70 45 L 50 45 Z"
        fill={color}
        stroke="#B8860B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="5" y="35" width="60" height="30" fill={color} rx="3" />
      <polygon points="65,20 95,50 65,80" fill={color} />
    </svg>
  );
}

function Heart({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path
        d="M 50 90 C 20 70 5 50 5 30 C 5 15 20 5 35 5 C 45 5 50 15 50 15 C 50 15 55 5 65 5 C 80 5 95 15 95 30 C 95 50 80 70 50 90 Z"
        fill={color}
        stroke="#B91C1C"
        strokeWidth="2"
      />
    </svg>
  );
}

function Triangle({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon
        points="50,10 90,90 10,90"
        fill={color}
        stroke="#15803D"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Diamond({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon
        points="50,5 95,50 50,95 5,50"
        fill={color}
        stroke="#7C3AED"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Crescent({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path
        d="M 60 15 A 38 38 0 1 1 60 85 A 28 28 0 1 0 60 15 Z"
        fill={color}
        stroke="#4B5563"
        strokeWidth="2"
      />
    </svg>
  );
}

function CircleX({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="40" fill={color} stroke="#C2410C" strokeWidth="2" />
      <line x1="25" y1="25" x2="75" y2="75" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <line x1="75" y1="25" x2="25" y2="75" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function Pentagon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon
        points="50,5 95,38 77,92 23,92 5,38"
        fill={color}
        stroke="#0891B2"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const shapeComponents: Record<string, React.ComponentType<{ color: string }>> = {
  'happy-face': HappyFace,
  'lightning': Lightning,
  'arrow-right': ArrowRight,
  'heart': Heart,
  'triangle': Triangle,
  'diamond': Diamond,
  'crescent': Crescent,
  'circle-x': CircleX,
  'pentagon': Pentagon,
};

export function ShapesDisplay({ shapes, className }: ShapesDisplayProps) {
  return (
    <div className={cn('grid grid-cols-3 gap-4', className)}>
      {shapes.map((shape) => {
        const ShapeComponent = shapeComponents[shape.id];
        return (
          <div
            key={shape.id}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-border-soft shadow-sm"
          >
            <div className="w-24 h-24">
              {ShapeComponent ? (
                <ShapeComponent color={shape.color} />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">?</span>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-text-secondary text-center">
              {shape.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
