# 06 — Data Types

> **⚠️ STOP — CRITICAL RULES:**
> 1. **You do NOT have access to the code** — you MUST ask the user for files
> 2. **NEVER change types without reading first** — ask for `src/types/domain.ts`
> 3. **UPDATE THIS DOC** — if you change a type, update this document
> 4. **READ before editing** — never overwrite without reading
>
> **AI INSTRUCTION:** Read this module to understand the data model. Ask the user for `src/types/domain.ts` and `src/types/appState.ts` for the exact TypeScript definitions. This is 1 of 13 modules — see `handover/00-index.md` for the full list.

---

## Other Modules You May Need
- Features (what uses these types): `handover/03-features.md`
- File locations: `handover/02-file-structure.md`
- State management: request `src/logic/state.ts`

## Files To Request
- `src/types/domain.ts` — all data types (Project, Variation, QuoteScope, ProjectBaseline, ParametricItem)
- `src/types/appState.ts` — app state shape
- `src/utils/categories/types.ts` — `WorkCategory`, `CategoryArchetype`, `CategoryDimensionMode`, `cat()` and `catX()` factories
- `src/logic/state.ts` — state management functions that use these types

---

## Phase 2 — Category Type Surface

### CategoryArchetype
```typescript
type CategoryArchetype = 'assembly' | 'trade' | 'element' | 'compliance';
```
- `assembly` — room recipe that bundles multiple trades (Bathroom, Kitchen, Granny Flat). Has `bundles: string[]` of child trade IDs it absorbs.
- `trade` — single discipline (Electrical, Plumbing, Tiling). Usually `usesParametric: true`.
- `element` — one buildable thing with type-first selection (Internal Wall, Cladding, Fence). Type chosen before dimensions appear.
- `compliance` — count-only fittings (Smoke Alarm, Grab Rail). No dimensions ever.

### CategoryDimensionMode
```typescript
type CategoryDimensionMode = 'area' | 'linear' | 'wall' | 'room' | 'item' | 'roof' | 'none';
```

### WorkCategory (Phase 2 fields)
```typescript
{
  archetype: CategoryArchetype;
  dimensionMode: CategoryDimensionMode;
  usesParametric: boolean;     // shows BoQ unit picker instead of generic stages
  supportsPcItems: boolean;    // shows PC Items table in Details
  bundles?: string[];          // child trade IDs absorbed by an assembly
  // ...plus existing fields: id, label, icon, group, questions, stages, relations, inclusions, exclusions, pcItems
}
```

### ProjectBaseline (Phase 1)
```typescript
{
  totalAreaM2: number;
  storeys: 'single' | 'double' | 'multi';
  siteAccess: 'easy' | 'moderate' | 'tight';
}
```

### ParametricItem (Phase 1)
```typescript
{
  id: string;
  unitId: string;        // references parametricUnits.ts entry
  label: string;         // e.g. "Double GPO supply + install"
  trade: string;
  unit: 'point' | 'lm' | 'item' | 'm2';
  rate: number;
  quantity: number;
}
```

---

## Core Types

### Project
```typescript
{
  id: string;
  name: string;                                  // "Smith Bathroom Reno"
  address: string;                               // "12 Ebden St, Kew"
  customer: { name: string; email: string; phone: string };
  companyId: string;                             // "segal-build" or "segval"
  heroPhoto?: string;                            // Cloudinary URL or base64
  createdAt: string;                             // ISO date
}
```

### Variation (serves as both Quote and Variation)
```typescript
{
  id: string;
  title: string;
  description: string;
  documentType: 'quote' | 'variation';     // CRITICAL: determines workflow
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  scopes: QuoteScope[];
  pricing: QuotePricing;
  signature?: Signature;
  changeLog: ChangeLogEntry[];
  createdAt: string;

  // Variation-specific fields (only when documentType === 'variation')
  source?: 'internal' | 'external';
  referenceQuoteId?: string;               // ID of original approved quote
  reasonForChange?: string;                // Client Request / Site Condition / etc.
  variationNumber?: string;                // V-001, V-002
  costImpact?: 'additional' | 'credit' | 'no-change';
  externalQuoteRef?: ExternalQuoteReference;

  // Progress tracking
  progressPhotos?: ProgressPhoto[];
}
```

### QuoteScope
```typescript
{
  id: string;
  categoryId: string;                      // matches WorkCategory.id
  categoryLabel: string;
  description: string;
  dimensions: { width: number; length: number; height: number };
  answers: Record<string, string>;         // category question answers
  stages: JobStage[];
  pcItems: PCItem[];
  inclusions: InclusionItem[];
  exclusions: ExclusionItem[];
}
```

### QuotePricing
```typescript
{
  overheadPercent: number;                 // default 12
  profitPercent: number;                   // default 15
  contingencyPercent: number;              // default 10
  gstPercent: number;                      // always 10
  tradeCost: number;
  overhead: number;
  profit: number;
  contingency: number;
  gst: number;
  clientTotal: number;
  totalIncGst: number;
}
```

### ExternalQuoteReference
```typescript
{
  referenceNumber: string;
  originalDate: string;
  approvedAmount: number;
  scopeSummary: string;
}
```

## Supporting Types
| Type | Key Fields |
|---|---|
| `PCItem` | description, allowance, unit, suppliedBy |
| `InclusionItem` | text, isDefault |
| `ExclusionItem` | text, isDefault |
| `JobStage` | name, trade, cost, duration, description, status |
| `Signature` | name, date, dataUrl |
| `ChangeLogEntry` | id, action, timestamp, user, details |
| `ProgressPhoto` | id, url, caption, stage, date |

## App State
```typescript
interface AppState {
  projects: Project[];
  variations: Record<string, Variation[]>;  // projectId → variations
  activeProjectId: string | null;
  activeVariationId: string | null;
  activeCompanyId: string;
  notes: Record<string, string>;            // projectId → notes text
  uiState: {
    showProjectForm: boolean;
    showWelcomeEmail: boolean;
  };
}
```

## Quote vs Variation — Field Usage
| Field | Quote | Variation |
|---|---|---|
| `documentType` | `'quote'` | `'variation'` |
| `referenceQuoteId` | not set | ID of original approved quote |
| `reasonForChange` | not set | Client Request / Site Condition / Design Change / Compliance / Other |
| `variationNumber` | not set | Sequential V-001, V-002 |
| `costImpact` | not set | additional / credit / no-change |
| `source` | `'internal'` | `'internal'` or `'external'` |

## State Management Functions (in `src/logic/state.ts`)
| Function | Purpose |
|---|---|
| `usePersistedAppState()` | Main hook — loads/saves state with version check |
| `createProject()` | Adds project to state |
| `selectProject()` | Sets active project |
| `deleteProject()` | Removes project and all its variations |
| `createVariation()` | Adds variation to project's variation list |
| `updateVariation()` | Updates variation data (pricing, status, etc.) |
| `hasApprovedQuote()` | Checks if project has any approved quote (gates New Variation) |
