# 12 — Final Assembly

> **⚠️ STOP — THIS IS THE FINAL ASSEMBLY MODULE. READ EVERY WORD BEFORE DOING ANYTHING:**
>
> **CRITICAL RULES — DO NOT IGNORE:**
> 1. **You do NOT have access to the code** — you MUST ask the user for every file
> 2. **NEVER create files from scratch** — always ask "Please provide: [filename]" first
> 3. **READ each file before editing** — never overwrite without reading the existing content
> 4. **ASK for files in the exact order below** — Phase 1, then Phase 2, etc.
> 5. **BUILD after each phase** — verify it compiles before moving to the next phase
> 6. **If a file already exists, READ it first** — don't recreate, just update if needed
> 7. **Only touch files listed in each phase** — don't create extra files
>
> **AI INSTRUCTION:** This module tells you how to build the COMPLETE Segal Build application. You must ask the user to provide files from each module, then combine them into a working app. Follow the assembly order below exactly.

---

## What This Module Is For
If the app needs to be rebuilt from scratch, or if you are a new AI that has never seen the code, this module tells you:
1. What order to request files
2. How the files connect
3. How to verify each module works before moving on

## Other Modules — You MUST Read These
This is the orchestration module. Every other module contains the actual specifications:

| Order | Module | What It Gives You |
|---|---|---|
| 1st | `handover/01-overview.md` | Tech stack, rules, companies |
| 2nd | `handover/06-data-types.md` | All TypeScript types |
| 3rd | `handover/02-file-structure.md` | Complete file inventory |
| 4th | `handover/04-pricing-categories.md` | 43 construction categories with rates |
| 5th | `handover/05-ai-gemini.md` | AI model cascade (free only) |
| 6th | `handover/03-features.md` | All features with implementation details |
| 7th | `handover/07-deployment.md` | Build and deploy instructions |
| 8th | `handover/08-feedback-log.md` | Past decisions — do NOT repeat mistakes |
| 9th | `handover/09-required-fixes.md` | Outstanding bugs to fix |

---

## Assembly Order (Build in this exact sequence)

### Phase 1: Foundation
**Ask user for these files:**
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `index.html`
- `src/main.tsx`
- `src/index.css`

**What you're building:** The project skeleton. Install dependencies, configure Vite with singlefile plugin, set up Tailwind CSS v4.

**Verify:** `npm install` succeeds.

---

### Phase 2: Types & Constants
**Ask user for these files:**
- `src/types/domain.ts`
- `src/types/appState.ts`
- `src/constants/companies.ts`

**What you're building:** All data shapes. Project, Variation, QuoteScope, QuotePricing, Company configs.

**Key rules:**
- `Variation.documentType` must be `'quote' | 'variation'` — these are SEPARATE workflows
- `ProjectCustomer` must have: name, email, phone
- `Project` must have: heroPhoto optional field

**Verify:** Types compile with no errors.

---

### Phase 3: Utilities & Logic
**Ask user for these files:**
- `src/utils/helpers.ts`
- `src/utils/services.ts`
- `src/logic/state.ts`

**What you're building:** UUID generation, currency formatting, Gemini AI cascade (FREE models only), Cloudinary upload, localStorage persistence, project/variation CRUD.

**Key rules:**
- Gemini cascade: flash → flash-lite → 1.5-flash → 2.0-flash → keyword fallback
- NO paid Gemini models (no gemini-2.5-pro)
- State version check: APP_VERSION = "2.0"
- All state in localStorage, NOT Firebase (yet)

**Verify:** State hook initialises without errors.

---

### Phase 4: Pricing Engine
**Ask user for these files:**
- `src/utils/categories/types.ts`
- `src/utils/categories/core.ts`
- `src/utils/categories/extended.ts`
- `src/utils/pricing/types.ts`
- `src/utils/pricing/constants.ts`
- `src/utils/pricing/engine.ts`
- `src/utils/pricing/quoteCalculator.ts`
- `src/utils/pricing/quoteDefaults.ts`
- `src/utils/pricing/scopeRecogniser.ts`
- `src/utils/pricing/index.ts`

**What you're building:** 43 construction categories with Rawlinsons/Cordell rates, solution generator, quote calculator (OH + Profit + Contingency + GST), pre-filled PC items/inclusions/exclusions per category, scope recognition.

**Key rules:**
- Formula: Trade Cost → +OH% → +Profit% → +Contingency% → +GST 10% → Total
- Rate types: $/m², $/lm, $/item, $/allow
- Default OH: 12%, Profit: 15%, Contingency: varies by category

**Verify:** Import all pricing functions, call `calculateQuote()` with sample data.

---

### Phase 5: Core Components
**Ask user for these files:**
- `src/components/Sidebar.tsx`
- `src/components/WelcomeScreen.tsx`
- `src/components/ProjectForm.tsx`
- `src/components/ProjectChat.tsx`
- `src/components/LoadingSpinner.tsx`
- `src/components/PhotoCapture.tsx`
- `src/components/SendWelcomeEmailModal.tsx`
- `src/components/welcomeMessages.ts`
- `src/components/ExternalQuoteModal.tsx`

**What you're building:** Sidebar with company switcher, welcome screen, project creation form (with hero photo), photo upload/camera capture, 5-channel welcome message sender, external quote baseline modal.

**Key rules:**
- Hero photo: Upload OR camera capture, Cloudinary with base64 fallback
- Welcome message: 5 channels (Gmail, Mail App, Copy, WhatsApp, SMS)
- Welcome message includes: portal URL, login email, temp password, view/download quotation
- No "Decline" button anywhere — always "Request Revised Quote"

**Verify:** Sidebar renders, ProjectForm shows hero photo section, WelcomeScreen shows company logo.

---

### Phase 6: Variation Builder
**Ask user for these files:**
- `src/components/VariationBuilder.tsx`
- `src/components/variationBuilder/ScopeStep.tsx`
- `src/components/variationBuilder/Editors.tsx`

**What you're building:** 4-step wizard: Scope Input → Details → Pricing & Items → Review. Handles both quotes AND variations.

**Key rules:**
- Quote: always available, documentType='quote', QTE badge
- Variation: only when approved quote exists, documentType='variation', VAR badge
- External baseline: if no in-app approved quote, ExternalQuoteModal opens first
- AI Polish: ✨ button uses Gemini free cascade
- Cross-category suggestions: auto (priority) + suggested

**Verify:** Create a quote with one scope, see pricing calculation.

---

### Phase 7: Report Views
**Ask user for these files:**
- `src/components/report/VariationReport.tsx`
- `src/components/report/BuilderView.tsx`
- `src/components/report/CustomerView.tsx`
- `src/components/report/CustomerViewParts.tsx`
- `src/components/report/ProgressHub.tsx`
- `src/components/report/ReportSendModal.tsx`

**What you're building:** 3-tab report container (Builder View / Customer Preview / Progress Hub), multi-channel report sender.

**Key rules:**
- Builder View: full cost transparency, pricing sliders, action log with notes
- Customer View: professional letterhead, client price only, progress photos, T&Cs, Approve & Sign
- Progress Hub: photo upload, stage tracker, progress updates
- ReportSendModal: Email (Gmail, Mail, Copy) + SMS/WhatsApp tabs
- Customer photos appear in Customer View report

**Verify:** Open a saved quote → see all 3 tabs → Builder shows sliders → Customer shows letterhead.

---

### Phase 8: Main App
**Ask user for these files:**
- `src/App.tsx`

**What you're building:** The main orchestrator that ties all components together. Handles routing, state, project selection, quote/variation creation, hero photo display.

**Key rules:**
- If no project selected → show WelcomeScreen
- If project selected → show project header (with hero photo banner if exists)
- New Quote → always available
- New Variation → gated by approved quote (or external baseline)
- Document list shows QTE/VAR badges with status colours
- Action log entries wired from App → VariationReport → BuilderView

**Verify:** `npm run build` succeeds. App loads in browser.

---

### Phase 9: Deploy Config
**Ask user for these files:**
- `firebase.json`
- `.firebaserc`
- `README.md`

**What you're building:** Fire