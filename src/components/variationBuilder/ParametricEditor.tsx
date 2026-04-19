import { useState } from 'react';
import { Plus, Trash2, Zap } from 'lucide-react';
import type { ParametricItem } from '../../types/domain';
import { getUnitsForCategory, getUnitById } from '../../utils/pricing/parametricUnits';
import { generateId, formatCurrency } from '../../utils/helpers';

type Props = {
  categoryId: string;
  items: ParametricItem[];
  onChange: (items: ParametricItem[]) => void;
};

export function ParametricEditor({ categoryId, items, onChange }: Props) {
  const available = getUnitsForCategory(categoryId);
  const [pickerOpen, setPickerOpen] = useState(false);

  if (available.length === 0) return null;

  const total = items.reduce((sum, it) => sum + (it.rate * it.quantity), 0);

  const addUnit = (unitId: string) => {
    const unit = getUnitById(unitId);
    if (!unit) return;
    const newItem: ParametricItem = {
      id: generateId(),
      unitId: unit.id,
      label: unit.label,
      unit: unit.unit,
      rate: unit.rate,
      quantity: unit.defaultQty ?? 1,
    };
    onChange([...items, newItem]);
    setPickerOpen(false);
  };

  const updateQty = (id: string, qty: number) => {
    onChange(items.map((it) => (it.id === id ? { ...it, quantity: Math.max(0, qty) } : it)));
  };

  const updateRate = (id: string, rate: number) => {
    onChange(items.map((it) => (it.id === id ? { ...it, rate: Math.max(0, rate) } : it)));
  };

  const remove = (id: string) => {
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold text-purple-900">
          <Zap className="h-4 w-4" />
          Bill of Quantities (Unit Pricing)
        </h4>
        <span className="text-sm font-medium text-purple-700">
          {items.length} item{items.length === 1 ? '' : 's'} · {formatCurrency(total)}
        </span>
      </div>

      {items.length === 0 && (
        <p className="mb-3 text-sm text-purple-700/80">
          Add unit-priced items (per point / per metre / per item) for parametric pricing.
        </p>
      )}

      {items.length > 0 && (
        <div className="mb-3 overflow-hidden rounded-lg border border-purple-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-purple-100/60 text-xs uppercase text-purple-800">
              <tr>
                <th className="px-3 py-2 text-left">Item</th>
                <th className="px-2 py-2 text-right">Rate</th>
                <th className="px-2 py-2 text-center">Unit</th>
                <th className="px-2 py-2 text-center">Qty</th>
                <th className="px-2 py-2 text-right">Subtotal</th>
                <th className="w-8 px-1 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-purple-100">
                  <td className="px-3 py-2 text-slate-800">{it.label}</td>
                  <td className="px-2 py-2 text-right">
                    <input
                      type="number"
                      min={0}
                      value={it.rate}
                      onChange={(e) => updateRate(it.id, Number(e.target.value))}
                      className="w-20 rounded border border-purple-200 px-2 py-1 text-right text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 text-center text-xs text-slate-500">{it.unit}</td>
                  <td className="px-2 py-2 text-center">
                    <input
                      type="number"
                      min={0}
                      step={it.unit === 'lm' || it.unit === 'm2' ? 0.1 : 1}
                      value={it.quantity}
                      onChange={(e) => updateQty(it.id, Number(e.target.value))}
                      className="w-16 rounded border border-purple-200 px-2 py-1 text-center text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 text-right font-medium text-slate-800">
                    {formatCurrency(it.rate * it.quantity)}
                  </td>
                  <td className="px-1 py-2 text-center">
                    <button
                      onClick={() => remove(it.id)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={() => setPickerOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" /> Add Unit Item
        </button>

        {pickerOpen && (
          <div className="max-h-72 overflow-y-auto rounded-lg border border-purple-200 bg-white p-2">
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {available.map((u) => (
                <button
                  key={u.id}
                  onClick={() => addUnit(u.id)}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-purple-50"
                >
                  <span className="truncate">
                    <span className="font-medium text-slate-800">{u.label}</span>
                    <span className="ml-1 text-xs text-slate-500">({u.unit})</span>
                  </span>
                  <span className="shrink-0 text-xs font-medium text-purple-700">
                    {formatCurrency(u.rate)}/{u.unit}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
