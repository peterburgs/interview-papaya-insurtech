import { INSURANCE_PLANS } from "@/modules/insurance-plan/typing/constants";
import { InsurancePlan } from "@/modules/insurance-plan/typing/types";
import { transformFromRawToInsurancePlan } from "@/modules/insurance-plan/utils";

type ComparisonDirection = "higher" | "lower";

interface ComparisonRowDefinition {
  id: string;
  label: string;
  description?: string;
  section: string;
  direction: ComparisonDirection;
  getValue: (plan: InsurancePlan) => number | null;
  formatValue?: (value: number | null) => string;
}

interface ComparisonValue {
  displayValue: string;
  isBest: boolean;
  isMissing: boolean;
  planName: string;
}

interface ComparisonRow {
  description?: string;
  id: string;
  label: string;
  values: ComparisonValue[];
}

interface ComparisonSection {
  rows: ComparisonRow[];
  title: string;
}

interface PlanStat {
  label: string;
  value: string;
}

interface PlanCard {
  accent: "bronze" | "silver" | "gold";
  explanation?: string;
  highlights: string[];
  isRecommended: boolean;
  monthlyPrice: string;
  name: string;
  stats: PlanStat[];
  summary: string;
}

interface InsurancePricingPresentation {
  comparisonSections: ComparisonSection[];
  planCards: PlanCard[];
  recommendedPlanName: string;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

const INTEGER_FORMATTER = new Intl.NumberFormat("en-US");

const PLAN_SUMMARIES: Record<string, string> = {
  Bronze: "Essential coverage for customers who want the lowest monthly commitment.",
  Gold: "Premium protection with the broadest benefits and zero out-of-pocket friction.",
  Silver: "Balanced coverage with stronger limits and a meaningfully lower copay.",
};

const RECOMMENDATION_EXPLANATIONS: Record<string, string> = {
  Bronze: "Best for keeping monthly costs low.",
  Gold: "Best for the broadest protection and convenience.",
  Silver: "Best balance of coverage, copay, and monthly price.",
};

const PLAN_ACCENTS: Record<string, PlanCard["accent"]> = {
  Bronze: "bronze",
  Gold: "gold",
  Silver: "silver",
};

const insurancePlans = INSURANCE_PLANS.map(transformFromRawToInsurancePlan);

const comparisonRowDefinitions: ComparisonRowDefinition[] = [
  {
    description: "Lower is easier on the monthly budget.",
    direction: "lower",
    getValue: (plan) => plan.monthlyPremium,
    id: "monthly-premium",
    label: "Monthly premium",
    section: "Cost & access",
    formatValue: (value) => (value === null ? "Not included" : `${formatCurrency(value)}/month`),
  },
  {
    description: "Lower copay means less out-of-pocket spending at the point of care.",
    direction: "lower",
    getValue: (plan) => plan.copayPercentage,
    id: "copay-percentage",
    label: "Copay",
    section: "Cost & access",
    formatValue: (value) => (value === null ? "Not included" : `${value}%`),
  },
  {
    description: "Lower waiting periods unlock coverage sooner.",
    direction: "lower",
    getValue: (plan) => plan.waitingPeriodDays,
    id: "waiting-period-days",
    label: "Waiting period",
    section: "Cost & access",
    formatValue: (value) => (value === null ? "Not included" : `${formatNumber(value)} days`),
  },
  {
    description: "Higher annual caps offer more protection for major claims.",
    direction: "higher",
    getValue: (plan) => plan.annualLimit,
    id: "annual-limit",
    label: "Annual limit",
    section: "Core protection",
    formatValue: (value) => (value === null ? "Not included" : formatCurrency(value)),
  },
  {
    direction: "higher",
    getValue: (plan) => plan.benefits.outpatient.limitPerVisit,
    id: "outpatient-limit-per-visit",
    label: "Outpatient limit / visit",
    section: "Core protection",
    formatValue: (value) => (value === null ? "Not included" : formatCurrency(value)),
  },
  {
    direction: "higher",
    getValue: (plan) => plan.benefits.outpatient.visitsPerYear,
    id: "outpatient-visits-per-year",
    label: "Outpatient visits / year",
    section: "Core protection",
  },
  {
    direction: "higher",
    getValue: (plan) => plan.benefits.inpatient.limitPerDay,
    id: "inpatient-limit-per-day",
    label: "Inpatient limit / day",
    section: "Core protection",
    formatValue: (value) => (value === null ? "Not included" : formatCurrency(value)),
  },
  {
    direction: "higher",
    getValue: (plan) => plan.benefits.inpatient.daysPerYear,
    id: "inpatient-days-per-year",
    label: "Inpatient days / year",
    section: "Core protection",
  },
  {
    description: "Included benefits increase the plan's everyday usefulness.",
    direction: "higher",
    getValue: (plan) => plan.benefits.dental?.limitPerYear ?? null,
    id: "dental-limit-per-year",
    label: "Dental limit / year",
    section: "Extra benefits",
    formatValue: (value) => (value === null ? "Not included" : formatCurrency(value)),
  },
  {
    direction: "higher",
    getValue: (plan) => plan.benefits.maternity?.limitPerPregnancy ?? null,
    id: "maternity-limit-per-pregnancy",
    label: "Maternity limit / pregnancy",
    section: "Extra benefits",
    formatValue: (value) => (value === null ? "Not included" : formatCurrency(value)),
  },
];

export const insurancePricingPresentation = buildInsurancePricingPresentation();

function buildInsurancePricingPresentation(): InsurancePricingPresentation {
  const recommendation = getRecommendedPlanName(insurancePlans);

  return {
    comparisonSections: buildComparisonSections(insurancePlans),
    planCards: insurancePlans.map((plan) => ({
      accent: PLAN_ACCENTS[plan.name] ?? "silver",
      explanation: plan.name === recommendation ? RECOMMENDATION_EXPLANATIONS[plan.name] : undefined,
      highlights: plan.highlights,
      isRecommended: plan.name === recommendation,
      monthlyPrice: formatCurrency(plan.monthlyPremium),
      name: plan.name,
      stats: [
        { label: "Annual limit", value: formatCurrency(plan.annualLimit) },
        { label: "Copay", value: `${plan.copayPercentage}%` },
        { label: "Waiting period", value: `${formatNumber(plan.waitingPeriodDays)} days` },
      ],
      summary: PLAN_SUMMARIES[plan.name] ?? "Coverage summary",
    })),
    recommendedPlanName: recommendation,
  };
}

function buildComparisonSections(plans: InsurancePlan[]): ComparisonSection[] {
  const sectionMap = new Map<string, ComparisonRow[]>();

  comparisonRowDefinitions.forEach((definition) => {
    const winners = getWinningPlanNames(definition, plans);
    const row: ComparisonRow = {
      description: definition.description,
      id: definition.id,
      label: definition.label,
      values: plans.map((plan) => {
        const rawValue = definition.getValue(plan);

        return {
          displayValue: formatMetricValue(definition, rawValue),
          isBest: winners.includes(plan.name),
          isMissing: rawValue === null,
          planName: plan.name,
        };
      }),
    };

    const rows = sectionMap.get(definition.section) ?? [];
    rows.push(row);
    sectionMap.set(definition.section, rows);
  });

  return Array.from(sectionMap.entries()).map(([title, rows]) => ({ rows, title }));
}

function getWinningPlanNames(definition: ComparisonRowDefinition, plans: InsurancePlan[]): string[] {
  const comparableValues = plans
    .map((plan) => ({
      planName: plan.name,
      value: definition.getValue(plan),
    }))
    .filter((entry): entry is { planName: string; value: number } => entry.value !== null);

  if (comparableValues.length === 0) {
    return [];
  }

  const scores = comparableValues.map((entry) => ({
    planName: entry.planName,
    score: toComparableMetricValue(entry.value, definition.direction),
  }));

  const bestScore =
    definition.direction === "higher"
      ? Math.max(...scores.map((entry) => entry.score))
      : Math.min(...scores.map((entry) => entry.score));

  return scores.filter((entry) => entry.score === bestScore).map((entry) => entry.planName);
}

function toComparableMetricValue(value: number, direction: ComparisonDirection): number {
  if (direction === "higher" && value === -1) {
    return Number.POSITIVE_INFINITY;
  }

  return value;
}

function formatMetricValue(definition: ComparisonRowDefinition, value: number | null): string {
  if (definition.formatValue) {
    return definition.formatValue(value);
  }

  if (value === null) {
    return "Not included";
  }

  if (value === -1) {
    return "Unlimited";
  }

  return formatNumber(value);
}

function getRecommendedPlanName(plans: InsurancePlan[]): string {
  return [...plans]
    .map((plan) => ({
      name: plan.name,
      score: getValueScore(plan),
    }))
    .sort((left, right) => right.score - left.score)[0]?.name ?? plans[0]?.name ?? "";
}

function getValueScore(plan: InsurancePlan): number {
  const annualScore = Math.log10(1 + plan.annualLimit / 100000) * 2.4;
  const outpatientScore =
    Math.log10(1 + (plan.benefits.outpatient.limitPerVisit * getEffectiveVisitCount(plan.benefits.outpatient.visitsPerYear)) / 50000) *
    1.4;
  const inpatientScore =
    Math.log10(1 + (plan.benefits.inpatient.limitPerDay * getEffectiveVisitCount(plan.benefits.inpatient.daysPerYear)) / 100000) *
    1.6;
  const dentalScore = plan.benefits.dental ? Math.log10(1 + plan.benefits.dental.limitPerYear / 10000) * 0.8 : 0;
  const maternityScore = plan.benefits.maternity
    ? Math.log10(1 + plan.benefits.maternity.limitPerPregnancy / 25000) * 0.35
    : 0;
  const completenessAdjustment = (plan.benefits.dental ? 0.3 : -0.2) + (plan.benefits.maternity ? 0.15 : -0.05);
  const frictionPenalty = (plan.copayPercentage / 10) * 0.45 + (plan.waitingPeriodDays / 15) * 0.25;
  const adjustedCoverage = Math.max(
    annualScore + outpatientScore + inpatientScore + dentalScore + maternityScore + completenessAdjustment - frictionPenalty,
    0.05,
  );

  return (adjustedCoverage * 100) / plan.monthlyPremium;
}

function getEffectiveVisitCount(value: number): number {
  if (value === -1) {
    return 365;
  }

  return value;
}

function formatCurrency(value: number): string {
  return CURRENCY_FORMATTER.format(value);
}

function formatNumber(value: number): string {
  if (value === -1) {
    return "Unlimited";
  }

  return INTEGER_FORMATTER.format(value);
}
