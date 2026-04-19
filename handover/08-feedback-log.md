# 08 — Feedback Log

> **⚠️ STOP — READ THIS BEFORE DOING ANYTHING:**
> 1. **You do NOT have access to the code** — you MUST ask the user for files
> 2. **READ THIS FIRST** — contains all past decisions and mistakes
> 3. **DO NOT REPEAT** — check here before implementing anything
> 4. **ADD NEW FEEDBACK** — if user gives new feedback, add it to this log
>
> **AI INSTRUCTION:** Read this module BEFORE implementing anything. This log contains every piece of user feedback from past sessions. This is 1 of 13 modules — see `handover/00-index.md` for the full list.

---

## Other Modules You May Need
- Required fixes: `handover/09-required-fixes.md`
- Features: `handover/03-features.md`

## Files To Request
- Only request files relevant to the specific feedback item you're investigating

---

## All Feedback Items

| # | Session | Feedback | Status | Implementation |
|---|---|---|---|---|
| 1 | 1 | Build module by module, report progress | ✅ Done | Systematic rollout documented |
| 2 | 1 | Files must stay under 300 lines | ✅ Done | All files verified under 300 lines |
| 3 | 1 | Is there upper storey extension? | ✅ Done | Created in structuralExtensions category |
| 4 | 1 | Implement Gemini AI service | ✅ Done | services.ts with free model cascade |
| 5 | 1 | Implement Cloudinary image upload | ✅ Done | services.ts + PhotoCapture component |
| 6 | 1 | Customer gets photos in reports? | ✅ Done | CustomerViewParts.tsx shows photos in report |
| 7 | 1 | Quote vs Variation separation | ✅ Done | Separate documentTypes, QTE/VAR badges, gating |
| 8 | 1 | Variation for external/non-app job | ✅ Done | ExternalQuoteModal for baseline linking |
| 9 | 2 | Save all work in environment for testing | ✅ Done | All files verified present, build tested |
| 10 | 2 | Welcome message needs portal login details | ✅ Done | Portal URL, login email, temp password |
| 11 | 2 | Welcome message via SMS/WhatsApp too | ✅ Done | 5-channel: Gmail, Mail, Copy, WhatsApp, SMS |
| 12 | 2 | Message should say download/view quotation | ✅ Done | Professional text with view/download language |
| 13 | 2 | Hero photo upload on project creation | ✅ Done | PhotoCapture in ProjectForm + banner display |
| 14 | 2 | Gemini should be free only | ✅ Done | Removed Pro model, free-only cascade |
| 15 | 2 | Gemini model fallback chain | ✅ Done | Flash → Lite → 1.5 → 2.0 → keyword |
| 16 | 2 | Handover too big, split into indexed sub-files | ✅ Done | handover/ folder with 12 sub-files |
| 17 | 2 | Update master handover as we go | ✅ Done | Maintained in handover/ folder |
| 18 | 2 | ReportSendModal missing (from audit) | ✅ Done | Created with multi-channel sending |
| 19 | 2 | Customer photos in report missing (from audit) | ✅ Done | CustomerViewParts.tsx + CustomerView updated |
| 20 | 2 | Gemini API key instructions with link | ✅ Done | In ScopeStep + handover/05-ai-gemini.md |
| 21 | 2 | Which handover structure is better | ✅ Done | Migrated to handover/ with hybrid structure |
| 22 | 3 | How to Use instructions must be first thing read | ✅ Done | Added to 00-index.md as first section |
| 23 | 3 | Remove obsolete/duplicate files | ✅ Done | Deleted cn.ts (duplicate of helpers.ts) |
| 24 | 3 | New features must have handover modules | ✅ Done | Rule added to 00-index.md |
| 25 | 3 | Check audit section by section against handover | ✅ Done | Full audit in 09-required-fixes.md |
| 26 | 3 | Fix #4: Builder View action log not saved | ✅ Done | BuilderView rewritten with log + note input |
| 27 | 3 | Handover modules should be self-contained AI prompts | ✅ Done | All 12 modules rewritten with explicit instructions |
| 28 | 4 | Each module must assume AI has NO code access | ✅ Done | All modules say "ask user for files", list exact files |
| 29 | 4 | Include module for final AI to combine everything | ✅ Done | Created `handover/12-final-assembly.md` with 9-phase build |
| 30 | 4 | Each module must reference other modules exist | ✅ Done | All modules have "Other Modules You May Need" + "1 of 13" |
| 31 | 5 | Bigger scope window (multi-line auto-expanding) | ✅ Done | `ScopeStep.tsx` textarea 3–10 rows |
| 32 | 5 | API key must be remembered across sessions | ✅ Done | `localStorage` key `segal:geminiApiKey` + restored badge + cross-tab `storage` sync |
| 33 | 5 | Project Baseline (size / storeys / access) before scopes | ✅ Done | `BaselineStep.tsx` + `baselineMultipliers.ts` |
| 34 | 5 | Parametric / Rawlinsons-style unit pricing | 🟡 Partial | Scaffolded in `parametricUnits.ts` for Electrical; full rate audit + rollout queued in `13-phase-2-rollout.md` |
| 35 | 5 | "Recognise Categories" button does nothing visible | ✅ Done | Now shows "Found N matches — top: …" / "No clear matches" pill |
| 36 | 5 | Bathroom didn't auto-pull bundled trades | ✅ Done | BFS auto-walk of `relations.type === 'auto'`; explicit `bundles` array on Bathroom |
| 37 | 5 | No way to expand a category to see what's inside | ✅ Done | `CategoryInfoPanel.tsx` shows stages, PC items, inclusions, exclusions, related categories |
| 38 | 5 | Internal Walls falsely locked Electrical | ✅ Done | `getOverlapReason()` rewritten to read only `bundles` (not loose `relations`) |
| 39 | 5 | Add button hard-disabled when warning shown | ✅ Done | Button never disabled; turns amber **"Add Anyway"** instead |
| 40 | 6 | Bathroom = label for trades; treat as Room Assembly | 📋 Planned | Documented as Phase 2 in `handover/13-phase-2-rollout.md` |
| 41 | 6 | Strict dimension audit (no width on smoke alarm etc.) | 📋 Planned | Phase 2 step 2 — see `handover/13-phase-2-rollout.md` |
| 42 | 6 | Project Scope vs Category Scope separation | 📋 Planned | Phase 2 step 4 — see `handover/13-phase-2-rollout.md` |
| 43 | 6 | Realistic Rawlinsons unit rates across all parametric units | 📋 Planned | Phase 2 step 5 — see `handover/13-phase-2-rollout.md` |
| 44 | 6 | Assembly questions must drive bundled-trade quantities | 📋 Planned | Phase 2 step 6 — see `handover/13-phase-2-rollout.md` |

## How to Update This Log
When the user gives new feedback:
1. Add a row with the next number and current session
2. Set status to ⏳ while working, ✅ when done
3. Reference the fix number from `09-required-fixes.md` if applicable
4. Update any related module (features, known issues, etc.)
