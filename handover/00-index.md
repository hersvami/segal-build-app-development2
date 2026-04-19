# 00 — Master Index

> **Phase 2.0 — Architectural Foundation (in progress):** Categories now declare a `CategoryArchetype` (`assembly` / `trade` / `element` / `compliance`) plus control flags (`dimensionMode`, `usesParametric`, `supportsPcItems`, `bundles`). The 4 pilot categories — **Bathroom** (assembly), **Electrical** (trade), **Internal Walls** (element), **Fire & Safety** (compliance) — are migrated to the new explicit-archetype factory `catX()`. Existing data still compiles via backwards-compatible `cat()` which infers archetype from group. Overlap warnings are now **informational only** — the **Add to Project** button is never disabled (turns amber **"Add Anyway"** when a bundle warning applies). Recognise Categories button now shows visible feedback. AI key restored-from-session badge added; cross-tab `storage` sync wired. **Phase 2 rollout plan** documented in `handover/13-phase-2-rollout.md` — read that next.

> **Phase 1.2:** Scope builder UX overhaul. Recognised categories render as full cards with **Add to Project / Remove** actions and expandable contents. Related categories stay visible after adding scopes. Scope drafts are persisted locally during the builder flow, the scope input is no longer cleared when adding a category, category-specific questions render in Details (e.g. bathroom tile extent, vanity type), and overlap warnings prevent accidental double-pricing of bundled trades.

> **Phase 1.0/1.1:** Project Baseline step (total area, storeys, site access) added; Rawlinsons-style parametric unit library scaffolded for Electrical; AI polish bumped to 4096 tokens with structured prompt; AI key persisted to `localStorage`.

> **⚠️ STOP — READ THIS BEFORE DOING ANYTHING:**
>
> 1. **You do NOT have access to the project code** — you MUST ask the user to provide files
> 2. **NEVER create files from scratch** — always ask "Please provide: [filename]" first
> 3. **READ before editing** — never overwrite without reading the existing file
> 4. **Only work on your module's scope** — don't touch files outside your "Files To Request" list
> 5. **Build after each file** — verify before moving to the next
>
> **AI INSTRUCTION:** Read this file FIRST. This index tells you which handover module to read for your task. Each module lists the exact files to request.

---

## What Is This Project?
Segal Build is a professional construction quoting and variation management app for Australian domestic builders. Built with React 19 + Vite 7 + Tailwind CSS v4 + TypeScript. All state is in localStorage. AI features use Google Gemini (free tier only). It builds into a single HTML file deployed to Firebase Hosting.

**Live URL:** https://segal-build-app.web.app
**Repo:** https://github.com/hersvami/segal-build-app

---

## This Project Has 14 Handover Modules

Each module is a self-contained document. Read only the one you need. Every module tells you:
1. What it covers
2. Which other modules are related
3. Which code files to ask the user for
4. What is done and what is not done

---

## How To Use This Handover

| You want to... | Read this module |
|---|---|
| **Understand the project** | `handover/01-overview.md` |
| **See what files exist** | `handover/02-file-structure.md` |
| **Check what features are built** | `handover/03-features.md` |
| **Work on pricing categories** | `handover/04-pricing-categories.md` |
| **Work on AI / Gemini** | `handover/05-ai-gemini.md` |
| **Understand data types** | `handover/06-data-types.md` |
| **Deploy the app** | `handover/07-deployment.md` |
| **See past user feedback** | `handover/08-feedback-log.md` |
| **Fix outstanding bugs** | `handover/09-required-fixes.md` |
| **Plan future features** | `handover/10-future-roadmap.md` |
| **Check known issues** | `handover/11-known-issues.md` |
| **Build the full app from all modules** | `handover/12-final-assembly.md` |
| **Execute the next-up Phase 2 plan** | `handover/13-phase-2-rollout.md` |

---

## Instructions For New AI Sessions

1. **You do NOT have access to the code** — ask the user to provide any files you need
2. **Always read `00-index.md` first** — it tells you which module you need
3. **Read only the module relevant to your task** — don't ask for everything
4. **Each module lists "Files To Request"** — ask the user for those exact files
5. **Each module lists "Other Modules You May Need"** — ask for those if needed
6. **After implementing, update the relevant handover module** to reflect your changes
7. **If your work is not covered by any module, create a new one** (see below)

---

## Rule: New Features Must Have A Handover Module

> If a new feature is implemented and it is NOT documented in an existing module,
> a new module file MUST be created and added to this index.

### How to add a new module:
1. Create `handover/XX-feature-name.md` (use next available number)
2. Follow the same format: AI Instruction, Other Modules, Files to Request, Content
3. Add a row to the index table above
4. Update `02-file-structure.md` with any new files created
5. Log it in `08-feedback-log.md`

### Example:
If you implement PDF export:
1. Create `handover/13-pdf-export.md`
2. Add: `| **Generate PDFs** | handover/13-pdf-export.md |`
3. Update `02-file-structure.md`
4. Mark done in `10-future-roadmap.md`

---

## Quick Prompts For Common Tasks

**Fix a bug:**
> "Read `handover/00-index.md` then `handover/09-required-fixes.md`. Implement the fix."

**Add a new feature:**
> "Read `handover/00-index.md` then `handover/03-features.md` and `handover/06-data-types.md`. Implement [feature]."

**Deploy:**
> "Read `handover/07-deployment.md`. Deploy the app."

**Check what's broken:**
> "Read `handover/09-required-fixes.md` and `handover/11-known-issues.md`."

**Don't repeat past mistakes:**
> "Read `handover/08-feedback-log.md` — follow all past decisions."

**Build the whole app from scratch:**
> "Read `handover/12-final-assembly.md`. Build the complete application."
