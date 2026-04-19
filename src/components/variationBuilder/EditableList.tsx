import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { generateId } from '../../utils/helpers';

export type EditableListItem = {
  id: string;
  text: string;
  isDefault: boolean;
};

type Color = 'emerald' | 'red';

const COLOR_MAP: Record<Color, { bg: string; text: string; hoverBg: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', hoverBg: 'hover:bg-emerald-100' },
  red:     { bg: 'bg-red-50',     text: 'text-red-700',     hoverBg: 'hover:bg-red-100'     },
};

type Props = {
  title: string;       // e.g. "Inclusions" / "Exclusions"
  items: EditableListItem[];
  onChange: (items: EditableListItem[]) => void;
  color: Color;
  icon: string;        // "✓" or "✗"
};

export function EditableList({ title, items, onChange, color, icon }: Props) {
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const c = COLOR_MAP[color];

  const handleAdd = () => {
    if (!newText.trim()) return;
    onChange([...items, { id: generateId(), text: newText.trim(), isDefault: false }]);
    setNewText('');
    setAdding(false);
  };

  const updateItem = (i: number, text: string) => {
    const next = [...items];
    next[i] = { ...next[i], text };
    onChange(next);
  };

  return (
    <div className="space-y-1">
      <h4 className={`text-sm font-medium ${c.text}`}>{title} ({items.length})</h4>
      {items.map((item, i) => (
        <div key={item.id} className={`group flex items-center gap-2 rounded-lg ${c.bg} px-3 py-1.5 text-sm`}>
          <span className={c.text}>{icon}</span>
          <input
            value={item.text}
            onChange={(e) => updateItem(i, e.target.value)}
            className={`flex-1 rounded border-0 bg-transparent px-1 py-0.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-blue-300 ${c.text}`}
          />
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="rounded p-0.5 text-slate-300 opacity-0 transition-all hover:text-red-600 group-hover:opacity-100"
            aria-label={`Remove ${title.toLowerCase()}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="mt-1 flex gap-2">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder={`Add ${title.toLowerCase()}…`}
            className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
            autoFocus
          />
          <button onClick={handleAdd} className="text-sm font-medium text-blue-600 hover:text-blue-700">Add</button>
          <button onClick={() => { setAdding(false); setNewText(''); }} className="text-sm text-slate-500">Cancel</button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${c.text} ${c.hoverBg}`}
        >
          <Plus className="h-3 w-3" /> Add {title.replace(/s$/, '')}
        </button>
      )}
    </div>
  );
}
