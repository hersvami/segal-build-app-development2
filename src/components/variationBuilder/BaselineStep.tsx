import { Building, Maximize2, Truck, Info } from 'lucide-react';
import type { ProjectBaseline } from '../../types/domain';
import { calcBaselineAdjustment } from '../../utils/pricing/baselineMultipliers';
import { formatCurrency } from '../../utils/helpers';

type Props = {
  baseline: ProjectBaseline;
  setBaseline: (next: ProjectBaseline) => void;
  /** Current rough trade cost so we can preview the access surcharge */
  previewTradeCost?: number;
};

const STOREY_OPTIONS: Array<{ value: ProjectBaseline['storeys']; label: string; hint: string }> = [
  { value: 'single', label: 'Single Storey', hint: 'No scaffolding required' },
  { value: 'double', label: 'Double Storey', hint: 'Scaffolding & roof edge protection auto-added' },
  { value: 'multi',  label: '3+ Storeys',    hint: 'Engineered scaffolding system added' },
];

const ACCESS_OPTIONS: Array<{ value: ProjectBaseline['siteAccess']; label: string; hint: string }> = [
  { value: 'easy',     label: 'Easy',     hint: 'Open driveway, machinery access, plenty of room' },
  { value: 'moderate', label: 'Moderate', hint: 'Some restrictions, +7.5% labour adjustment' },
  { value: 'tight',    label: 'Tight',    hint: 'Hand-carry, restricted access, +15% labour' },
];

export function BaselineStep({ baseline, setBaseline, previewTradeCost = 0 }: Props) {
  const adjustment = calcBaselineAdjustment(baseline, previewTradeCost);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div className="space-y-1">
            <h3 className="font-semibold text-blue-900">Project Baseline</h3>
            <p className="text-sm text-blue-700">
              These global variables drive accurate pricing. Scaffolding is auto-added for
              multi-storey work, and site access automatically adjusts labour costs.
            </p>
          </div>
        </div>
      </div>

      {/* Total area */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Maximize2 className="h-4 w-4" />
          Total Project Floor Area (m²)
        </label>
        <input
          type="number"
          min={0}
          value={baseline.totalAreaM2 || ''}
          onChange={(e) => setBaseline({ ...baseline, totalAreaM2: Number(e.target.value) || 0 })}
          placeholder="e.g. 180"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <p className="text-xs text-slate-500">
          Total area being worked on across the project — used for scaffolding and site-wide allowances.
        </p>
      </div>

      {/* Storeys */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Building className="h-4 w-4" />
          Number of Storeys
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {STOREY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setBaseline({ ...baseline, storeys: opt.value })}
              className={
                'rounded-lg border p-3 text-left transition-colors ' +
                (baseline.storeys === opt.value
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white hover:border-blue-300')
              }
            >
              <div className="font-medium text-slate-900">{opt.label}</div>
              <div className="mt-1 text-xs text-slate-500">{opt.hint}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Site access */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Truck className="h-4 w-4" />
          Site Access
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {ACCESS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setBaseline({ ...baseline, siteAccess: opt.value })}
              className={
                'rounded-lg border p-3 text-left transition-colors ' +
                (baseline.siteAccess === opt.value
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white hover:border-blue-300')
              }
            >
              <div className="font-medium text-slate-900">{opt.label}</div>
              <div className="mt-1 text-xs text-slate-500">{opt.hint}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Site Notes (optional)</label>
        <textarea
          value={baseline.notes || ''}
          onChange={(e) => setBaseline({ ...baseline, notes: e.target.value })}
          placeholder="e.g. Heritage overlay, neighbour considerations, working hours…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          rows={3}
        />
      </div>

      {/* Live adjustment preview */}
      {(adjustment.scaffoldingCost > 0 || adjustment.accessSurcharge > 0) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h4 className="mb-2 font-semibold text-amber-900">Auto-Applied Adjustments</h4>
          <ul className="space-y-1 text-sm text-amber-800">
            {adjustment.scaffoldingCost > 0 && (
              <li className="flex justify-between">
                <span>Scaffolding & safety</span>
                <span className="font-medium">{formatCurrency(adjustment.scaffoldingCost)}</span>
              </li>
            )}
            {adjustment.accessSurcharge > 0 && (
              <li className="flex justify-between">
                <span>Site access labour surcharge</span>
                <span className="font-medium">{formatCurrency(adjustment.accessSurcharge)}</span>
              </li>
            )}
            <li className="flex justify-between border-t border-amber-300 pt-1 font-semibold">
              <span>Total baseline adjustment</span>
              <span>{formatCurrency(adjustment.totalAdjustment)}</span>
            </li>
          </ul>
          <p className="mt-2 text-xs text-amber-700">
            These will be added to the trade cost and shown as a separate "Site Conditions" line in the BoQ.
          </p>
        </div>
      )}
    </div>
  );
}
