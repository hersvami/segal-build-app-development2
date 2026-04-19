import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Plus, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import type { QuoteScope } from '../../types/domain';
import { getCategoryById } from '../../utils/categories/extended';
import { getRelatedCategories } from '../../utils/pricing/scopeRecogniser';
import { AddedScopesPanel } from './AddedScopesPanel';
import { CategoryCard } from './CategoryCard';

type CategoryOption = { id: string; label: string };
type GroupedCategories = Record<string, CategoryOption[]>;

type Recognition = {
  categoryId: string;
  label: string;
  confidence: number;
};

type Props = {
  documentType: 'quote' | 'variation';
  scopeInput: string;
  setScopeInput: (value: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (value: string) => void;
  recognised: Recognition[];
  showCategoryBrowser: boolean;
  setShowCategoryBrowser: (value: boolean) => void;
  groupedCategories: GroupedCategories;
  scopes: QuoteScope[];
  geminiKey: string;
  setGeminiKey: (value: string) => void;
  apiPolishing: boolean;
  varRefQuote: string;
  setVarRefQuote: (value: string) => void;
  varReason: string;
  setVarReason: (value: string) => void;
  approvedQuotes: Array<{ id: string; title: string }>;
  lastAiModel: string;
  recogniseFeedback?: string;
  keyRestored?: boolean;
  onRecognise: () => void;
  onPolish: () => Promise<void>;
  onAddScope: (categoryId: string) => void;
  onRemoveScope: (index: number) => void;
};

export function ScopeStep({
  documentType,
  scopeInput,
  setScopeInput,
  selectedCategoryId,
  setSelectedCategoryId,
  recognised,
  showCategoryBrowser,
  setShowCategoryBrowser,
  groupedCategories,
  scopes,
  geminiKey,
  setGeminiKey,
  apiPolishing,
  varRefQuote,
  setVarRefQuote,
  varReason,
  setVarReason,
  approvedQuotes,
  lastAiModel,
  recogniseFeedback,
  keyRestored,
  onRecognise,
  onPolish,
  onAddScope,
  onRemoveScope,
}: Props) {
  const addedIds = scopes.map((scope) => scope.categoryId);

  const relatedCategories = useMemo(() => {
    const map = new Map<string, string>();
    const sourceIds = [selectedCategoryId, ...addedIds].filter(Boolean);
    sourceIds.forEach((categoryId) => {
      const source = getCategoryById(categoryId);
      getRelatedCategories(categoryId).forEach((rel) => {
        if (!map.has(rel.categoryId) && rel.categoryId !== categoryId) {
          map.set(rel.categoryId, source?.label || 'Selected category');
        }
      });
    });
    return [...map.entries()].map(([categoryId, sourceLabel]) => ({ categoryId, sourceLabel }));
  }, [addedIds, selectedCategoryId]);

  const handleRemoveByCategory = (categoryId: string) => {
    const index = scopes.findIndex((scope) => scope.categoryId === categoryId);
    if (index >= 0) onRemoveScope(index);
  };

  return (
    <div className="space-y-5">
      {documentType === 'variation' && (
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="font-semibold text-amber-900">Variation Details</h3>
          <select value={varRefQuote} onChange={(e) => setVarRefQuote(e.target.value)} className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm">
            <option value="">Reference Quote...</option>
            {approvedQuotes.map((quote) => <option key={quote.id} value={quote.id}>{quote.title}</option>)}
          </select>
          <select value={varReason} onChange={(e) => setVarReason(e.target.value)} className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm">
            <option value="">Reason for Change...</option>
            {['Client Request', 'Site Condition', 'Design Change', 'Compliance', 'Other'].map((reason) => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-3">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Describe the scope of works</span>
          <textarea
            value={scopeInput}
            onChange={(e) => setScopeInput(e.target.value)}
            placeholder={[
              'Paste or write the full scope here.',
              'Include room sizes, fixtures, tile height, waterproofing, vanity, demolition, electrical and plumbing notes.',
              'Example: Full bathroom renovation 3.0 x 2.5m with floor-to-ceiling wall tiles, vanity, new shower screen and AS3740 waterproofing.',
            ].join('\n')}
            rows={8}
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-relaxed outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            style={{ minHeight: '220px' }}
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onRecognise} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Recognise Categories
          </button>
          {geminiKey && (
            <button
              type="button"
              onClick={onPolish}
              disabled={apiPolishing || !scopeInput.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" /> {apiPolishing ? 'Polishing…' : 'Polish with AI'}
            </button>
          )}
          {recogniseFeedback && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> {recogniseFeedback}
            </span>
          )}
          {!scopeInput.trim() && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <AlertCircle className="h-3.5 w-3.5" /> Type a description first
            </span>
          )}
        </div>

        {geminiKey ? (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">AI Key Saved (this browser)</span>
            {keyRestored && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">Restored from previous session</span>}
            {lastAiModel && <span className="text-slate-400">Last used: {lastAiModel}</span>}
            <button type="button" onClick={() => setGeminiKey('')} className="ml-auto text-slate-400 underline hover:text-red-500">Clear key</button>
          </div>
        ) : (
          <div className="space-y-1 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
            <label className="text-xs font-medium text-slate-600">Gemini API Key (saved to this browser)</label>
            <input value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="Paste your Gemini API key…" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs" />
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">Get free API key from Google AI Studio →</a>
          </div>
        )}
      </div>

      {recognised.length > 0 && (
        <Section title={`Detected Categories (${recognised.length})`}>
          <div className="grid gap-3 lg:grid-cols-2">
            {recognised.map((result) => (
              <CategoryCard
                key={result.categoryId}
                categoryId={result.categoryId}
                label={result.label}
                confidence={result.confidence}
                added={addedIds.includes(result.categoryId)}
                blockedReason={getOverlapReason(result.categoryId, scopes)}
                onAdd={(id) => { setSelectedCategoryId(id); onAddScope(id); }}
                onRemove={handleRemoveByCategory}
              />
            ))}
          </div>
        </Section>
      )}

      {relatedCategories.length > 0 && (
        <Section title="Recommended Related Categories">
          <div className="grid gap-3 lg:grid-cols-2">
            {relatedCategories.map((item) => (
              <CategoryCard
                key={item.categoryId}
                categoryId={item.categoryId}
                sourceLabel={item.sourceLabel}
                added={addedIds.includes(item.categoryId)}
                blockedReason={getOverlapReason(item.categoryId, scopes)}
                onAdd={onAddScope}
                onRemove={handleRemoveByCategory}
              />
            ))}
          </div>
        </Section>
      )}

      <button type="button" onClick={() => setShowCategoryBrowser(!showCategoryBrowser)} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
        <Plus className="h-4 w-4" /> Browse All 43 Categories {showCategoryBrowser ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {showCategoryBrowser && (
        <div className="max-h-64 space-y-3 overflow-y-auto rounded-lg bg-slate-50 p-4">
          {Object.entries(groupedCategories).map(([group, categories]) => (
            <div key={group}>
              <h4 className="mb-1 text-xs font-semibold uppercase text-slate-500">{group}</h4>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => {
                  const added = addedIds.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => (added ? handleRemoveByCategory(category.id) : onAddScope(category.id))}
                      className={added ? 'rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs text-red-700' : 'rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs hover:border-blue-400 hover:text-blue-600'}
                    >
                      {added ? 'Remove ' : 'Add '}{category.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddedScopesPanel scopes={scopes} onRemoveScope={handleRemoveByCategory} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}

function getOverlapReason(categoryId: string, scopes: QuoteScope[]) {
  // Only ASSEMBLY archetype categories (Bathroom, Kitchen, etc.) bundle child trades
  // via the explicit `bundles` array. Suggested/related categories are NOT bundles —
  // they are hints only. This message is INFORMATIONAL; the Add button stays enabled
  // so the builder can always override and add anyway when extra scope is needed.
  const candidate = getCategoryById(categoryId);
  if (!candidate) return undefined;
  for (const scope of scopes) {
    const existing = getCategoryById(scope.categoryId);
    if (!existing) continue;
    if (existing.bundles && existing.bundles.includes(categoryId)) {
      return `Already included inside ${scope.categoryLabel}. Add separately only if you need extra ${candidate.label} scope beyond what's bundled.`;
    }
  }
  return undefined;
}
