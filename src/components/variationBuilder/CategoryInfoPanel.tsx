import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { getCategoryById } from '../../utils/categories/extended';
import { getRelatedCategories } from '../../utils/pricing/scopeRecogniser';
import { formatCurrency } from '../../utils/helpers';

type Props = {
  categoryId: string;
  defaultOpen?: boolean;
};

/**
 * "What's inside this category?" — shows the prefilled stages, PC items,
 * inclusions, exclusions and auto/suggested related categories so the
 * builder knows exactly what they're getting before adding it.
 */
export function CategoryInfoPanel({ categoryId, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const cat = getCategoryById(categoryId);
  if (!cat) return null;

  const relations = getRelatedCategories(categoryId);
  const autoRelations = relations.filter(r => r.type === 'auto');
  const suggestedRelations = relations.filter(r => r.type === 'suggested');

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
      >
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-blue-500" />
          What's included in <span className="text-slate-900">{cat.label}</span>?
        </span>
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <div className="space-y-3 border-t border-slate-100 p-3 text-xs">
          {cat.questions.length > 0 && (
            <Section title={`Selections available (${cat.questions.length})`}>
              <div className="space-y-1 text-slate-700">
                {cat.questions.map((question) => (
                  <div key={question.id}>
                    <span className="font-medium">{question.label}:</span>{' '}
                    <span className="text-slate-500">
                      {question.options?.join(', ') || question.type}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Stages */}
          <Section title={`Stages (${cat.stages.length})`}>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500">
                  <th className="py-1 pr-2">Stage</th>
                  <th className="py-1 pr-2">Trade</th>
                  <th className="py-1 pr-2">Unit</th>
                  <th className="py-1 pr-2 text-right">Rate</th>
                </tr>
              </thead>
              <tbody>
                {cat.stages.map((s, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-1 pr-2 font-medium text-slate-900">{s.name}</td>
                    <td className="py-1 pr-2 text-slate-600">{s.trade}</td>
                    <td className="py-1 pr-2 text-slate-500">{s.unit}</td>
                    <td className="py-1 pr-2 text-right text-slate-700">{formatCurrency(s.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* PC Items */}
          {cat.pcItems.length > 0 && (
            <Section title={`Default PC items (${cat.pcItems.length})`}>
              <ul className="space-y-0.5">
                {cat.pcItems.map((p, i) => (
                  <li key={i} className="flex justify-between gap-2 text-slate-700">
                    <span>{p.description}</span>
                    <span className="text-slate-500">{formatCurrency(p.allowance)} {p.unit}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Inclusions / Exclusions */}
          {cat.inclusions.length > 0 && (
            <Section title={`Default inclusions (${cat.inclusions.length})`} accent="emerald">
              <ul className="list-disc space-y-0.5 pl-4 text-slate-700">
                {cat.inclusions.map((inc: string, i: number) => <li key={i}>{inc}</li>)}
              </ul>
            </Section>
          )}
          {cat.exclusions.length > 0 && (
            <Section title={`Default exclusions (${cat.exclusions.length})`} accent="red">
              <ul className="list-disc space-y-0.5 pl-4 text-slate-700">
                {cat.exclusions.map((exc: string, i: number) => <li key={i}>{exc}</li>)}
              </ul>
            </Section>
          )}

          {/* Related */}
          {(autoRelations.length > 0 || suggestedRelations.length > 0) && (
            <Section title="Related categories">
              {autoRelations.length > 0 && (
                <p className="text-slate-700">
                  <span className="font-medium text-blue-700">Auto-added:</span>{' '}
                  {autoRelations.map(r => getCategoryById(r.categoryId)?.label || r.categoryId).join(', ')}
                </p>
              )}
              {suggestedRelations.length > 0 && (
                <p className="mt-1 text-slate-700">
                  <span className="font-medium text-amber-700">Suggested:</span>{' '}
                  {suggestedRelations.map(r => getCategoryById(r.categoryId)?.label || r.categoryId).join(', ')}
                </p>
              )}
            </Section>
          )}

          <p className="rounded bg-slate-50 px-2 py-1 text-[11px] text-slate-500">
            All defaults can be edited in Step 2 (Details) after adding the scope.
          </p>
        </div>
      )}
    </div>
  );
}

function Section({ title, children, accent }: { title: string; children: React.ReactNode; accent?: 'emerald' | 'red' }) {
  const colour =
    accent === 'emerald' ? 'text-emerald-700' :
    accent === 'red' ? 'text-red-700' :
    'text-slate-700';
  return (
    <div>
      <h5 className={`mb-1 text-[11px] font-semibold uppercase tracking-wide ${colour}`}>{title}</h5>
      {children}
    </div>
  );
}
