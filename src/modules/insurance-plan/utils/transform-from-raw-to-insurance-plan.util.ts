import { InsurancePlan, RawInsurancePlan } from "@/modules/insurance-plan/typing";

export const transformFromRawToInsurancePlan = (rawPlan: RawInsurancePlan): InsurancePlan => {
  return {
    name: rawPlan.name,
    monthlyPremium: rawPlan.monthly_premium,
    annualLimit: rawPlan.annual_limit,
    benefits: {
      outpatient: {
        limitPerVisit: rawPlan.benefits.outpatient.limit_per_visit,
        visitsPerYear: rawPlan.benefits.outpatient.visits_per_year,
      },
      inpatient: {
        limitPerDay: rawPlan.benefits.inpatient.limit_per_day,
        daysPerYear: rawPlan.benefits.inpatient.days_per_year,
      },
      dental: rawPlan.benefits.dental
        ? {
            limitPerYear: rawPlan.benefits.dental.limit_per_year,
          }
        : null,
      maternity: rawPlan.benefits.maternity
        ? {
            limitPerPregnancy: rawPlan.benefits.maternity.limit_per_pregnancy,
          }
        : null,
    },
    copayPercentage: rawPlan.copay_percentage,
    waitingPeriodDays: rawPlan.waiting_period_days,
    highlights: rawPlan.highlights,
  };
};
