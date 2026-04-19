# 02 — File Structure

> **⚠️ STOP — CRITICAL RULES:**
> 1. **You do NOT have access to the code** — you MUST ask the user for files
> 2. **NEVER create from scratch** — ask "Please provide: [filename]" first
> 3. **READ before editing** — never overwrite without reading
> 4. **Only work on files in your task scope** — don't touch unrelated files
> 5. **UPDATE THIS DOCUMENT** — if you create/delete a file, add/remove it here
>
> **AI INSTRUCTION:** This module lists every file in the project. Use this to know which files to ASK THE USER for when working on a specific area.

---

## Other Modules You May Need
- What features exist: `handover/03-features.md`
- Data types: `handover/06-data-types.md`
- This is 1 of 13 modules — see `handover/00-index.md` for the full list

## Files To Request
- Request files based on the section below that matches your task
- For the full app: see `handover/12-final-assembly.md`

---

## Root Files
| File | Purpose |
|---|---|
| `index.html` | Entry HTML with Segal Build title |
| `firebase.json` | Firebase hosting config with no-cache headers |
| `.firebaserc` | Links to Firebase project: segal-build-app |
| `package.json` | Dependencies and scripts |
| `vite.config.ts` | Vite config with singlefile plugin |
| `tsconfig.json` | TypeScript configuration |
| `README.md` | Entry point — points to handover/00-index.md |

## Source Files

### Entry Points — request these to understand app bootstrap
| File | Purpose |
|---|---|
| `src/main.tsx` | React DOM entry point |
| `src/index.css` | Tailwind CSS v4 import |
| `src/App.tsx` | **Main app** — routing, state, project/variation management (~280 lines) |

### Types — request these to understand data shapes
| File | Purpose |
|---|---|
| `src/types/domain.ts` | All data types: Project, Variation, QuoteScope, PCItem (~155 lines) |
| `src/types/appState.ts` | Application state shape (~15 lines) |

### Constants — request these for company/business config
| File | Purpose |
|---|---|
| `src/constants/companies.ts` | Company configs: Segal Build + Segval (~45 lines) |

### Logic — request these for state management
| File | Purpose |
|---|---|
| `src/logic/state.ts` | localStorage persistence, project CRUD, variation management (~120 lines) |

### Utilities — request these for shared functions
| File | Purpose |
|---|---|
| `src/utils/helpers.ts` | UUID generator, currency formatter, export (~50 lines) |
| `src/utils/services.ts` | Gemini AI (free cascade), Cloudinary upload (~200 lines) |

### Categories — request these for construction trade data
| File | Purpose |
|---|---|
| `src/utils/categories/types.ts` | **Phase 2** — `CategoryArchetype` + `cat()` (backwards-compat, infers archetype) + `catX()` (explicit archetype) + control flag defaults (~155 lines) |
| `src/utils/categories/core.ts` | 20 core categories. **Bathroom** + **Electrical** migrated to `catX()` with explicit archetypes (~315 lines) |
| `src/utils/categories/extended.ts` | 23 extended categories. **Internal Walls** + **Fire & Safety** migrated to `catX()` with explicit archetypes (~300 lines) |
| `src/utils/categories/categoryTypeOptions.ts` | Material/type option lists per category (used by TypeSelector) (~145 lines) |

### Pricing — request these for quote calculation logic
| File | Purpose |
|---|---|
| `src/utils/pricing/types.ts` | StageTemplate, SolutionTemplate types (~30 lines) |
| `src/utils/pricing/constants.ts` | Trade markers, overhead rates (~40 lines) |
| `src/utils/pricing/engine.ts` | Solution generator + scope-total helpers (~120 lines) |
| `src/utils/pricing/quoteCalculator.ts` | OH + Profit + Contingency + GST calculation (~60 lines) |
| `src/utils/pricing/quoteDefaults.ts` | Pre-filled PC items, inclusions, exclusions (~100 lines) |
| `src/utils/pricing/scopeRecogniser.ts` | Keyword + AI scope classification (~80 lines) |
| `src/utils/pricing/parametricUnits.ts` | **Phase 1** — Rawlinsons-style unit-rate library (per point/per lm/per item). Currently rolled out for Electrical (~75 lines). See `handover/13-parametric-pricing.md` |
| `src/utils/pricing/baselineMultipliers.ts` | **Phase 1** — Project baseline → scaffolding cost + site access labour multiplier (~70 lines) |
| `src/utils/pricing/index.ts` | Barrel exports (~30 lines) |

### Components — request these for UI work
| File | Purpose |
|---|---|
| `src/components/Sidebar.tsx` | Left panel — company logo, switcher, project list (~150 lines) |
| `src/components/WelcomeScreen.tsx` | Landing page with company branding (~80 lines) |
| `src/components/ProjectForm.tsx` | New project form with hero photo (~125 lines) |
| `src/components/ProjectChat.tsx` | Internal notes + contact customer (~100 lines) |
| `src/components/LoadingSpinner.tsx` | Reusable spinner (~15 lines) |
| `src/components/PhotoCapture.tsx` | Shared Upload/Take Photo component (~130 lines) |
| `src/components/SendWelcomeEmailModal.tsx` | 5-channel welcome message sender (~280 lines) |
| `src/components/ExternalQuoteModal.tsx` | External quote baseline for non-app jobs (~120 lines) |
| `src/components/VariationBuilder.tsx` | 5-step wizard: Project Baseline → Scope → Details → Pricing → Review. Holds bundled-trade lockout logic (`getBundledIds`), recognise feedback, AI key restored detection, cross-tab storage sync (~280 lines) |
| `src/components/welcomeMessages.ts` | Email + SMS message builders (~135 lines) |

### Variation Builder Sub-Components
| File | Purpose |
|---|---|
| `src/components/variationBuilder/BaselineStep.tsx` | **Phase 1** — Project Baseline step (total area, storeys, site access) (~140 lines) |
| `src/components/variationBuilder/CategoryInfoPanel.tsx` | Expandable "What's inside this category?" panel (questions, stages, PC items, inclusions, exclusions, related) (~150 lines) |
| `src/components/variationBuilder/CategoryCard.tsx` | Detected / suggested category card with Add/Remove CTA + info panel (~95 lines) |
| `src/components/variationBuilder/AddedScopesPanel.tsx` | Scope-step review of already-added scopes (~75 lines) |
| `src/components/variationBuilder/ScopeStep.tsx` | Step 2 — large scope textarea, detected-category cards, persistent related-category cards, category browser (~270 lines) |
| `src/components/variationBuilder/Editors.tsx` | ScopeDetailEditor (description, questions, dimensions, stages, parametric, lists) (~220 lines) |
| `src/components/variationBuilder/CategoryQuestions.tsx` | Renders category-specific questions in Details (tile extent, vanity type, etc.) (~70 lines) |
| `src/components/variationBuilder/ParametricEditor.tsx` | Bill-of-Quantities unit picker (per point/per lm) (~145 lines) |
| `src/components/variationBuilder/EditableList.tsx` | Shared editable Inclusion / Exclusion list (~85 lines) |
| `src/components/variationBuilder/PCItemEditor.tsx` | PC items table with add/remove (~55 lines) |
| `src/components/variationBuilder/DimensionInput.tsx` | Numeric m / lm input (~20 lines) |
| `src/components/variationBuilder/PricingStep.tsx` | Extracted pricing-step UI (~55 lines) |
| `src/components/variationBuilder/ReviewStep.tsx` | Extracted review-step UI (~70 lines) |
| `src/components/variationBuilder/builderDraft.ts` | Builder draft load/save/clear helpers for local persistence (~60 lines) |
| `src/components/variationBuilder/createScopeFromCategory.ts` | Scope factory with category-question defaults + quote defaults (~30 lines) |

### Report Components — request these for report/output work
| File | Purpose |
|---|---|
| `src/components/report/VariationReport.tsx` | 3-tab container: Builder / Customer / Progress (~145 lines) |
| `src/components/report/BuilderView.tsx` | Cost transparency, sliders, action log (~176 lines) |
| `src/components/report/CustomerView.tsx` | Professional quote with letterhead, T&Cs (~170 lines) |
| `src/components/report/CustomerViewParts.tsx` | Extracted: progress photos grid, scope sections (~120 lines) |
| `src/components/report/ProgressHub.tsx` | Photo upload, stage tracker, progress updates (~215 lines) |
| `src/components/report/ReportSendModal.tsx` | Multi-channel report sender (~244 lines) |

### Handover Documentation
| File | Purpose |
|---|---|
| `handover/00-index.md` | Master index — read first |
| `handover/01-overview.md` | Tech stack, companies, rules |
| `handover/02-file-structure.md` | This file |
| `handover/03-features.md` | All features with status |
| `handover/04-pricing-categories.md` | 43 categories |
| `handover/05-ai-gemini.md` | AI model cascade |
| `handover/06-data-types.md` | TypeScript types |
| `handover/07-deployment.md` | Build, Firebase |
| `handover/08-feedback-log.md` | User feedback |
| `handover/09-required-fixes.md` | Outstanding fixes |
| `handover/10-future-roadmap.md` | Planned features |
| `handover/11-known-issues.md` | Technical debt |
| `handover/12-final-assembly.md` | Build complete app from all modules |
