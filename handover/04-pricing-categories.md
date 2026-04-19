# 04 — Pricing Categories (43 Total)

> **⚠️ STOP — CRITICAL RULES:**
> 1. **You do NOT have access to the code** — you MUST ask the user for files
> 2. **NEVER create from scratch** — ask "Please provide: [filename]" first
> 3. **READ before editing** — never overwrite without reading
> 4. **Only work on pricing files** — don't touch unrelated modules
>
> **AI INSTRUCTION:** Read this module if you need to work on construction pricing categories, add new categories, or modify rates. Ask the user for files listed below. This is 1 of 13 modules — see `handover/00-index.md` for the full list.

---

## Other Modules You May Need
- Data types for categories: `handover/06-data-types.md`
- AI scope recognition: `handover/05-ai-gemini.md`
- Outstanding fix (split into individual files): `handover/09-required-fixes.md` Fix #3

## Files To Request
- `src/utils/categories/types.ts` — WorkCategory, ScopeQuestion types
- `src/utils/categories/core.ts` — 20 core categories (request this to see category structure)
- `src/utils/categories/extended.ts` — 23 extended categories
- `src/utils/pricing/quoteDefaults.ts` — pre-filled PC items, inclusions, exclusions per category
- `src/utils/pricing/engine.ts` — how categories feed into quote generation
- `src/utils/pricing/scopeRecogniser.ts` — how text maps to categories

---

## Rate Source
All rates are Rawlinsons/Cordell 2024/2025 base rates for Australian residential construction.

## All 43 Categories

### 🚿 Wet Areas & Interior
| # | Category | ID | Key Rates |
|---|---|---|---|
| 1 | Bathroom / Wet Areas | wet-areas | Demo $180/m², Tile $95/m², Waterproof $55/m² |
| 2 | Kitchen | kitchen | Demo $150/m², Plumbing rough-in $2,200, Electrical $1,500 |
| 3 | Laundry | laundry | Demo $120/m², Plumbing rough-in $1,800, Tiling $85/m² |
| 4 | Toilet / WC | toilet | Demo $120/m², Plumbing rough-in $1,200 |
| 5 | Flooring | flooring | Timber $120/m², Tiles $95/m², Carpet $65/m² |
| 6 | Painting | painting | Interior $18/m², Exterior $22/m² |

### 🏗️ Structural & Build
| # | Category | ID | Key Rates |
|---|---|---|---|
| 7 | Demolition | demolition | Internal $150/m², Partial $220/m² |
| 8 | Structural | structural | Beam install $4,500-$8,500 |
| 9 | Internal Walls | internal-walls | Stud wall $85/m², Plasterboard $45/m² |
| 10 | Ceilings | ceilings | Plasterboard $55/m², Bulkhead $120/lm |
| 11 | Underpinning | underpinning | $650-$950/stump |
| 12 | Retaining Walls | retaining-walls | Timber $280/m², Concrete $450/m² |
| 13 | Steel & Framing | steel-framing | Steel beam $350/lm |

### 🏠 Extensions & New Builds
| # | Category | ID | Key Rates |
|---|---|---|---|
| 14 | Ground Floor Extensions | extensions | $2,800-$4,200/m² |
| 15 | Second Storey Additions | second-storey | $3,500-$5,500/m² |
| 16 | New Home Build | new-home | $1,800-$3,500/m² |
| 17 | Multi-Unit | multi-unit | $2,200-$3,800/m² |
| 18 | Granny Flat / DPU | granny-flat | $120k-$180k fixed |

### 🏡 External & Landscape
| # | Category | ID | Key Rates |
|---|---|---|---|
| 19 | Decking | decking | Merbau $380/m², Composite $420/m² |
| 20 | Pergola & Patio | pergola | Timber $350/m², Steel $450/m² |
| 21 | Paving & Driveways | paving | Concrete $130/m², Pavers $160/m² |
| 22 | Concreting | concreting | Slab $110/m², Paths $95/m² |
| 23 | Fencing & Gates | fencing | Timber $120/lm, Colorbond $150/lm |
| 24 | Landscaping | landscaping | Turf $25/m², Garden beds $85/m² |
| 25 | Pool & Spa | pools | Fibreglass $45k, Concrete $65k |

### 🔧 Trades & Services
| # | Category | ID | Key Rates |
|---|---|---|---|
| 26 | Electrical | electrical | Switchboard $2,200, Rewire $85/point |
| 27 | Plumbing & Drainage | plumbing | HW system $2,500, Rough-in $1,800 |
| 28 | HVAC | hvac | Split $2,800, Ducted $12,500 |
| 29 | Waterproofing | waterproofing | Membrane $55/m² |
| 30 | Insulation | insulation | Ceiling batts $18/m², Wall $25/m² |

### 🏠 Roofing & Exterior
| # | Category | ID | Key Rates |
|---|---|---|---|
| 31 | Roofing — Re-Roof | roofing | Colorbond $120/m², Tile $95/m² |
| 32 | Roofing — Repairs | roof-repairs | Leak repair $450-$1,200 |
| 33 | Gutters & Fascia | gutters-fascia | Gutters $45/lm, Fascia $35/lm |
| 34 | Rendering | rendering | Cement $65/m², Acrylic $75/m² |
| 35 | Cladding | cladding | Weatherboard $110/m², Fibre cement $95/m² |

### 🪟 Doors, Windows & Joinery
| # | Category | ID | Key Rates |
|---|---|---|---|
| 36 | Windows & Doors | windows-doors | Window $850/unit, Door $650/unit |
| 37 | Brickwork & Masonry | brickwork | New $180/m², Repoint $65/m² |
| 38 | Cabinetry & Joinery | cabinetry | BIR $2,200, Custom $3,500 |

### 📡 Specialist
| # | Category | ID | Key Rates |
|---|---|---|---|
| 39 | Fire & Safety | fire-safety | Smoke alarms $150/unit |
| 40 | Accessibility / SDA | accessibility | Ramp $3,500, Grab rails $250/set |
| 41 | Heritage | heritage | Period features — varies |
| 42 | Acoustic | acoustic | Soundproofing $85/m² |
| 43 | Smart Home & Data | smart-home | CCTV $2,500, Intercom $1,800 |

## Category Data Structure
Each category object contains:
- `id`, `label`, `icon`, `group` — identification
- **`archetype`** — `'assembly' | 'trade' | 'element' | 'compliance'` (Phase 2). Drives UI behaviour and pricing model.
- **`dimensionMode`** — `'area' | 'linear' | 'wall' | 'room' | 'item' | 'roof' | 'none'` (Phase 2). Controls which dimension fields render in Details.
- **`usesParametric`** — boolean (Phase 2). When true, the BoQ unit picker is shown instead of generic stages.
- **`supportsPcItems`** — boolean (Phase 2). When false, the PC Items table is hidden.
- **`bundles`** — `string[]` of category IDs this category absorbs (Phase 2). Used by `getOverlapReason()` to mark child trades as "Already included".
- `questions[]` — dynamic scope questions shown in Step 2 (rendered by `CategoryQuestions.tsx`)
- `stages[]` — trade stages with base rates and unit types (area / linear / item / allow)
- `relations[]` — soft suggestions only (does NOT block or warn). Hard inclusion lives in `bundles`.
- `inclusions[]`, `exclusions[]`, `pcItems[]` — pre-filled defaults

### Phase 2 pilot categories (4 of 43 migrated to `catX()` with explicit archetype)
| Category | Archetype | Dimension Mode | Parametric | PC Items | Bundles |
|---|---|---|---|---|---|
| **Bathroom** | `assembly` | `area` | no | yes | `waterproofing`, `plumbing`, `tiling` |
| **Electrical** | `trade` | `none` | **yes** | no | — |
| **Internal Walls** | `element` | `wall` | no | no | — |
| **Fire & Safety** | `compliance` | `none` | no | no | — |

The remaining 39 categories still use the backwards-compatible `cat()` factory which infers archetype from `group`. Migrating them is the Phase 2 rollout — see `handover/13-phase-2-rollout.md`.

### Current notable question coverage
- **Bathroom** includes explicit selections for wall tile extent, tile finish level, vanity configuration, and fixture quality.
- **Toilet / WC** includes tile extent and toilet suite type selections.
- **Internal Walls** asks for type (stud / brick / double-stud) first, then surfaces only relevant dimensions.
- **Fire & Safety** asks for fitting type + count, no dimensions.
- These selections appear in the Details step and are previewed in the category info panel before adding the scope.

## Current File Structure
Categories are in 2 grouped files (keeping under 300 lines each):
- `src/utils/categories/core.ts` — 20 core categories
- `src/utils/categories/extended.ts` — 23 extended categories

**Note:** Fix #3 in `handover/09-required-fixes.md` tracks splitting these into 43 individual files.
