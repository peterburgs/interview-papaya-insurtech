export interface OutPatientBenefit {
  limitPerVisit: number;
  visitsPerYear: number;
}

export interface InPatientBenefit {
  limitPerDay: number;
  daysPerYear: number;
}

export interface DentalBenefit {
  limitPerYear: number;
}

export interface MaternityBenefit {
  limitPerPregnancy: number;
}

export interface InsurancePlanBenefit {
  outpatient: OutPatientBenefit;
  inpatient: InPatientBenefit;
  dental: DentalBenefit | null;
  maternity: MaternityBenefit | null;
}

export interface InsurancePlan {
  name: string;
  monthlyPremium: number;
  annualLimit: number;
  benefits: InsurancePlanBenefit;
  copayPercentage: number;
  waitingPeriodDays: number;
  highlights: string[];
}
