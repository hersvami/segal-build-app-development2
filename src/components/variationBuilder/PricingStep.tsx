import type { QuoteScope } from '../../types/domain';
import { PCItemEditor } from './Editors';

type Props = {
  scopes: QuoteScope[];
  setScopes: React.Dispatch<React.SetStateAction<QuoteScope[]>>;
  ohPct: number;
  setOhPct: (next: number) => void;
  profitPct: number;
  setProfitPct: (next: number) => void;
  contingencyPct: number;
  setContingencyPct: (next: number) => void;
};

export function PricingStep({
  scopes,
  setScopes,
  ohPct,
  setOhPct,
  profitPct,
  setProfitPct,
  contingencyPct,
  setContingencyPct,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <PercentInput label="Overhead %" value={ohPct} onChange={setOhPct} />
        <PercentInput label="Profit %" value={profitPct} onChange={setProfitPct} />
        <PercentInput label="Contingency %" value={contingencyPct} onChange={setContingencyPct} />
      </div>
      {scopes.map((scope, scopeIndex) => (
        <div key={scope.id} className="rounded-xl border p-4">
          <h3 className="mb-3 font-semibold">{scope.categoryLabel}</h3>
          <PCItemEditor
            items={scope.pcItems}
            onChange={(items) => setScopes((prev) => prev.map((s, i) => (i === scopeIndex ? { ...s, pcItems: items } : s)))}
          />
        </div>
      ))}
    </div>
  );
}

function PercentInput({ label, value, onChange }: { label: string; value: number; onChange: (next: number) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full rounded-lg border px-3 py-2" />
    </div>
  );
}
