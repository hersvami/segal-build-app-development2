import type { QuoteScope, QuotePricing } from '../../types/domain';
import { cn, formatCurrency } from '../../utils/helpers';

type Props = {
  scopes: QuoteScope[];
  pricing: QuotePricing;
  ohPct: number;
  profitPct: number;
  contingencyPct: number;
};

export function ReviewStep({ scopes, pricing, ohPct, profitPct, contingencyPct }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 p-6">
        <h3 className="mb-4 text-lg font-bold">Pricing Summary</h3>
        <div className="space-y-2 text-sm">
          <PriceRow label="Trade Cost" value={pricing.tradeCost} strong />
          <PriceRow label={`Overhead (${ohPct}%)`} value={pricing.overhead} />
          <PriceRow label={`Profit (${profitPct}%)`} value={pricing.profit} />
          <PriceRow label={`Contingency (${contingencyPct}%)`} value={pricing.contingency} />
          <PriceRow label="Subtotal" value={pricing.clientTotal} strong bordered />
          <PriceRow label="GST (10%)" value={pricing.gst} />
          <PriceRow label="Total Inc GST" value={pricing.totalIncGst} strong bordered big />
        </div>
      </div>

      {scopes.map((scope, index) => (
        <div key={scope.id} className="rounded-xl border p-4">
          <h4 className="flex items-center gap-2 font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
              {index + 1}
            </span>
            {scope.categoryLabel}
          </h4>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-500">{scope.description}</p>
          <p className="mt-1 text-sm text-slate-500">
            Dimensions: {scope.dimensions.width}m x {scope.dimensions.length}m x {scope.dimensions.height}m
          </p>
          <p className="mt-2 text-sm text-slate-500">{scope.stages.length} stages</p>
        </div>
      ))}
    </div>
  );
}

function PriceRow({
  label,
  value,
  strong,
  bordered,
  big,
}: {
  label: string;
  value: number;
  strong?: boolean;
  bordered?: boolean;
  big?: boolean;
}) {
  return (
    <div className={cn('flex justify-between', bordered && 'border-t pt-2', strong && 'font-medium', big && 'text-lg font-bold text-blue-600')}>
      <span>{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}
