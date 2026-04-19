import type { QuoteScope } from '../../types/domain';
import { getCategoryById } from '../../utils/categories/extended';
import { generateSolutionFromCategory } from '../../utils/pricing/engine';
import { getDefaultExclusions, getDefaultInclusions, getDefaultPCItems } from '../../utils/pricing/quoteDefaults';

export function createScopeFromCategory(categoryId: string, description: string): QuoteScope | null {
  const category = getCategoryById(categoryId);
  if (!category) return null;

  const { scope, stages } = generateSolutionFromCategory(categoryId, description || category.label, {
    width: 10,
    length: 10,
    height: 3,
  });

  const answers = Object.fromEntries(
    category.questions.map((question) => [question.id, question.type === 'select' ? (question.options?.[0] || '') : '']),
  );

  return {
    ...scope,
    stages,
    answers,
    selectedType: answers.type || undefined,
    pcItems: getDefaultPCItems(categoryId),
    inclusions: getDefaultInclusions(categoryId),
    exclusions: getDefaultExclusions(categoryId),
  };
}
