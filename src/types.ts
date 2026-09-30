export type Language = 'en' | 'hi';

export type LenderType = 'CLF' | 'VO' | 'SHG';
export type BorrowerType = 'VO' | 'SHG' | 'MEMBER';

export type RepaymentFrequency = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';
export type PeriodUnit = 'months' | 'years';

export interface LoanFormData {
  lenderType: LenderType;
  borrowerType: BorrowerType;
  lenderName: string;
  borrowerName: string;
  loanAmount: string;
  loanDate: string; // YYYY-MM-DD
  periodValue: string;
  periodUnit: PeriodUnit;
  frequency: RepaymentFrequency;
  firstInstalmentDate: string; // YYYY-MM-DD
}

export interface InstalmentRow {
  instalmentNo: number;
  dueDate: string; // DD-MM-YYYY
  instalmentAmount: number;
  interest: number;
  principal: number;
  remainingBalance: number;
}

export interface LoanCalculationResult {
  loanNumber: string;
  lenderType: LenderType;
  borrowerType: BorrowerType;
  lenderName: string;
  borrowerName: string;
  loanAmount: number;
  annualRate: number;
  periodicRatePercent: number;
  periodValue: number;
  periodUnit: PeriodUnit;
  periodText: string;
  frequency: RepaymentFrequency;
  totalInstalments: number;
  emiAmount: number;
  totalPrincipal: number;
  totalInterest: number;
  totalRepayment: number;
  loanDate: string; // DD-MM-YYYY
  firstInstalmentDate: string; // DD-MM-YYYY
  lastInstalmentDate: string; // DD-MM-YYYY
  schedule: InstalmentRow[];
  generatedAt: string;
}
