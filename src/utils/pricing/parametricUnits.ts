/* ─── Segal Build — Parametric Unit Library ───
 * Rawlinsons-style unit rates: labour + materials per unit.
 * Each entry represents a single "Bill of Quantities" line item the
 * builder can add to a scope by entering a quantity (point / lineal
 * metre / item / allowance).
 *
 * NOTE: rates are indicative AU averages (2025) — adjust per region.
 * Categories rolled out in Phase 1: Electrical (prototype). More to follow.
 */

export type ParametricUnit = {
  id: string;
  categoryId: string;
  label: string;
  description: string;
  unit: 'each' | 'lm' | 'm2' | 'allow';
  rate: number;        // AUD inc. labour & materials, ex GST
  trade: string;
  defaultQty?: number;
};

export const PARAMETRIC_UNITS: ParametricUnit[] = [
  /* ─── Electrical (Phase 1 prototype) ─── */
  { id: 'el-gpo-double',   categoryId: 'electrical', label: 'Double GPO (power point)',         description: 'Supply & install double GPO, standard wall position', unit: 'each', rate: 110, trade: 'Electrical' },
  { id: 'el-gpo-single',   categoryId: 'electrical', label: 'Single GPO',                       description: 'Supply & install single GPO',                          unit: 'each', rate: 95,  trade: 'Electrical' },
  { id: 'el-usb-gpo',      categoryId: 'electrical', label: 'GPO with USB-C/A',                 description: 'Supply & install USB combo GPO',                       unit: 'each', rate: 165, trade: 'Electrical' },
  { id: 'el-downlight',    categoryId: 'electrical', label: 'LED Downlight',                    description: 'Supply & install dimmable LED downlight',              unit: 'each', rate: 85,  trade: 'Electrical' },
  { id: 'el-pendant',      categoryId: 'electrical', label: 'Pendant / Feature Light Point',    description: 'Wired light point only (fitting PC)',                  unit: 'each', rate: 125, trade: 'Electrical' },
  { id: 'el-wall-light',   categoryId: 'electrical', label: 'External Wall Light Point',        description: 'IP44 weatherproof external light point',               unit: 'each', rate: 145, trade: 'Electrical' },
  { id: 'el-switch-1g',    categoryId: 'electrical', label: 'Switch — 1 Gang',                  description: 'Supply & install 1 gang switch',                       unit: 'each', rate: 65,  trade: 'Electrical' },
  { id: 'el-switch-2g',    categoryId: 'electrical', label: 'Switch — 2 Gang',                  description: 'Supply & install 2 gang switch',                       unit: 'each', rate: 85,  trade: 'Electrical' },
  { id: 'el-switch-3g',    categoryId: 'electrical', label: 'Switch — 3 Gang',                  description: 'Supply & install 3 gang switch',                       unit: 'each', rate: 105, trade: 'Electrical' },
  { id: 'el-data-point',   categoryId: 'electrical', label: 'Data / RJ45 Point (Cat6)',         description: 'Cat6 data point with face plate',                      unit: 'each', rate: 195, trade: 'Electrical' },
  { id: 'el-tv-point',     categoryId: 'electrical', label: 'TV Antenna Point',                 description: 'Coaxial TV point with face plate',                     unit: 'each', rate: 165, trade: 'Electrical' },
  { id: 'el-smoke-alarm',  categoryId: 'electrical', label: 'Hardwired Smoke Alarm',            description: 'AS3786 240V interconnected smoke alarm',               unit: 'each', rate: 240, trade: 'Electrical' },
  { id: 'el-exhaust-fan',  categoryId: 'electrical', label: 'Exhaust Fan (wet area)',           description: 'Bathroom/laundry exhaust fan supply & install',        unit: 'each', rate: 280, trade: 'Electrical' },
  { id: 'el-heated-rail',  categoryId: 'electrical', label: 'Heated Towel Rail Point',          description: 'Wired & switched heated towel rail point',             unit: 'each', rate: 220, trade: 'Electrical' },
  { id: 'el-ac-power',     categoryId: 'electrical', label: 'A/C Dedicated Circuit',            description: 'Dedicated 20A circuit for split system',               unit: 'each', rate: 380, trade: 'Electrical' },
  { id: 'el-oven-circuit', categoryId: 'electrical', label: 'Oven/Cooktop 32A Circuit',         description: 'Dedicated 32A oven circuit, isolator switch',          unit: 'each', rate: 450, trade: 'Electrical' },
  { id: 'el-cable-run',    categoryId: 'electrical', label: 'Sub-circuit Cable Run',            description: 'TPS cabling run through ceiling/walls',                unit: 'lm',   rate: 18,  trade: 'Electrical' },
  { id: 'el-board-up',     categoryId: 'electrical', label: 'Switchboard Upgrade',              description: 'Upgrade to modern board with RCBOs, surge protection', unit: 'allow',rate: 2800,trade: 'Electrical' },
  { id: 'el-rcd-add',      categoryId: 'electrical', label: 'Add RCBO to Existing Board',       description: 'Single RCBO addition to existing board',               unit: 'each', rate: 220, trade: 'Electrical' },
  { id: 'el-cert',         categoryId: 'electrical', label: 'Compliance Certificate (CES)',     description: 'AS/NZS 3000 compliance & test certificate',            unit: 'allow',rate: 350, trade: 'Electrical' },
];

export function getUnitsForCategory(categoryId: string): ParametricUnit[] {
  return PARAMETRIC_UNITS.filter((u) => u.categoryId === categoryId);
}

export function getUnitById(unitId: string): ParametricUnit | undefined {
  return PARAMETRIC_UNITS.find((u) => u.id === unitId);
}

export function hasParametricUnits(categoryId: string): boolean {
  return PARAMETRIC_UNITS.some((u) => u.categoryId === categoryId);
}

export function calcParametricTotal(items: { rate: number; quantity: number }[]): number {
  return items.reduce((sum, it) => sum + (it.rate * it.quantity), 0);
}
