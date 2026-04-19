/* ─── Segal Build — Solution Engine ─── */
import { getCategoryById } from '../categories/extended';
import type { JobStage, QuoteScope, Solution } from '../../types/domain';
import { calculateScope } from './quoteCalculator';
import { generateId } from '../helpers';

export function generateSolutionsFromScope(
  categoryId: string,
  description: string,
  dimensions: { width: number; length: number; height: number },
): { scopes: QuoteScope[]; solutions: Solution[] } {
  const cat = getCategoryById(categoryId);
  if (!cat) {
    return { scopes: [], solutions: [] };
  }

  const stages: JobStage[] = cat.stages.map(s => ({
    name: s.name,
    trade: s.trade,
    cost: 0,
    duration: s.duration,
    description: s.description,
    status: 'not-started' as const,
  }));

  const { totalCost, totalDuration } = calculateScope(cat.stages, dimensions);

  const multipliers = [
    { name: 'Essential', desc: 'Quality standard materials', mult: 1.0 },
    { name: 'Standard', desc: 'Mid-range premium materials', mult: 1.3 },
    { name: 'Premium', desc: 'High-end designer materials', mult: 1.7 },
  ];

  const solutions: Solution[] = multipliers.map(m => ({
    name: m.name,
    totalCost: Math.round(totalCost * m.mult),
    duration: Math.round(totalDuration * m.mult * 10) / 10,
    stages: stages.map(s => ({ ...s, cost: Math.round(s.cost || (totalCost * m.mult / stages.length)) })),
    description: m.desc,
  }));

  const scope: QuoteScope = {
    id: generateId(),
    categoryId,
    categoryLabel: cat.label,
    description,
    stages,
    dimensions,
    answers: {},
    pcItems: [],
    inclusions: [],
    exclusions: [],
  };

  return { scopes: [scope], solutions };
}

export function generateSolutionFromCategory(
  categoryId: string,
  description: string,
  dimensions: { width: number; length: number; height: number },
  multiplier: number = 1.0,
): { scope: QuoteScope; stages: JobStage[]; totalCost: number; totalDuration: number } {
  const cat = getCategoryById(categoryId);
  if (!cat) {
    const fallback: JobStage = { name: description, trade: 'General', cost: 0, duration: 5, description, status: 'not-started' };
    return { scope: createEmptyScope(categoryId, description, dimensions), stages: [fallback], totalCost: 0, totalDuration: 5 };
  }

  const stages: JobStage[] = cat.stages.map(s => ({
    name: s.name,
    trade: s.trade,
    cost: 0,
    duration: s.duration,
    description: s.description,
    status: 'not-started' as const,
  }));

  const { totalCost, totalDuration } = calculateScope(cat.stages, dimensions);
  const adjustedCost = Math.round(totalCost * multiplier);

  return {
    scope: createEmptyScope(categoryId, description, dimensions),
    stages,
    totalCost: adjustedCost,
    totalDuration: Math.round(totalDuration * 10) / 10,
  };
}

function createEmptyScope(categoryId: string, description: string, dimensions: { width: number; length: number; height: number }): QuoteScope {
  const cat = getCategoryById(categoryId);
  return {
    id: generateId(),
    categoryId,
    categoryLabel: cat?.label || categoryId,
    description,
    stages: [],
    dimensions,
    answers: {},
    pcItems: [],
    inclusions: [],
    exclusions: [],
    parametricItems: [],
  };
}

/** Sum the cost of all stages + parametric items in a scope. */
export function calcScopeTotal(scope: QuoteScope): number {
  const stageTotal = scope.stages.reduce((s, st) => s + (st.cost || 0), 0);
  const paramTotal = (scope.parametricItems || []).reduce((s, p) => s + (p.rate * p.quantity), 0);
  return stageTotal + paramTotal;
}

/** Sum cost across an array of scopes. */
export function calcScopesTotal(scopes: QuoteScope[]): number {
  return scopes.reduce((s, sc) => s + calcScopeTotal(sc), 0);
}
