/* ─── Segal Build — Baseline Multipliers ───
 * Applies global project-level adjustments to trade cost based on:
 *   - Storeys (auto-add scaffolding & roof safety)
 *   - Site access difficulty (labour multiplier)
 *
 * These are applied after the raw trade cost is summed but before
 * overhead/profit/contingency. They are injected as a "Site Conditions"
 * line item so they remain visible in the BoQ.
 */

import type { ProjectBaseline } from '../../types/domain';

export type BaselineAdjustment = {
  scaffoldingCost: number;
  accessLabourMultiplier: number;   // e.g. 1.0, 1.10, 1.15
  accessSurcharge: number;          // calculated $ uplift
  totalAdjustment: number;
  notes: string[];
};

// Indicative scaffolding rates per m² of floor area.
const SCAFFOLD_RATE_PER_M2: Record<ProjectBaseline['storeys'], number> = {
  single: 0,        // typically not required for single storey
  double: 65,       // perimeter scaffolding + safety rails
  multi:  120,      // engineered system scaffolding
};

const ACCESS_MULTIPLIER: Record<ProjectBaseline['siteAccess'], number> = {
  easy:     1.00,
  moderate: 1.075,  // +7.5% labour
  tight:    1.15,   // +15% labour
};

export function calcBaselineAdjustment(
  baseline: ProjectBaseline | undefined,
  rawTradeCost: number,
): BaselineAdjustment {
  if (!baseline) {
    return { scaffoldingCost: 0, accessLabourMultiplier: 1, accessSurcharge: 0, totalAdjustment: 0, notes: [] };
  }

  const notes: string[] = [];
  const area = Math.max(baseline.totalAreaM2 || 0, 0);

  // Scaffolding for double / multi storey
  const scaffoldRate = SCAFFOLD_RATE_PER_M2[baseline.storeys] ?? 0;
  const scaffoldingCost = Math.round(scaffoldRate * area);
  if (scaffoldingCost > 0) {
    notes.push(
      `Scaffolding & roof edge protection (${baseline.storeys}-storey × ${area} m² @ $${scaffoldRate}/m²)`,
    );
  }

  // Access multiplier on labour (we approximate as % of trade cost)
  const accessLabourMultiplier = ACCESS_MULTIPLIER[baseline.siteAccess] ?? 1;
  const accessSurcharge = Math.round(rawTradeCost * (accessLabourMultiplier - 1));
  if (accessSurcharge > 0) {
    const pct = Math.round((accessLabourMultiplier - 1) * 100);
    notes.push(`Site access surcharge (${baseline.siteAccess}, +${pct}% labour)`);
  }

  return {
    scaffoldingCost,
    accessLabourMultiplier,
    accessSurcharge,
    totalAdjustment: scaffoldingCost + accessSurcharge,
    notes,
  };
}

export function describeBaseline(baseline: ProjectBaseline | undefined): string {
  if (!baseline) return 'No baseline set';
  return `${baseline.totalAreaM2} m² · ${baseline.storeys}-storey · ${baseline.siteAccess} access`;
}
