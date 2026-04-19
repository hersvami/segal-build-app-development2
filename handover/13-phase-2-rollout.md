# 13 — Phase 2 Rollout Plan (Next Up — NOT YET IMPLEMENTED)

> **⚠️ STATUS — READ FIRST:**
> The work in this module is **PLANNED**, not built. The architectural foundation (archetypes, control flags, 4 pilot categories, informational overlap warnings) shipped in Phase 2.0 — see `handover/03-features.md` and `handover/04-pricing-categories.md`. Everything documented in this file is the **next execution batch**, agreed with the project owner. Do not mark anything here as ✅ until it has actually been built, tested, and committed.
>
> **AI INSTRUCTION:** Read this file when you have been asked to "execute Phase 2", "implement the bathroom assembly model", "do the dimension audit", or "wire Rawlinsons rates". Each step below is independently shippable. Do them in order. Do **one step per commit** — do not bundle. After each step, update `03-features.md`, `04-pricing-categories.md`, and `08-feedback-log.md`. This is 1 of 14 modules — see `handover/00-index.md` for the full list.

---

## Other Modules You May Need
- Current architectural foundation (already done): `handover/03-features.md` Phase 2.0 section
- Category data structure (archetype, dimensionMode, bundles, etc.): `handover/04-pricing-categories.md`
- Type surface (CategoryArchetype, ProjectBaseline, ParametricItem): `handover/06-data-types.md`
- Outstanding fixes superseded by this rollout: `handover/09-required-fixes.md`
- Feedback items 40–44 (the source of this plan): `handover/08-feedback-log.md`

## Files To Request
Different files per step — each step below lists exactly what to ask the user for. Do not request files for steps you are not currently doing.

---

## The Bathroom Problem (the reasoning behind this plan)

A "Bathroom" is just a label for a collection of trades. To avoid double-ups and ensure professional pricing:

1. The **Bathroom** category becomes a **Room Assembly**. It does not have its own generic stages anymore. Instead it asks **room-level** questions: floor area, wall area, vanity points, fixture quality, tile extent.
2. The assembly then **pushes those quantities into the bundled trade categories** (Plumbing, Tiling, Waterproofing). Those trades are priced once, by the assembly, using Rawlinsons-style unit rates.
3. If you then add a **standalone Electrical** category, it is for **extra work outside the bathroom** (e.g. rewiring the bedroom or garage) — never for the bathroom's own electrical fit-off, which is already inside the assembly.

This same model applies to every "room" category: **Kitchen, Laundry, Toilet/WC, Granny Flat, Extension, New Home Build, Multi-Unit, Upper Storey Extension**.

---

## Phase 2 Execution Plan — 6 ordered steps

Each step is **one commit**. The owner tests after each step before the next begins.

### Step 1 — Add `archetype` flag to all 43 categories

**Goal:** Every category declares its archetype explicitly via `catX()`. No more inference fallback for production data.

**Status:** 4 of 43 done (Bathroom, Electrical, Internal Walls, Fire & Safety). 39 remaining.

**Suggested archetype mapping:**

| Archetype | Categories |
|---|---|
| **assembly** (room recipes) | Bathroom ✅, Kitchen, Laundry, Toilet/WC, Granny Flat, New Home Build, Extensions, Upper Storey Extension, Multi-Unit |
| **trade** (single discipline, parametric) | Electrical ✅, Plumbing, Tiling (when standalone), Painting, Carpentry, Concreting, Roofing, Waterproofing, HVAC, Demolition |
| **element** (one buildable thing, type-first) | Internal Walls ✅, Cladding, Decking, Fencing, Windows & Doors, Pergola, Retaining Walls, Steel Framing, Brickwork, Insulation, Cabinetry, Rendering, Gutters & Fascia, Roof Repairs, Paving, Pool & Spa, Landscaping, Underpinning |
| **compliance** (count-only) | Fire & Safety ✅, Accessibility/SDA, Smart Home & Data, Acoustic, Heritage |

**Files to request:**
- `src/utils/categories/types.ts`
- `src/utils/categories/core.ts`
- `src/utils/categories/extended.ts`

**Acceptance:**
- Every category in both files calls `catX()` with explicit archetype.
- No category relies on `cat()` inference for production data.
- `npm run build` clean.
- Spot-check: pick any 3 categories and confirm archetype + dimensionMode match the table above.

---

### Step 2 — Strict Dimension Audit

**Goal:** Each category only asks for the dimensions that make physical sense.

**Required fixes:**
- **Internal Walls:** Length × Height. **Width removed** (it's a stud frame).
- **Electrical / Fire & Safety / Smart Home / Smoke Alarms / Plumbing fixtures:** **Quantity-based** — no dimensions at all.
- **Cladding / Rendering / Painting (walls):** Length × Height + type/material selection first.
- **Tiling:** Area in m² (floor) and Area in m² (wall) — separate fields.
- **Fencing / Gutters / Skirting / Pipe runs:** Lineal metres only.
- **Roofing:** Roof footprint area (m²) — different from floor area.
- **Smoke Alarm / Grab Rail / Fire Door:** Count + spec — no dimensions ever.
- **Decking / Concreting / Paving:** Area in m².
- **Windows & Doors:** Count + size class.

**Files to request:**
- `src/utils/categories/core.ts`
- `src/utils/categories/extended.ts`
- `src/components/variationBuilder/Editors.tsx` (already has `renderDimensions()` switch — verify it covers every `dimensionMode`)

**Acceptance:**
- Add a Smoke Alarm scope → no width/length/height fields appear.
- Add an Internal Wall → only Length × Height shown.
- Add Cladding → type selector first, then Length × Height.
- `npm run build` clean.

---

### Step 3 — Bathroom (and all assemblies) push quantities into bundled trades

**Goal:** The assembly's room-level answers become the trade quantities. No double-up, no manual entry of plumbing/tiling lines for the bathroom.

**Behaviour:**
- Bathroom asks: floor area (m²), wall tile extent (shower-only / 1200mm / 2100mm / floor-to-ceiling), vanity points, fixture quality (standard / mid / premium).
- The assembly's `derivePricing(answers, baseline)` function emits a BoQ line per bundled trade:
  - `tiling` → m² of wall tile (calculated from extent × room perimeter × ceiling height) + m² of floor tile
  - `waterproofing` → m² (floor + shower walls to relevant height)
  - `plumbing` → fixture-point count (vanity + toilet + shower + bath)
  - electrical fit-off → fixture count from fixture quality (lights + exhaust + heated rail if premium)
- When Bathroom is in the project, the suggestions list **hides** Plumbing/Waterproofing/Tiling cards and shows a small **"Add additional [trade] outside this room"** button for users who genuinely need extra trade scope elsewhere.
- Standalone Electrical / Plumbing added as separate scopes are clearly labelled **"Additional to [Bathroom]"** in the BoQ.

**Files to request:**
- `src/utils/categories/core.ts` (Bathroom block)
- `src/components/variationBuilder/ScopeStep.tsx` (suggestions filter)
- `src/components/variationBuilder/CategoryCard.tsx` (Add Anyway → "Add additional" button text variant)
- `src/utils/pricing/engine.ts` (assembly pricing path)
- New file: `src/utils/pricing/assemblyPricing.ts` (room-level answers → trade BoQ lines)

**Acceptance:**
- Add Bathroom → Plumbing/Tiling/Waterproofing disappear from the suggestions list.
- A "Add additional trade scope" button is visible.
- Picking "floor-to-ceiling tiles" in Details visibly recalculates the tiling line item m².
- Picking "premium" fixtures bumps the plumbing fixture allowance.
- Adding Plumbing afterward labels it "Additional to Bathroom" in the review.

---

### Step 4 — Project Scope vs Category Scope separation

**Goal:** Two distinct scope fields, two distinct purposes.

**Project Scope (global, one per variation):**
- The big AI-polished narrative.
- Stored on the variation root (or `ProjectBaseline`).
- Persisted across the whole builder flow — never cleared when adding categories.
- Rendered with markdown formatting (headings, bullets, bold) in the customer-facing quote document.
- Editable in a large textarea at the top of the Details step.

**Category Scopes (one per added scope):**
- Short, professional, trade-specific description.
- Auto-generated from the category answers — for example *"Supply and install 90mm pine stud framing to internal walls — 12 lm × 2.4m height. Includes top/bottom plates, noggins, and fixings to AS1684."*
- Editable in a generously-sized textarea (5–8 rows minimum).
- Appears as a line item heading on the customer quote.

**Files to request:**
- `src/types/domain.ts` (add `projectScope: string` to Variation or Baseline; rename existing scope text fields to `categoryScope`)
- `src/components/variationBuilder/builderDraft.ts` (persist projectScope across the whole builder flow)
- `src/components/variationBuilder/Editors.tsx` (large textarea for categoryScope)
- `src/components/variationBuilder/PricingStep.tsx` or `ReviewStep.tsx` (project-scope textarea at top)
- `src/components/report/CustomerView.tsx` (render markdown projectScope above line items)
- `src/utils/pricing/categoryScopeWriter.ts` — **new file** — generates the category scope sentence from answers (one writer function per archetype).

**Acceptance:**
- AI-polished scope survives navigating Project → Scope → Details → Pricing → Review without being copied into every category.
- Adding Internal Walls auto-generates a category scope sentence including the chosen type, length, and height.
- Customer view renders the project scope as formatted markdown at the top.

---

### Step 5 — Rawlinsons unit rate audit

**Goal:** Every parametric unit in `parametricUnits.ts` carries a realistic 2025 Australian rate aligned with Rawlinsons Construction Cost Guide methodology (labour-hour × hourly rate + material × waste factor).

**Indicative target rates (verify against current Rawlinsons edition before merging):**

| Trade | Unit | Rate |
|---|---|---|
| Electrical | per point (GPO/light) | ~$110–$120 |
| Electrical | switchboard upgrade | ~$2,200–$2,800 |
| Plumbing | per fixture point (rough-in + fit-off) | ~$1,200–$1,500 |
| Plumbing | hot water system (gas storage) | ~$2,500 |
| Tiling | wall tile supply + lay | ~$140–$160/m² |
| Tiling | floor tile supply + lay | ~$150–$170/m² |
| Waterproofing | membrane + cert | ~$55–$75/m² |
| Painting | interior 2-coat | ~$18–$22/m² |
| Painting | exterior 2-coat | ~$22–$28/m² |
| Carpentry | stud framing | ~$85/m² wall area |
| Carpentry | skirting + architrave | ~$28–$35/lm |
| Demolition | internal soft strip | ~$150–$180/m² |
| Concreting | slab | ~$110/m² |

**Methodology rules:**
- Rates are **defaults**, marked **"Verify against your current Rawlinsons edition or supplier quote"** in the UI.
- Every rate is editable per-company and saved to `localStorage`.
- Rate cards in the BoQ unit picker show breakdown: `labour ($/hr × hours) + material ($/unit × waste)`.

**Files to request:**
- `src/utils/pricing/parametricUnits.ts`
- `src/utils/pricing/baselineMultipliers.ts` (verify scaffolding/access rates)
- `src/components/variationBuilder/ParametricEditor.tsx` (add labour/material breakdown display)

**Acceptance:**
- Every parametric unit has a non-zero, realistic rate.
- Tooltip / info popover on each unit shows labour vs material split.
- Rates can be overridden per-company without code changes.

---

### Step 6 — Assembly questions drive bundled-trade quantities (live)

**Goal:** Changing an assembly answer in Details visibly updates the price in real time, because the bundled trades' quantities are recalculated from the answers.

**Example:**
- User adds Bathroom 4×3m, picks "1200mm tile". Tiling line shows ~17 m² of wall tile.
- User changes to "Floor-to-ceiling". Tiling line jumps to ~36 m² instantly. Total updates.
- User changes fixture quality from Standard to Premium. Plumbing fixture rate bumps from $1,200 to $1,500/point. Total updates.

**Files to request:**
- `src/utils/pricing/assemblyPricing.ts` (created in Step 3)
- `src/utils/pricing/engine.ts`
- `src/components/variationBuilder/Editors.tsx`
- `src/components/variationBuilder/PricingStep.tsx`
- `src/components/variationBuilder/ReviewStep.tsx`

**Acceptance:**
- Edit any assembly answer in Details → see the BoQ recalculate without a manual save.
- Review step shows the same numbers as Details.
- `npm run build` clean.

---

## Cross-cutting rules for all 6 steps

1. **Files stay under 300 lines.** If a file would exceed that, split it before merging.
2. **One step per commit.** Do not bundle steps.
3. **Update handover after every step.** `03-features.md`, `04-pricing-categories.md`, `06-data-types.md` (if types change), and `08-feedback-log.md` (mark items 40–44 as ✅ as they are completed).
4. **Build clean.** `npm run build` must pass before declaring a step done.
5. **Test the pilot before rolling out.** Step 1 covers all 43 categories, but for Step 3 (assembly logic) and Step 6 (live recalc), pilot Bathroom only first, get owner sign-off, then roll out to Kitchen / Laundry / Toilet / Granny Flat / Extension / etc.
6. **Never silently mark anything done.** If a step is partially complete, mark it 🟡 Partial and list what is left.
