import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import type { Project, ProjectBaseline, QuoteScope, Variation } from '../types/domain';
import { cn, formatCurrency, generateId } from '../utils/helpers';
import { getAllCategories, recogniseScope } from '../utils/pricing/scopeRecogniser';
import { calcScopesTotal } from '../utils/pricing/engine';
import { calculateQuote } from '../utils/pricing/quoteCalculator';
import { calcBaselineAdjustment, describeBaseline } from '../utils/pricing/baselineMultipliers';
import { polishScopeWithAI } from '../utils/services';
import { BaselineStep } from './variationBuilder/BaselineStep';
import { ScopeStep } from './variationBuilder/ScopeStep';
import { ScopeDetailEditor } from './variationBuilder/Editors';
import { PricingStep } from './variationBuilder/PricingStep';
import { ReviewStep } from './variationBuilder/ReviewStep';
import { clearBuilderDraft, loadBuilderDraft, saveBuilderDraft } from './variationBuilder/builderDraft';
import { createScopeFromCategory } from './variationBuilder/createScopeFromCategory';

const GEMINI_KEY_STORAGE = 'segal:geminiApiKey';
type Step = 'baseline' | 'scope' | 'details' | 'pricing' | 'review';
const STEPS: Step[] = ['baseline', 'scope', 'details', 'pricing', 'review'];
const STEP_LABELS: Record<Step, string> = { baseline: 'Project', scope: 'Scope', details: 'Details', pricing: 'Pricing', review: 'Review' };

type Props = {
  project: Project;
  documentType: 'quote' | 'variation';
  existingQuotes: Variation[];
  companyOH: number;
  companyProfit: number;
  onSave: (variation: Variation) => void;
  onCancel: () => void;
};

export function VariationBuilder({ project, documentType, existingQuotes, companyOH, companyProfit, onSave, onCancel }: Props) {
  const savedDraft = loadBuilderDraft(project.id, documentType);
  const [step, setStep] = useState<Step>('baseline');
  const [scopeInput, setScopeInput] = useState(savedDraft?.scopeInput || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(savedDraft?.selectedCategoryId || '');
  const [showCategoryBrowser, setShowCategoryBrowser] = useState(false);
  const [scopes, setScopes] = useState<QuoteScope[]>([]);
  const [ohPct, setOhPct] = useState(companyOH);
  const [profitPct, setProfitPct] = useState(companyProfit);
  const [contingencyPct, setContingencyPct] = useState(10);
  const [varRefQuote, setVarRefQuote] = useState('');
  const [varReason, setVarReason] = useState('');
  const [baseline, setBaseline] = useState<ProjectBaseline>(savedDraft?.baseline || { totalAreaM2: 0, storeys: 'single', siteAccess: 'easy', notes: '' });
  const [geminiKey, setGeminiKey] = useState(() => readGeminiKey(project.geminiApiKey));
  const [keyRestored, setKeyRestored] = useState(false);
  const [apiPolishing, setApiPolishing] = useState(false);
  const [lastAiModel, setLastAiModel] = useState('');
  const [recogniseFeedback, setRecogniseFeedback] = useState('');

  useEffect(() => {
    saveBuilderDraft(project.id, documentType, { scopeInput, selectedCategoryId, baseline });
  }, [baseline, documentType, project.id, scopeInput, selectedCategoryId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(GEMINI_KEY_STORAGE);
      if (stored && stored === geminiKey) {
        setKeyRestored(true);
        const t = setTimeout(() => setKeyRestored(false), 4000);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (geminiKey) window.localStorage.setItem(GEMINI_KEY_STORAGE, geminiKey);
      else window.localStorage.removeItem(GEMINI_KEY_STORAGE);
    } catch {}
  }, [geminiKey]);

  const recognised = scopeInput.length > 2 ? recogniseScope(scopeInput) : [];
  const groupedCategories = useMemo(groupCategories, []);
  const approvedQuotes = existingQuotes.filter((q) => q.documentType === 'quote' && q.status === 'approved');
  const rawTradeCost = useMemo(() => calcScopesTotal(scopes), [scopes]);
  const baselineAdj = useMemo(() => calcBaselineAdjustment(baseline, rawTradeCost), [baseline, rawTradeCost]);
  const pricing = calculateQuote(rawTradeCost + baselineAdj.totalAdjustment, ohPct, profitPct, contingencyPct);


  const canNext = step === 'baseline'
    ? baseline.totalAreaM2 > 0
    : step === 'scope'
      ? scopes.length > 0 && (documentType === 'quote' || (Boolean(varRefQuote) && Boolean(varReason)))
      : true;

  const handleAddScope = (categoryId: string) => {
    setScopes((prev) => {
      if (prev.some((scope) => scope.categoryId === categoryId)) return prev;
      const next = createScopeFromCategory(categoryId, scopeInput);
      return next ? [...prev, next] : prev;
    });
    setSelectedCategoryId(categoryId);
  };

  const handleRecognise = () => {
    const results = recogniseScope(scopeInput);
    if (results.length === 0 || (results.length === 1 && results[0].confidence <= 0.1)) {
      flashRecognise('No clear matches — browse categories below.');
      return;
    }
    setSelectedCategoryId(results[0].categoryId);
    flashRecognise(`Found ${results.length} matches — top: ${results[0].label}`);
  };

  const handlePolish = async () => {
    if (!geminiKey || !scopeInput.trim()) return;
    setApiPolishing(true);
    const result = await polishScopeWithAI(scopeInput, geminiKey);
    setScopeInput(result.text);
    if (result.model) setLastAiModel(result.model);
    setApiPolishing(false);
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const nextVariationCount = existingQuotes.filter((v) => v.documentType === 'variation').length + 1;
    clearBuilderDraft(project.id, documentType);
    onSave({
      id: generateId(),
      title: documentType === 'quote' ? `Quote - ${project.name}` : `Variation ${scopes.map((s) => s.categoryLabel).join(', ')}`,
      description: scopes.map((s) => s.description).join('; '),
      status: 'draft',
      documentType,
      scopes,
      pricing,
      changeLog: [{ id: generateId(), action: 'created', timestamp: now, user: 'Builder', details: `${documentType} created with ${scopes.length} scope(s)` }],
      createdAt: now,
      updatedAt: now,
      internalNotes: [],
      source: 'internal',
      referenceQuoteId: documentType === 'variation' ? varRefQuote : undefined,
      reasonForChange: documentType === 'variation' ? varReason : undefined,
      variationNumber: documentType === 'variation' ? `V-${String(nextVariationCount).padStart(3, '0')}` : undefined,
      costImpact: documentType === 'variation' ? 'additional' : undefined,
      baseline,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
        <header className="shrink-0 border-b border-slate-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{documentType === 'quote' ? 'New Quote' : 'New Variation'}</h2>
            <button onClick={onCancel} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close builder"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex gap-2">
            {STEPS.map((name, i) => <div key={name} className={cn('flex-1 rounded-lg py-2 text-center text-sm font-medium', name === step ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500')}>{i + 1}. {STEP_LABELS[name]}</div>)}
          </div>
          {baseline.totalAreaM2 > 0 && step !== 'baseline' && (
            <p className="mt-2 text-xs text-slate-500">
              Baseline: <span className="font-medium text-slate-700">{describeBaseline(baseline)}</span>
              {baselineAdj.totalAdjustment > 0 && <span> · auto-adjustment <span className="font-medium text-amber-700">{formatCurrency(baselineAdj.totalAdjustment)}</span></span>}
            </p>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {step === 'baseline' && <BaselineStep baseline={baseline} setBaseline={setBaseline} previewTradeCost={rawTradeCost} />}
          {step === 'scope' && (
            <ScopeStep
              documentType={documentType}
              scopeInput={scopeInput}
              setScopeInput={setScopeInput}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              recognised={recognised}
              showCategoryBrowser={showCategoryBrowser}
              setShowCategoryBrowser={setShowCategoryBrowser}
              groupedCategories={groupedCategories}
              scopes={scopes}
              geminiKey={geminiKey}
              setGeminiKey={setGeminiKey}
              apiPolishing={apiPolishing}
              varRefQuote={varRefQuote}
              setVarRefQuote={setVarRefQuote}
              varReason={varReason}
              setVarReason={setVarReason}
              approvedQuotes={approvedQuotes.map((q) => ({ id: q.id, title: q.title }))}
              lastAiModel={lastAiModel}
              recogniseFeedback={recogniseFeedback}
              keyRestored={keyRestored}
              onRecognise={handleRecognise}
              onPolish={handlePolish}
              onAddScope={handleAddScope}
              onRemoveScope={(index) => setScopes((prev) => prev.filter((_, i) => i !== index))}
            />
          )}
          {step === 'details' && <div className="space-y-6">{scopes.map((scope, index) => <ScopeDetailEditor key={scope.id} scope={scope} index={index} onChange={(next) => setScopes((prev) => prev.map((s, i) => (i === index ? next : s)))} />)}</div>}
          {step === 'pricing' && <PricingStep scopes={scopes} setScopes={setScopes} ohPct={ohPct} setOhPct={setOhPct} profitPct={profitPct} setProfitPct={setProfitPct} contingencyPct={contingencyPct} setContingencyPct={setContingencyPct} />}
          {step === 'review' && <ReviewStep scopes={scopes} pricing={pricing} ohPct={ohPct} profitPct={profitPct} contingencyPct={contingencyPct} />}
        </main>

        <footer className="flex shrink-0 justify-between border-t border-slate-200 p-4">
          <button onClick={() => moveStep(step, setStep, -1)} disabled={step === 'baseline'} className="flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50"><ArrowLeft className="h-4 w-4" /> Back</button>
          {step === 'review'
            ? <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700"><Check className="h-4 w-4" /> Save {documentType === 'quote' ? 'Quote' : 'Variation'}</button>
            : <button onClick={() => canNext && moveStep(step, setStep, 1)} disabled={!canNext} className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">Next <ArrowRight className="h-4 w-4" /></button>}
        </footer>
      </div>
    </div>
  );

  function flashRecognise(message: string) {
    setRecogniseFeedback(message);
    setTimeout(() => setRecogniseFeedback(''), 4000);
  }
}

function groupCategories() {
  const groups: Record<string, Array<{ id: string; label: string }>> = {};
  for (const category of getAllCategories()) {
    if (!groups[category.group]) groups[category.group] = [];
    groups[category.group].push({ id: category.id, label: category.label });
  }
  return groups;
}

function moveStep(step: Step, setStep: (value: Step) => void, delta: number) {
  const index = STEPS.indexOf(step);
  const next = index + delta;
  if (next >= 0 && next < STEPS.length) setStep(STEPS[next]);
}

function readGeminiKey(projectKey?: string) {
  if (typeof window === 'undefined') return projectKey || '';
  try {
    return window.localStorage.getItem(GEMINI_KEY_STORAGE) || projectKey || '';
  } catch {
    return projectKey || '';
  }
}
