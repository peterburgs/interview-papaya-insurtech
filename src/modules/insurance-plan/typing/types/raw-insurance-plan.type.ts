export interface RawOutPatientBenefit {
  limit_per_visit: number;
  visits_per_year: number;
}

export interface RawInPatientBenefit {
  limit_per_day: number;
  days_per_year: number;
}

export interface RawDentalBenefit {
  limit_per_year: number;
}

export interface RawMaternityBenefit {
  limit_per_pregnancy: number;
}

export interface RawInsurancePlanBenefit {
  outpatient: RawOutPatientBenefit;
  inpatient: RawInPatientBenefit;
  dental: RawDentalBenefit | null;
  maternity: RawMaternityBenefit | null;
}

export interface RawInsurancePlan {
  name: string;
  monthly_premium: number;
  annual_limit: number;
  benefits: RawInsurancePlanBenefit;
  copay_percentage: number;
  waiting_period_days: number;
  highlights: string[];
}
