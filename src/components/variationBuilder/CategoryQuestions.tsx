import { getCategoryById } from '../../utils/categories/extended';
import type { QuoteScope } from '../../types/domain';

type Props = {
  scope: QuoteScope;
  onChange: (next: QuoteScope) => void;
};

export function CategoryQuestions({ scope, onChange }: Props) {
  const category = getCategoryById(scope.categoryId);
  if (!category || category.questions.length === 0) return null;

  const updateAnswer = (id: string, value: string) => {
    const answers = { ...scope.answers, [id]: value };
    onChange({
      ...scope,
      answers,
      selectedType: id === 'type' ? value : scope.selectedType,
    });
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div>
        <h4 className="text-sm font-semibold text-slate-900">Category Selections</h4>
        <p className="text-xs text-slate-500">
          These selections tailor what is included for {scope.categoryLabel}.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {category.questions.map((question) => {
          const value = scope.answers[question.id] ?? '';
          return (
            <label key={question.id} className="block space-y-1">
              <span className="text-xs font-medium text-slate-600">{question.label}</span>
              {question.type === 'select' ? (
                <select
                  value={value}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select…</option>
                  {(question.options || []).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : question.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={value === 'true'}
                  onChange={(e) => updateAnswer(question.id, String(e.target.checked))}
                  className="h-4 w-4 rounded border-slate-300"
                />
              ) : (
                <input
                  type={question.type === 'number' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
