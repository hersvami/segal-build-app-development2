import type { ProjectBaseline } from '../../types/domain';

export type BuilderDraft = {
  scopeInput: string;
  selectedCategoryId: string;
  baseline: ProjectBaseline;
};

const defaultBaseline: ProjectBaseline = {
  totalAreaM2: 0,
  storeys: 'single',
  siteAccess: 'easy',
  notes: '',
};

export function getDraftKey(projectId: string, documentType: 'quote' | 'variation') {
  return `segal:builderDraft:${projectId}:${documentType}`;
}

export function loadBuilderDraft(
  projectId: string,
  documentType: 'quote' | 'variation',
): BuilderDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(getDraftKey(projectId, documentType));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BuilderDraft>;
    return {
      scopeInput: parsed.scopeInput || '',
      selectedCategoryId: parsed.selectedCategoryId || '',
      baseline: { ...defaultBaseline, ...(parsed.baseline || {}) },
    };
  } catch {
    return null;
  }
}

export function saveBuilderDraft(
  projectId: string,
  documentType: 'quote' | 'variation',
  draft: BuilderDraft,
) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(getDraftKey(projectId, documentType), JSON.stringify(draft));
  } catch {
    // ignore storage failures
  }
}

export function clearBuilderDraft(
  projectId: string,
  documentType: 'quote' | 'variation',
) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(getDraftKey(projectId, documentType));
  } catch {
    // ignore storage failures
  }
}
