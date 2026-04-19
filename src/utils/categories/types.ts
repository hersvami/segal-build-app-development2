/* ─── Segal Build — Category System ─── */

export type UnitType = 'area' | 'linear' | 'item' | 'allow';

/**
 * Category archetype — controls which UI questions, dimensions, and pricing
 * model the category uses. A category MUST belong to exactly one archetype.
 *
 * - assembly:   bundled fitouts (Bathroom, Kitchen). Includes child trades.
 *               Has size + selections. PC items YES. Locks out child trades.
 * - trade:      single-discipline (Electrical, Plumbing, Painting).
 *               Parametric units (counts/lengths). Selective PC items.
 * - element:    one buildable thing (Internal Wall, Cladding, Fence).
 *               Type-first, then only relevant dimensions. PC items rare.
 * - compliance: count + spec (Smoke Alarm, Fire Door, Grab Rail).
 *               No dimensions. Fixed unit rate. No PC items.
 */
export type CategoryArchetype = 'assembly' | 'trade' | 'element' | 'compliance';

/**
 * Dimension mode — what physical measurements the category needs.
 * 'none' means the category is count-based or item-based only.
 */
export type DimensionMode = 'area' | 'linear' | 'wall' | 'room' | 'item' | 'roof' | 'none';

export type ScopeQuestion = {
  id: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'checkbox';
  options?: string[];
  /** When set, this question only appears if `dependsOn.questionId` equals one of `dependsOn.values` */
  dependsOn?: { questionId: string; values: string[] };
};

export type CategoryRelation = {
  categoryId: string;
  type: 'auto' | 'suggested';
};

export type WorkCategory = {
  id: string;
  label: string;
  icon: string;
  group: string;
  archetype: CategoryArchetype;
  dimensionMode: DimensionMode;
  /** Categories whose trades are absorbed by this one (Bathroom absorbs Plumbing/Tiling/Waterproofing). */
  bundles: string[];
  /** Whether this category supports PC items (most assemblies + finish trades; almost no compliance). */
  supportsPcItems: boolean;
  /** Whether this category uses parametric (Rawlinsons-style) unit pricing. */
  usesParametric: boolean;
  questions: ScopeQuestion[];
  stages: Array<{ name: string; trade: string; rate: number; unit: UnitType; duration: number; description: string }>;
  pcItems: Array<{ description: string; allowance: number; unit: string }>;
  inclusions: string[];
  exclusions: string[];
  relations: CategoryRelation[];
  contingencySuggestion: number;
  workType: string;
};

/* ── Category Groups ── */
export const CATEGORY_GROUPS: Record<string, string> = {
  wet: 'Wet Areas & Interiors',
  structural: 'Structural & Extensions',
  external: 'External Works',
  trades: 'Trades & Services',
  specialty: 'Specialty',
};

/* ── Archetype defaults — used when cat() is called without explicit overrides ── */
const ARCHETYPE_DEFAULTS: Record<CategoryArchetype, { dimensionMode: DimensionMode; supportsPcItems: boolean; usesParametric: boolean }> = {
  assembly:   { dimensionMode: 'area', supportsPcItems: true,  usesParametric: false },
  trade:      { dimensionMode: 'none', supportsPcItems: false, usesParametric: true  },
  element:    { dimensionMode: 'wall', supportsPcItems: false, usesParametric: false },
  compliance: { dimensionMode: 'none', supportsPcItems: false, usesParametric: false },
};

/* ── Backward-compatible factory ──
 * Original signature: cat(id, label, icon, group, questions, stages, pcItems, inclusions, exclusions, relations, contingency?, workType?)
 * New signature:      catX(id, label, icon, group, archetype, questions, stages, pcItems, inclusions, exclusions, relations, options?)
 *
 * `cat()` infers the archetype from the group/id so existing data files keep compiling.
 * The 4 pilot categories (bathroom, electrical, internalWalls, fireSafety) use catX() to
 * declare their archetype + control flags explicitly.
 */

function inferArchetype(id: string, group: string): CategoryArchetype {
  // Compliance items
  if (id === 'fireSafety' || id === 'accessibility' || id === 'smartHome') return 'compliance';
  // Single-discipline trades
  if (group === 'trades') return 'trade';
  // Element-style external/structural single-thing builds
  if (id === 'internalWalls' || id === 'cladding' || id === 'fencing' || id === 'decking' ||
      id === 'retainingWalls' || id === 'rendering' || id === 'paving' || id === 'guttersFascia' ||
      id === 'brickwork' || id === 'insulation' || id === 'acoustic' || id === 'ceilings') return 'element';
  // Default: bundled assemblies (bathroom, kitchen, extensions, etc.)
  return 'assembly';
}

export function cat(
  id: string, label: string, icon: string, group: string,
  questions: ScopeQuestion[],
  stages: WorkCategory['stages'],
  pcItems: WorkCategory['pcItems'],
  inclusions: string[],
  exclusions: string[],
  relations: CategoryRelation[],
  contingency = 10,
  workType = 'renovation',
): WorkCategory {
  const archetype = inferArchetype(id, group);
  const defs = ARCHETYPE_DEFAULTS[archetype];
  return {
    id, label, icon, group,
    archetype,
    dimensionMode: defs.dimensionMode,
    bundles: [],
    supportsPcItems: defs.supportsPcItems,
    usesParametric: defs.usesParametric,
    questions, stages, pcItems, inclusions, exclusions, relations,
    contingencySuggestion: contingency,
    workType,
  };
}

/** Explicit-archetype factory used by the 4 pilot categories. */
export function catX(
  id: string, label: string, icon: string, group: string,
  archetype: CategoryArchetype,
  questions: ScopeQuestion[],
  stages: WorkCategory['stages'],
  pcItems: WorkCategory['pcItems'],
  inclusions: string[],
  exclusions: string[],
  relations: CategoryRelation[],
  options: {
    dimensionMode?: DimensionMode;
    bundles?: string[];
    supportsPcItems?: boolean;
    usesParametric?: boolean;
    contingency?: number;
    workType?: string;
  } = {},
): WorkCategory {
  const defs = ARCHETYPE_DEFAULTS[archetype];
  return {
    id, label, icon, group,
    archetype,
    dimensionMode: options.dimensionMode ?? defs.dimensionMode,
    bundles: options.bundles ?? [],
    supportsPcItems: options.supportsPcItems ?? defs.supportsPcItems,
    usesParametric: options.usesParametric ?? defs.usesParametric,
    questions, stages, pcItems, inclusions, exclusions, relations,
    contingencySuggestion: options.contingency ?? 10,
    workType: options.workType ?? 'renovation',
  };
}
