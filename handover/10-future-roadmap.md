# 10 — Future Roadmap

> **⚠️ STOP — CRITICAL RULES:**
> 1. **You do NOT have access to the code** — you MUST ask the user for files
> 2. **NEVER create from scratch** — ask "Please provide: [filename]" first
> 3. **READ before editing** — never overwrite without reading
> 4. **UPDATE DOCS** — after completing, update `03-features.md` and this doc
>
> **AI INSTRUCTION:** Read this module to understand planned features. Ask the user for files listed under each feature. This is 1 of 13 modules — see `handover/00-index.md` for the full list.

---

## Other Modules You May Need
- Current features: `handover/03-features.md`
- Data types: `handover/06-data-types.md`
- Known issues: `handover/11-known-issues.md`

## Files To Request
- Depends on which feature — each item below lists the relevant files

---

## High Priority

| Feature | Description | Effort | Files To Request |
|---|---|---|---|
| **Phase 2 Rollout** | Bathroom Room-Assembly model + dimension audit + Project/Category scope split + Rawlinsons rate audit + live recalc | **Large** | **See `handover/13-phase-2-rollout.md` — full step-by-step plan** |
| Firebase Firestore | Migrate from localStorage to cloud database | Large | `src/logic/state.ts`, `src/types/appState.ts` |
| Authentication | User login, role-based access (builder vs customer) | Large | `src/App.tsx`, `src/logic/state.ts` |
| Customer Portal | Separate view for customers to view/approve quotes online | Large | `src/components/report/CustomerView.tsx`, `src/App.tsx` |
| PDF Export | Generate downloadable PDF quotes and variations | Medium | `src/components/report/CustomerView.tsx`, `src/components/report/BuilderView.tsx` |

## Medium Priority

| Feature | Description | Effort | Files To Request |
|---|---|---|---|
| CPI Auto-Escalation | ABS quarterly construction index for rate updates | Medium | `src/utils/categories/core.ts`, `src/utils/categories/extended.ts` |
| Builder Rate Overrides | Save custom rates per company, per trade | Medium | `src/utils/pricing/engine.ts`, `src/logic/state.ts` |
| Photo Storage | Firebase Storage or Cloudinary for persistent photos | Medium | `src/utils/services.ts`, `src/components/PhotoCapture.tsx` |
| Variation Cost Tracking | Running total across all variations vs original quote | Medium | `src/components/report/BuilderView.tsx`, `src/types/domain.ts` |
| Offline Mode | Service worker for field use without internet | Medium | `vite.config.ts`, `src/App.tsx` |

## Low Priority

| Feature | Description | Effort | Files To Request |
|---|---|---|---|
| Gemini Rate Check | AI button to validate current market rates | Low | `src/utils/services.ts` |
| Template Saving | Save frequently used scope combinations | Low | `src/logic/state.ts`, `src/types/domain.ts` |
| Multi-User | Multiple builders per company | Medium | `src/logic/state.ts`, `src/constants/companies.ts` |
| Notification System | Push notifications for quote approvals | Low | New service worker file |
| Xero/MYOB Integration | Accounting software integration | Large | New integration module |

## Customer Portal Vision
When implemented, the customer portal will:
1. Use the URL from welcome message (https://segal-build-app.web.app/portal)
2. Customer logs in with email + temp password
3. Can view: active quotes, variations, progress photos
4. Can: approve quotes, request changes, view documents
5. Cannot: see builder costs, overhead, profit margins
6. Get: real-time notifications when quotes/updates are sent
