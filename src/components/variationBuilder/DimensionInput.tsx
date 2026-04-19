type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export function DimensionInput({ label, value, onChange }: Props) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded border px-2 py-1.5 text-sm"
      />
    </div>
  );
}
