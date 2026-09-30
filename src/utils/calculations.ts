import {
  BorrowerType,
  InstalmentRow,
  LenderType,
  LoanCalculationResult,
  LoanFormData,
  RepaymentFrequency,
} from '../types';

/**
 * Returns the auto-determined annual interest rate based on lender and borrower
 * CLF -> VO: 6%
 * VO -> SHG: 9%
 * SHG -> Member: 12%
 */
export function getAnnualInterestRate(lender: LenderType): number {
  switch (lender) {
    case 'CLF':
      return 6;
    case 'VO':
      return 9;
    case 'SHG':
      return 12;
    default:
      return 12;
  }
}

/**
 * Returns the required borrower type for a given lender
 */
export function getRequiredBorrowerType(lender: LenderType): BorrowerType {
  switch (lender) {
    case 'CLF':
      return 'VO';
    case 'VO':
      return 'SHG';
    case 'SHG':
      return 'MEMBER';
    default:
      return 'MEMBER';
  }
}

/**
 * Number of payments per year for each frequency
 */
export function getPaymentsPerYear(frequency: RepaymentFrequency): number {
  switch (frequency) {
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'half_yearly':
      return 2;
    case 'yearly':
      return 1;
  }
}

/**
 * Step in months for each frequency
 */
export function getFrequencyMonthStep(frequency: RepaymentFrequency): number {
  switch (frequency) {
    case 'monthly':
      return 1;
    case 'quarterly':
      return 3;
    case 'half_yearly':
      return 6;
    case 'yearly':
      return 12;
  }
}

/**
 * Generates an automatic unique loan/document number
 * Example: RSL-20260930-104532-482
 */
export function generateLoanNumber(date: Date = new Date()): string {
  const yyyy = date.getFullYear().toString();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  const rand = Math.floor(100 + Math.random() * 900).toString();

  return `RSL-${yyyy}${mm}${dd}-${hh}${min}${ss}-${rand}`;
}

/**
 * Formats date from YYYY-MM-DD or Date object into DD-MM-YYYY
 */
export function formatDateDDMMYYYY(dateInput: string | Date): string {
  if (!dateInput) return '';
  if (typeof dateInput === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(dateInput)) {
    return dateInput;
  }
  let d: Date;
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('-');
    if (parts.length === 3) {
      d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      d = new Date(dateInput);
    }
  } else {
    d = dateInput;
  }

  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Advances a date by N months while maintaining the day of the month
 * Handles month-end clamping (e.g. Jan 31 + 1 month -> Feb 28/29)
 */
export function addMonthsClamped(baseDate: Date, monthsToAdd: number): Date {
  const result = new Date(baseDate.getTime());
  const originalDay = baseDate.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + monthsToAdd);

  const daysInTargetMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(originalDay, daysInTargetMonth));
  return result;
}

/**
 * Formats a number to Indian Currency format: ₹10,000, ₹1,50,000
 */
export function formatINR(val: number, showDecimals: boolean = false): string {
  if (isNaN(val)) return '₹0';
  const rounded = showDecimals ? Math.round(val * 100) / 100 : Math.round(val);
  return '₹' + rounded.toLocaleString('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  });
}

/**
 * Performs full financial calculation and builds complete repayment schedule
 */
export function calculateLoan(formData: LoanFormData): LoanCalculationResult {
  const principal = parseFloat(formData.loanAmount.replace(/,/g, ''));
  const periodVal = parseFloat(formData.periodValue);
  const annualRate = getAnnualInterestRate(formData.lenderType);
  const paymentsPerYear = getPaymentsPerYear(formData.frequency);
  const monthStep = getFrequencyMonthStep(formData.frequency);

  const totalMonths = formData.periodUnit === 'years' ? periodVal * 12 : periodVal;
  const n = Math.max(1, Math.round(totalMonths / monthStep));

  // Periodic interest rate r
  const r = (annualRate / 100) / paymentsPerYear;
  const periodicRatePercent = Math.round(r * 100 * 100) / 100;

  // Reducing Balance EMI calculation:
  // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
  let exactEMI: number;
  if (r === 0) {
    exactEMI = principal / n;
  } else {
    const compound = Math.pow(1 + r, n);
    exactEMI = principal * (r * compound) / (compound - 1);
  }
  const standardEMI = Math.round(exactEMI);

  // Parse start date of first instalment
  const firstParts = formData.firstInstalmentDate.split('-');
  const firstDate = new Date(
    parseInt(firstParts[0], 10),
    parseInt(firstParts[1], 10) - 1,
    parseInt(firstParts[2], 10)
  );

  let currentPrincipal = principal;
  let accumulatedInterest = 0;
  let accumulatedPrincipal = 0;
  let accumulatedRepayment = 0;
  const schedule: InstalmentRow[] = [];

  for (let i = 1; i <= n; i++) {
    const instalmentDate = addMonthsClamped(firstDate, (i - 1) * monthStep);
    const dueDateStr = formatDateDDMMYYYY(instalmentDate);

    // Interest for this period = currentPrincipal * r
    const interest = Math.round(currentPrincipal * r);

    let instalmentAmount: number;
    let principalComponent: number;
    let remainingBalance: number;

    if (i === n) {
      // Final instalment: adjust remaining balance to exactly zero
      principalComponent = currentPrincipal;
      instalmentAmount = principalComponent + interest;
      remainingBalance = 0;
    } else {
      instalmentAmount = standardEMI;
      // In case EMI < interest (edge case protection)
      principalComponent = Math.min(currentPrincipal, Math.max(0, instalmentAmount - interest));
      remainingBalance = Math.max(0, currentPrincipal - principalComponent);
    }

    currentPrincipal = remainingBalance;
    accumulatedInterest += interest;
    accumulatedPrincipal += principalComponent;
    accumulatedRepayment += instalmentAmount;

    schedule.push({
      instalmentNo: i,
      dueDate: dueDateStr,
      instalmentAmount,
      interest,
      principal: principalComponent,
      remainingBalance,
    });
  }

  const lastInstalmentDateStr = schedule.length > 0 ? schedule[schedule.length - 1].dueDate : '';
  const loanNumber = generateLoanNumber();

  const periodText = `${periodVal} ${formData.periodUnit}`;

  return {
    loanNumber,
    lenderType: formData.lenderType,
    borrowerType: formData.borrowerType,
    lenderName: formData.lenderName.trim(),
    borrowerName: formData.borrowerName.trim(),
    loanAmount: principal,
    annualRate,
    periodicRatePercent,
    periodValue: periodVal,
    periodUnit: formData.periodUnit,
    periodText,
    frequency: formData.frequency,
    totalInstalments: n,
    emiAmount: schedule.length > 0 ? schedule[0].instalmentAmount : standardEMI,
    totalPrincipal: accumulatedPrincipal,
    totalInterest: accumulatedInterest,
    totalRepayment: accumulatedRepayment,
    loanDate: formatDateDDMMYYYY(formData.loanDate),
    firstInstalmentDate: formatDateDDMMYYYY(formData.firstInstalmentDate),
    lastInstalmentDate: lastInstalmentDateStr,
    schedule,
    generatedAt: formatDateDDMMYYYY(new Date()),
  };
}
