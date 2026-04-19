import { Plus, X } from 'lucide-react';
import { generateId } from '../../utils/helpers';

type PCItem = { id: string; description: string; allowance: number; unit: string };

type Props = {
  items: PCItem[];
  onChange: (next: PCItem[]) => void;
};

export function PCItemEditor({ items, onChange }: Props) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-slate-700">PC Items</h4>
      {items.map((item, index) => (
        <div key={item.id} className="group flex items-center gap-2">
          <input
            value={item.description}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...next[index], description: e.target.value };
              onChange(next);
            }}
            className="flex-1 rounded border px-2 py-1 text-sm"
            placeholder="Description"
          />
          <input
            type="number"
            value={item.allowance}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...next[index], allowance: Number(e.target.value) };
              onChange(next);
            }}
            className="w-24 rounded border px-2 py-1 text-sm"
          />
          <span className="w-16 text-xs text-slate-500">{item.unit}</span>
          <button
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="rounded p-1 text-slate-300 opacity-0 transition-all hover:text-red-600 group-hover:opacity-100"
            aria-label="Delete PC item"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, { id: generateId(), description: '', allowance: 0, unit: 'allowance' }])}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        <Plus className="h-3 w-3" />
        Add PC Item
      </button>
    </div>
  );
}
