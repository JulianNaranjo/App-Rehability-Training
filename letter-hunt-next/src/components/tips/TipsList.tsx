// src/components/tips/TipsList.tsx — presentational, props-only, no hooks

import { Card } from '@/components/ui/Card';
import { hasSteps } from '@/skills/tips/tips-data';
import type { Tip, TipsCategory } from '@/skills/tips/tips-data';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TipContent({ tip }: { tip: Tip }) {
  if (hasSteps(tip)) {
    return (
      <ol className="space-y-2 list-none p-0 mt-2">
        {tip.steps.map((s) => (
          <li key={s.step} className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold flex items-center justify-center">
              {s.step}
            </span>
            <span className="text-sm text-text-secondary leading-relaxed">{s.text}</span>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <p className="text-sm text-text-secondary leading-relaxed mt-2">{tip.body}</p>
  );
}

function TipCard({ tip }: { tip: Tip }) {
  return (
    <Card variant="default" padding="md" className="space-y-1">
      <h3 className="text-sm font-semibold text-text-primary">{tip.title}</h3>
      <TipContent tip={tip} />
    </Card>
  );
}

// ---------------------------------------------------------------------------
// TipsList
// ---------------------------------------------------------------------------

export interface TipsListProps {
  categories: TipsCategory[];
}

export function TipsList({ categories }: TipsListProps) {
  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <section key={category.id} className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary border-b border-border-standard pb-2">
            {category.title}
          </h2>
          <div className="space-y-3">
            {category.tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
