import React, { useState } from 'react';
import { Language, LenderType, LoanFormData } from '../types';
import { translations } from '../translations';
import { getAnnualInterestRate, getRequiredBorrowerType } from '../utils/calculations';
import { Building2, Calendar, Clock, DollarSign, HelpCircle, UserCheck } from 'lucide-react';

interface LoanFormProps {
  formData: LoanFormData;
  setFormData: React.Dispatch<React.SetStateAction<LoanFormData>>;
  language: Language;
  onCalculate: () => void;
}

export const LoanForm: React.FC<LoanFormProps> = ({
  formData,
  setFormData,
  language,
  onCalculate,
}) => {
  const t = translations[language];
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto calculated annual interest rate
  const annualRate = getAnnualInterestRate(formData.lenderType);

  // Quick amount selections
  const quickAmounts = [10000, 25000, 50000, 100000, 200000];

  const handleLenderChange = (lender: LenderType) => {
    const requiredBorrower = getRequiredBorrowerType(lender);
    setFormData((prev) => ({
      ...prev,
      lenderType: lender,
      borrowerType: requiredBorrower,
    }));
  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, loanAmount: rawVal }));
    if (errors.loanAmount) {
      setErrors((prev) => ({ ...prev, loanAmount: '' }));
    }
  };

  const handleQuickAmountClick = (amt: number) => {
    setFormData((prev) => ({ ...prev, loanAmount: amt.toString() }));
    if (errors.loanAmount) {
      setErrors((prev) => ({ ...prev, loanAmount: '' }));
    }
  };

  // Formatted display of loan amount with Indian comma system
  const formattedAmountDisplay = formData.loanAmount
    ? Number(formData.loanAmount).toLocaleString('en-IN')
    : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.lenderName.trim()) {
      newErrors.lenderName = t.errGiverName;
    }
    if (!formData.borrowerName.trim()) {
      newErrors.borrowerName = t.errReceiverName;
    }

    const amtNum = parseFloat(formData.loanAmount);
    if (!formData.loanAmount || isNaN(amtNum) || amtNum <= 0) {
      newErrors.loanAmount = t.errLoanAmount;
    }

    const periodNum = parseFloat(formData.periodValue);
    if (!formData.periodValue || isNaN(periodNum) || periodNum <= 0) {
      newErrors.periodPeriod = t.errLoanPeriod;
    }

    if (!formData.firstInstalmentDate) {
      newErrors.firstInstalmentDate = t.errFirstInstalmentDate;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setErrors({});
    onCalculate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-3xl mx-auto px-4 py-6 ${
        language === 'hi' ? 'font-devanagari' : ''
      }`}
    >
      {/* Intro Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 mb-8 text-center sm:text-left sm:flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 mx-auto sm:mx-0 mb-3 sm:mb-0 shadow-xs">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-emerald-950">
            {t.appName}
          </h2>
          <p className="text-xs text-emerald-800 font-medium mt-0.5">
            {t.departmentName}
          </p>
          <p className="text-sm text-slate-700 mt-2 leading-relaxed">
            {t.introText}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Field 1: Loan Given By */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>{t.loanGivenBy}</span>
              <span className="text-rose-500">*</span>
            </label>
          </div>
          <p className="text-xs text-slate-500 mb-3.5 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{t.loanGivenByDesc}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(['CLF', 'VO', 'SHG'] as LenderType[]).map((type) => {
              const isSelected = formData.lenderType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleLenderChange(type)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-semibold ring-2 ring-emerald-700/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <span className="text-xs uppercase tracking-wide text-emerald-800 font-bold mb-1">
                    {type}
                  </span>
                  <span className="text-sm">
                    {t.lenderOptions[type]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Field 2: Loan Taken By (Auto Locked) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>{t.loanTakenBy}</span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                {language === 'hi' ? 'स्वतः निर्धारित' : 'Auto Selected'}
              </span>
            </label>
          </div>
          <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{t.loanTakenByDesc}</span>
          </p>
          <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">
                {t.borrowerOptions[formData.borrowerType]}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {formData.lenderType} → {formData.borrowerType}
            </span>
          </div>
        </div>

        {/* Field 3 & 4: Loan Giver Name & Loan Receiver Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Loan Giver Name */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <label className="block text-sm font-bold text-slate-900 mb-1">
              {t.loanGiverName} <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              {t.loanGiverNameDesc}
            </p>
            <input
              type="text"
              value={formData.lenderName}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, lenderName: e.target.value }));
                if (errors.lenderName) {
                  setErrors((prev) => ({ ...prev, lenderName: '' }));
                }
              }}
              placeholder={t.loanGiverNamePlaceholder}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none transition-colors ${
                errors.lenderName
                  ? 'border-rose-500 ring-2 ring-rose-200'
                  : 'border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20'
              }`}
            />
            {errors.lenderName && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">
                {errors.lenderName}
              </p>
            )}
          </div>

          {/* Loan Receiver Name */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <label className="block text-sm font-bold text-slate-900 mb-1">
              {t.loanReceiverName} <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              {t.loanReceiverNameDesc}
            </p>
            <input
              type="text"
              value={formData.borrowerName}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, borrowerName: e.target.value }));
                if (errors.borrowerName) {
                  setErrors((prev) => ({ ...prev, borrowerName: '' }));
                }
              }}
              placeholder={t.loanReceiverNamePlaceholder}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none transition-colors ${
                errors.borrowerName
                  ? 'border-rose-500 ring-2 ring-rose-200'
                  : 'border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20'
              }`}
            />
            {errors.borrowerName && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">
                {errors.borrowerName}
              </p>
            )}
          </div>
        </div>

        {/* Field 5: Loan Amount (₹) & Automatic Interest Rate Banner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="sm:flex items-start justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-900 mb-1">
                {t.loanAmount} <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2.5">
                {t.loanAmountDesc}
              </p>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold">
                  ₹
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.loanAmount}
                  onChange={handleLoanAmountChange}
                  placeholder={t.loanAmountPlaceholder}
                  className={`w-full pl-8 pr-4 py-2.5 text-base font-semibold rounded-xl border bg-white focus:outline-none transition-colors ${
                    errors.loanAmount
                      ? 'border-rose-500 ring-2 ring-rose-200'
                      : 'border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20'
                  }`}
                />
              </div>

              {/* Formatted live display */}
              {formattedAmountDisplay && (
                <p className="text-xs font-semibold text-emerald-800 mt-1.5">
                  ₹{formattedAmountDisplay}
                </p>
              )}

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-xs text-slate-500 mr-1">
                  {language === 'hi' ? 'त्वरित चयन:' : 'Quick:'}
                </span>
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickAmountClick(amt)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {errors.loanAmount && (
                <p className="text-xs text-rose-600 mt-1.5 font-medium">
                  {errors.loanAmount}
                </p>
              )}
            </div>

            {/* Field 12: Automatic Interest Rate Callout */}
            <div className="mt-4 sm:mt-0 p-4 bg-emerald-50 rounded-xl border border-emerald-200 sm:w-56 shrink-0">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide block">
                {t.annualInterestRate}
              </span>
              <div className="text-2xl font-bold text-emerald-950 mt-1 flex items-baseline gap-1">
                <span>{annualRate}%</span>
                <span className="text-xs font-medium text-emerald-700">
                  {language === 'hi' ? 'वार्षिक' : 'per annum'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                {language === 'hi'
                  ? 'संस्था के अनुसार स्वतः लागू'
                  : 'Auto-applied based on lender'}
              </p>
            </div>
          </div>
        </div>

        {/* Field 6 & 7: Loan Date & Loan Period */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Loan Date */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <label className="block text-sm font-bold text-slate-900 mb-1">
              {t.loanDate} <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              {t.loanDateDesc}
            </p>
            <div className="relative">
              <input
                type="date"
                value={formData.loanDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, loanDate: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
              />
            </div>
          </div>

          {/* Loan Period */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <label className="block text-sm font-bold text-slate-900 mb-1">
              {t.loanPeriod} <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              {t.loanPeriodDesc}
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="120"
                value={formData.periodValue}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, periodValue: e.target.value }));
                  if (errors.periodPeriod) {
                    setErrors((prev) => ({ ...prev, periodPeriod: '' }));
                  }
                }}
                className={`w-1/2 px-3.5 py-2.5 text-sm font-semibold rounded-xl border bg-white focus:outline-none transition-colors ${
                  errors.periodPeriod
                    ? 'border-rose-500 ring-2 ring-rose-200'
                    : 'border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20'
                }`}
              />
              <div className="w-1/2 flex rounded-xl border border-slate-300 overflow-hidden p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, periodUnit: 'months' }))
                  }
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    formData.periodUnit === 'months'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.periodUnitOptions.months}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, periodUnit: 'years' }))
                  }
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    formData.periodUnit === 'years'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.periodUnitOptions.years}
                </button>
              </div>
            </div>
            {errors.periodPeriod && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">
                {errors.periodPeriod}
              </p>
            )}
          </div>
        </div>

        {/* Field 8 & 9: Repayment Frequency & First Instalment Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Repayment Frequency */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <label className="block text-sm font-bold text-slate-900 mb-1">
              {t.repaymentFrequency} <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              {t.repaymentFrequencyDesc}
            </p>
            <select
              value={formData.frequency}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  frequency: e.target.value as any,
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm font-medium rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 cursor-pointer"
            >
              <option value="monthly">{t.frequencyOptions.monthly}</option>
              <option value="quarterly">{t.frequencyOptions.quarterly}</option>
              <option value="half_yearly">{t.frequencyOptions.half_yearly}</option>
              <option value="yearly">{t.frequencyOptions.yearly}</option>
            </select>
          </div>

          {/* First Instalment Date */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <label className="block text-sm font-bold text-slate-900 mb-1">
              {t.firstInstalmentDate} <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              {t.firstInstalmentDateDesc}
            </p>
            <input
              type="date"
              value={formData.firstInstalmentDate}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  firstInstalmentDate: e.target.value,
                }));
                if (errors.firstInstalmentDate) {
                  setErrors((prev) => ({ ...prev, firstInstalmentDate: '' }));
                }
              }}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none transition-colors ${
                errors.firstInstalmentDate
                  ? 'border-rose-500 ring-2 ring-rose-200'
                  : 'border-slate-300 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20'
              }`}
            />
            {errors.firstInstalmentDate && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">
                {errors.firstInstalmentDate}
              </p>
            )}
          </div>
        </div>

        {/* Calculate Button (Large prominent) */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-base shadow-lg shadow-emerald-900/15 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{t.calculateBtn}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
