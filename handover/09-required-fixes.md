# 09 — Required Fixes

> **⚠️ STOP — CRITICAL RULES:**
> 1. **You do NOT have access to the code** — you MUST ask the user for files
> 2. **NEVER create from scratch** — ask "Please provide: [filename]" first
> 3. **READ before editing** — never overwrite without reading
> 4. **Pick ONE fix** — don't try to do all fixes at once
> 5. **UPDATE THIS DOC** — mark as ✅ done after completing
>
> **AI INSTRUCTION:** Read this module to see what's broken or incomplete. Ask the user for the files listed under each fix. Pick the fix you've been asked to do, request those files, then implement it. This is 1 of 13 modules — see `handover/00-index.md` for the full list.

---

## Other Modules You May Need
- Features (to understand context): `handover/03-features.md`
- File structure: `handover/02-file-structure.md`
- Feedback log (to update): `handover/08-feedback-log.md`

---

## Fix Status Overview

| # | Item | Priority | Status |
|---|---|---|---|
| 1 | ReportSendModal | High | ✅ DONE |
| 2 | Customer photos in report | High | ✅ DONE |
| 3 | Split 43 categories into individual files | Medium | ⏳ TODO |
| 4 | Builder View action log | Low | ✅ DONE |
| 5 | Accept All Recommended button | Low | ⏳ TODO |
| 6 | **Phase 2 rollout (Bathroom assembly model + dimension audit + scope separation + Rawlinsons rates + live recalc)** | **High** | 📋 **PLANNED — see `handover/13-phase-2-rollout.md`** |

---

## ✅ Completed Fixes

### Fix #1 — ReportSendModal ✅
**File:** `src/components/report/ReportSendModal.tsx`
- Multi-channel sender: Email (Gmail, Mail, Copy) + SMS/WhatsApp tabs
- Professional message with "view and download your quotation/variation"
- Wired into VariationReport header + CustomerView "Send to Customer" button

### Fix #2 — Customer Photos in Report ✅
**Files:** `src/components/report/CustomerViewParts.tsx` + `CustomerView.tsx`
- Progress photos grid with stage tags, captions, dates
- Photos appear after pricing totals, before T&Cs

### Fix #4 — Builder View Action Log ✅
**Files:** `src/components/report/BuilderView.tsx` + `VariationReport.tsx` + `App.tsx`
- Timestamped change log display with colour-coded badges
- Add Internal Note input with button
- Notes saved to variation's changeLog array

---

## ⏳ Remaining Fixes

### Fix #3 — Split 43 Categories Into Individual Files ⏳
**Priority:** Medium | **Effort:** Large (needs ~30 file operations)

**Current state:**
- 43 categories in 2 grouped files: `core.ts` (20) + `extended.ts` (23)
- Functionally correct — all categories work

**Target state:**
- 43 individual files in `src/utils/pricing/categories/` (one per trade)
- Each file: `wetAreas.ts`, `kitchen.ts`, `laundry.ts`, etc.
- Master `index.ts` that imports and re-exports all

**Files to request:**
- `src/utils/categories/types.ts` — category type definitions
- `src/utils/categories/core.ts` — current 20 core categories
- `src/utils/categories/extended.ts` — current 23 extended categories
- `src/utils/pricing/index.ts` — barrel exports
- `src/utils/pricing/scopeRecogniser.ts` — imports categories

**Steps:**
1. Create `src/utils/pricing/categories/` folder
2. Create individual files for each of the 43 categories
3. Create `src/utils/pricing/categories/index.ts` with ALL_CATEGORIES export
4. Update all imports in: `scopeRecogniser.ts`, `engine.ts`, `quoteDefaults.ts`, `ScopeStep.tsx`
5. Delete old `src/utils/categories/core.ts` and `extended.ts`
6. Keep `src/utils/categories/types.ts` (move or keep)
7. Update `handover/02-file-structure.md`

### Fix #5 — Accept All Recommended Button ⏳
**Priority:** Low | **Effort:** Small

**Current state:**
- Cross-category "auto" suggestions appear when scope is added
- Individual accept works, but "Accept All Recommended" is not prominent

**Target state:**
- Prominent green "Accept All Recommended" button above individual suggestions
- One click adds all auto-linked categories

**Files to request:**
- `src/components/variationBuilder/ScopeStep.tsx` — scope input UI
- `src/utils/categories/core.ts` — relatedCategories definitions

**Steps:**
1. In ScopeStep.tsx, find where cross-category suggestions are rendered
2. Add prominent green button at top: "✅ Accept All Recommended (X categories)"
3. On click, add all auto-linked categories to scopes
4. Button disappears after all are accepted

---

## How to Complete a Fix
1. Change status from ⏳ to ✅ DONE
2. Add implementation details under "Completed Fixes"
3. Update `handover/03-features.md` if feature was enhanced
4. Update `handover/08-feedback-log.md` with new entry
5. Update `handover/02-file-structure.md` if files were created/deleted
