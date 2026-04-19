import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { QuoteScope } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';
import { calcScopeTotal } from '../../utils/pricing/engine';
import { CategoryInfoPanel } from './CategoryInfoPanel';

type Props = {
  scopes: QuoteScope[];
  onRemoveScope: (categoryId: string) => void;
};

export function AddedScopesPanel({ scopes, onRemoveScope }: Props) {
  const [showDetails, setShowDetails] = useState(true);
  if (scopes.length === 0) return null;

  const totalEstimate = scopes.reduce((sum, scope) => sum + calcScopeTotal(scope), 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Added Scopes ({scopes.length})</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-blue-600">
            Est. Trade Cost: {formatCurrency(totalEstimate)}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          >
            {showDetails ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showDetails ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {scopes.map((scope, index) => (
        <div key={scope.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center gap-3 bg-slate-50 p-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">{scope.categoryLabel}</p>
              <p className="text-xs text-slate-500">{scope.description || 'No description yet'}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemoveScope(scope.categoryId)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Remove scope"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {showDetails && (
            <div className="space-y-3 border-t border-slate-100 p-3">
              <div className="text-xs text-slate-500">
                Dimensions: {scope.dimensions.width}m × {scope.dimensions.length}m × {scope.dimensions.height}m
              </div>
              <div className="text-xs text-slate-500">
                {scope.stages.length} stages · {scope.pcItems.length} PC items · {scope.inclusions.length} inclusions · {scope.exclusions.length} exclusions
              </div>
              <CategoryInfoPanel categoryId={scope.categoryId} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
