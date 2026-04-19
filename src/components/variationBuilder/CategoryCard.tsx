import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { getCategoryById } from '../../utils/categories/extended';
import { cn } from '../../utils/helpers';
import { CategoryInfoPanel } from './CategoryInfoPanel';

type Props = {
  categoryId: string;
  label?: string;
  confidence?: number;
  sourceLabel?: string;
  added: boolean;
  blockedReason?: string;
  onAdd: (categoryId: string) => void;
  onRemove?: (categoryId: string) => void;
};

export function CategoryCard({
  categoryId,
  label,
  confidence,
  sourceLabel,
  added,
  blockedReason,
  onAdd,
  onRemove,
}: Props) {
  const category = getCategoryById(categoryId);
  const displayLabel = label || category?.label || categoryId;
  const summary = category
    ? `${category.stages.length} stages · ${category.pcItems.length} PC items · ${category.inclusions.length} inclusions`
    : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{displayLabel}</p>
            {typeof confidence === 'number' && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                {Math.round(confidence * 100)}% match
              </span>
            )}
            {added && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> Added
              </span>
            )}
          </div>
          {sourceLabel && (
            <p className="mt-1 text-xs text-slate-500">Suggested from: {sourceLabel}</p>
          )}
          {summary && <p className="mt-1 text-xs text-slate-500">{summary}</p>}
          {blockedReason && (
            <p className="mt-1 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700">
              {blockedReason}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {added ? (
            onRemove && (
              <button
                type="button"
                onClick={() => onRemove(categoryId)}
                className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={() => onAdd(categoryId)}
              className={cn(
                'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white',
                blockedReason
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700',
              )}
              title={blockedReason || 'Add this category to the project'}
            >
              <Plus className="h-3.5 w-3.5" />
              {blockedReason ? 'Add Anyway' : 'Add to Project'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3">
        <CategoryInfoPanel categoryId={categoryId} />
      </div>
    </div>
  );
}
