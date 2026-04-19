/* ─── Segal Build — Scope Recogniser & Category Relations ─── */
import { ALL_CATEGORIES, getCategoryById } from '../categories/extended';
import type { WorkCategory, CategoryRelation } from '../categories/types';

export type ScopeRecognition = {
  categoryId: string;
  confidence: number;
  label: string;
};

const KEYWORD_MAP: Record<string, string[]> = {
  bathroom: ['bathroom', 'bath', 'ensuite', 'shower', 'vanity', 'wet area'],
  kitchen: ['kitchen', 'cook', 'benchtop', 'cabinet', 'pantry', 'splashback'],
  laundry: ['laundry', 'trough', 'washing machine', 'dryer'],
  toilet: ['toilet', 'wc', 'loo'],
  flooring: ['floor', 'timber floor', 'carpet', 'vinyl', 'polished concrete', 'flooring'],
  painting: ['paint', 'painting', 'repaint', 'paintwork'],
  windowsDoors: ['window', 'door', 'glazing', 'sliding door', 'stacker'],
  demolition: ['demo', 'demolition', 'strip out', 'remove'],
  structural: ['structural', 'wall removal', 'beam', 'lintel', 'load bearing'],
  decking: ['deck', 'decking', 'merbau', 'composite deck'],
  electrical: ['electrical', 'electrician', 'power point', 'switchboard', 'rewire', 'lighting'],
  plumbing: ['plumbing', 'plumber', 'hot water', 'drainage', 'sewer', 'gas'],
  waterproofing: ['waterproof', 'membrane', 'waterproofing'],
  roofing: ['roof', 're-roof', 're-roofing', 'roofing', 'colorbond'],
  extensions: ['extension', 'extend', 'room addition'],
  newHomeBuild: ['new home', 'new house', 'new build', 'knock down rebuild'],
  fencing: ['fence', 'fencing', 'colorbond fence', 'pool fence'],
  concreting: ['concrete', 'slab', 'footing', 'crossover', 'path'],
  hvac: ['air con', 'air conditioning', 'hvac', 'split system', 'ducted', 'heating', 'cooling'],
  pergola: ['pergola', 'patio', 'alfresco', 'verandah', 'carport'],
  landscaping: ['landscape', 'turf', 'garden', 'irrigation'],
  pools: ['pool', 'spa'],
  retainingWalls: ['retaining wall', 'retaining'],
  secondStorey: ['second storey', 'double storey', 'upstairs', 'upper storey', 'upper storey extension', 'upper-floor', 'upper floor'],
  grannyFlat: ['granny flat', 'dpu', 'dual living'],
  insulation: ['insulation', 'insulate', 'batt', 'bulk insulation'],
  smartHome: ['smart home', 'cctv', 'intercom', 'network', 'automation'],
  fireSafety: ['smoke alarm', 'fire door', 'bal', 'fire safety'],
  accessibility: ['accessibility', 'nda', 'grab rail', 'ramp', 'ndis'],
  heritage: ['heritage', 'period', 'heritage listed'],
  rendering: ['render', 'rendering', 'texture coat', 'acrylic render'],
  cladding: ['cladding', 'weatherboard', 'fibre cement'],
  acoustic: ['acoustic', 'soundproof', 'sound proof'],
  guttersFascia: ['gutter', 'fascia', 'downpipe'],
  roofRepairs: ['roof leak', 'roof repair', 'flashing', 'ridge cap'],
  paving: ['paving', 'driveway', 'paver', 'exposed aggregate'],
  multiUnit: ['dual occ', 'townhouse', 'triplex', 'multi unit'],
  underpinning: ['underpin', 'restump', 'stump', 'slab repair'],
  steelFraming: ['steel beam', 'steel framing', 'lvl beam'],
  cabinetry: ['cabinet', 'built-in robe', 'bir', 'joinery', 'shelving'],
  ceilings: ['ceiling', 'cornice', 'bulkhead', 'raking ceiling'],
  internalWalls: ['internal wall', 'stud wall', 'plasterboard', 'partition'],
};

export function recogniseScope(description: string): ScopeRecognition[] {
  const desc = description.toLowerCase();
  const results: ScopeRecognition[] = [];

  for (const [categoryId, keywords] of Object.entries(KEYWORD_MAP)) {
    const cat = getCategoryById(categoryId);
    if (!cat) continue;
    let maxScore = 0;
    for (const kw of keywords) {
      if (desc.includes(kw)) {
        const score = kw.length / desc.length;
        if (score > maxScore) maxScore = score;
      }
    }
    if (maxScore > 0) {
      results.push({ categoryId, confidence: Math.min(maxScore * 5, 1), label: cat.label });
    }
  }

  results.sort((a, b) => b.confidence - a.confidence);

  if (results.length === 0 && ALL_CATEGORIES.length > 0) {
    results.push({ categoryId: ALL_CATEGORIES[0].id, confidence: 0.1, label: ALL_CATEGORIES[0].label });
  }

  return results;
}

export async function recogniseScopeWithAI(description: string, _apiKey?: string): Promise<ScopeRecognition[]> {
  if (!_apiKey) return recogniseScope(description);
  try {
    return recogniseScope(description);
  } catch {
    return recogniseScope(description);
  }
}

export function getRelatedCategories(categoryId: string): CategoryRelation[] {
  const cat = getCategoryById(categoryId);
  return cat?.relations || [];
}

export function getAutoAddCategories(categoryId: string): string[] {
  return getRelatedCategories(categoryId)
    .filter(r => r.type === 'auto')
    .map(r => r.categoryId);
}

export function getSuggestedCategories(categoryId: string): string[] {
  return getRelatedCategories(categoryId)
    .filter(r => r.type === 'suggested')
    .map(r => r.categoryId);
}

export function suggestContingency(workType: string): number {
  const map: Record<string, number> = { new_build: 5, renovation: 10, structural: 15, maintenance: 5 };
  return map[workType] || 10;
}

export function getAllCategories() { return ALL_CATEGORIES; }
export function getGroupedCategories(): Record<string, WorkCategory[]> {
  const groups: Record<string, WorkCategory[]> = {};
  for (const cat of ALL_CATEGORIES) {
    if (!groups[cat.group]) groups[cat.group] = [];
    groups[cat.group].push(cat);
  }
  return groups;
}