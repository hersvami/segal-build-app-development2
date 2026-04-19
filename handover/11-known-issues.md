# 11 — Known Issues & Technical Debt

> **⚠️ STOP — CRITICAL RULES:**
> 1. **You do NOT have access to the code** — you MUST ask the user for files
> 2. **NEVER create from scratch** — ask "Please provide: [filename]" first
> 3. **READ before editing** — never overwrite without reading
> 4. **REMOVE FIXED ISSUES** — if you fix something, delete it from this list
>
> **AI INSTRUCTION:** Read this module to understand current limitations before implementing changes. Ask the user for files listed in each issue. This is 1 of 13 modules — see `handover/00-index.md` for the full list.

---

## Other Modules You May Need
- Required fixes: `handover/09-required-fixes.md`
- Deployment troubleshooting: `handover/07-deployment.md`

## Files To Request
- Only request files relevant to the specific issue you're investigating

---

## Current Limitations
| Issue | Impact | Workaround | Files Involved |
|---|---|---|---|
| localStorage only | Data lost if browser cleared | Export projects as JSON regularly | `src/logic/state.ts` |
| No authentication | Anyone with URL can access | Deploy behind company VPN | `src/App.tsx` |
| Photos as base64 | Large photos bloat localStorage | Configure Cloudinary env vars | `src/utils/services.ts`, `src/components/PhotoCapture.tsx` |
| No PDF export | Customers must view quotes in browser | Print to PDF from browser | `src/components/report/CustomerView.tsx` |
| ~~Gemini key not persisted~~ | ✅ **FIXED** in Phase 1 — key stored in `localStorage` (`segal:geminiApiKey`), restored on mount with "Restored from previous session" badge, cross-tab sync via `storage` event | n/a | `src/components/variationBuilder/ScopeStep.tsx`, `src/components/VariationBuilder.tsx` |
| No offline mode | Requires internet for AI features | Keyword fallback works offline | `src/utils/services.ts` |
| Company logos from GitHub | May break if repo goes private | Host logos on Firebase Storage | `src/constants/companies.ts` |

## Technical Debt
| Item | Details | Files Involved |
|---|---|---|
| Category file structure | 43 categories in 2 files vs 43 individual files | `src/utils/categories/core.ts`, `extended.ts` |
| Merged utility files | helpers.ts and services.ts combine multiple concerns | `src/utils/helpers.ts`, `src/utils/services.ts` |
| State management | Single useState + localStorage; consider useReducer or Zustand | `src/logic/state.ts` |
| No error boundaries | App crashes on unexpected errors | `src/App.tsx` |
| No unit tests | No test coverage for pricing engine or calculator | `src/utils/pricing/` |
| No CI/CD | Manual build and deploy process | `package.json` |

## Browser Compatibility
| Browser | Status |
|---|---|
| Chrome 90+ | ✅ Fully supported |
| Firefox 90+ | ✅ Fully supported |
| Safari 15+ | ✅ Supported (camera capture may vary) |
| Edge 90+ | ✅ Fully supported |
| Mobile Chrome | ✅ Supported (camera capture works) |
| Mobile Safari | ⚠️ Camera capture may require HTTPS |

## localStorage Limits
- Chrome: 10MB per origin
- Firefox: 10MB per origin
- Safari: 5MB per origin
- **Recommendation:** Migrate to Firestore before exceeding ~3MB of project data
- **Check usage:** `JSON.stringify(localStorage).length` in browser console
