import React, { useState } from 'react';
import { Language, LoanCalculationResult } from '../types';
import { translations } from '../translations';
import { formatINR } from '../utils/calculations';
import {
  Download,
  Printer,
  FileText,
  RotateCcw,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface LoanSummaryProps {
  data: LoanCalculationResult;
  language: Language;
  onDownloadPdf: () => void;
  onPrint: () => void;
  onPreviewPdf: () => void;
  onNewLoan: () => void;
  onBackToForm: () => void;
  isDownloading: boolean;
}

export const LoanSummary: React.FC<LoanSummaryProps> = ({
  data,
  language,
  onDownloadPdf,
  onPrint,
  onPreviewPdf,
  onNewLoan,
  onBackToForm,
  isDownloading,
}) => {
  const t = translations[language];
  const [showAllRows, setShowAllRows] = useState(false);

  // Entities localized
  const lenderLabel = t.lenderOptions[data.lenderType];
  const borrowerLabel = t.borrowerOptions[data.borrowerType];
  const frequencyLabel = t.frequencyOptions[data.frequency];
  const periodUnitLabel = t.periodUnitOptions[data.periodUnit];

  // If there are many rows, show initial 12 rows with option to expand or keep scrollable
  const displayedSchedule = showAllRows ? data.schedule : data.schedule.slice(0, 15);
  const hasMoreRows = data.schedule.length > 15;

  return (
    <div
      className={`max-w-4xl mx-auto px-4 py-6 ${
        language === 'hi' ? 'font-devanagari' : ''
      }`}
    >
      {/* Top action and back buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <button
          type="button"
          onClick={onBackToForm}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backToFormBtn}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewLoan}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.newLoanBtn}</span>
          </button>
        </div>
      </div>

      {/* Prominent Action Bar */}
      <div className="bg-emerald-900 text-white rounded-2xl p-5 mb-6 shadow-md border border-emerald-800 no-print">
        <div className="sm:flex items-center justify-between gap-4">
          <div className="mb-4 sm:mb-0">
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold block">
              {language === 'hi' ? 'दस्तावेज संख्या' : 'Document Number'}
            </span>
            <div className="text-xl font-bold font-mono tracking-wide mt-0.5">
              {data.loanNumber}
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              {language === 'hi'
                ? 'आधिकारिक ऋण अनुबंध एवं किस्त अनुसूची तैयार है'
                : 'Official Loan Agreement & Schedule Ready'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={isDownloading}
              onClick={onDownloadPdf}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>{isDownloading ? t.generatingPdf : t.downloadPdfBtn}</span>
            </button>

            <button
              type="button"
              onClick={onPreviewPdf}
              className="flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-700 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>{t.previewPdfBtn}</span>
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-700 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>{t.printBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loan Summary Card (Section 20 of prompt) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-8">
        <div className="border-b border-slate-200 pb-3 mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {t.loanSummaryTitle}
          </h2>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            {data.annualRate}% {language === 'hi' ? 'वार्षिक ब्याज' : 'Annual Interest'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-8 text-sm">
          {/* Loan Number */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.loanNumber}:</span>
            <span className="font-mono font-bold text-slate-900">{data.loanNumber}</span>
          </div>

          {/* Loan Date */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.loanDate}:</span>
            <span className="font-semibold text-slate-900">{data.loanDate}</span>
          </div>

          {/* Loan Given By */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.loanGivenBy}:</span>
            <span className="font-semibold text-slate-900">{lenderLabel}</span>
          </div>

          {/* Loan Taken By */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.loanTakenBy}:</span>
            <span className="font-semibold text-slate-900">{borrowerLabel}</span>
          </div>

          {/* Loan Giver Name */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.loanGiverName}:</span>
            <span className="font-bold text-slate-900">{data.lenderName}</span>
          </div>

          {/* Loan Receiver Name */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.loanReceiverName}:</span>
            <span className="font-bold text-slate-900">{data.borrowerName}</span>
          </div>

          {/* Loan Amount */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.loanAmount}:</span>
            <span className="font-bold text-base text-emerald-950">{formatINR(data.loanAmount)}</span>
          </div>

          {/* Annual Interest Rate */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.annualInterestRate}:</span>
            <span className="font-bold text-slate-900">{data.annualRate}%</span>
          </div>

          {/* Loan Period */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.loanPeriod}:</span>
            <span className="font-semibold text-slate-900">{data.periodValue} {periodUnitLabel}</span>
          </div>

          {/* Repayment Frequency */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.repaymentFrequency}:</span>
            <span className="font-semibold text-slate-900">{frequencyLabel}</span>
          </div>

          {/* Number of Instalments */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.totalInstalments}:</span>
            <span className="font-bold text-slate-900">{data.totalInstalments}</span>
          </div>

          {/* Instalment Amount */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.instalmentAmount}:</span>
            <span className="font-bold text-base text-emerald-950">{formatINR(data.emiAmount)}</span>
          </div>

          {/* Total Interest */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.totalInterest}:</span>
            <span className="font-semibold text-slate-900">{formatINR(data.totalInterest)}</span>
          </div>

          {/* Total Repayment */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.totalRepayment}:</span>
            <span className="font-bold text-slate-950">{formatINR(data.totalRepayment)}</span>
          </div>

          {/* First Instalment Date */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.firstInstalment}:</span>
            <span className="font-semibold text-slate-900">{data.firstInstalmentDate}</span>
          </div>

          {/* Last Instalment Date */}
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium">{t.lastInstalment}:</span>
            <span className="font-semibold text-slate-900">{data.lastInstalmentDate}</span>
          </div>
        </div>
      </div>

      {/* Complete EMI / Instalment Schedule (Section 21) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'सम्पूर्ण किस्त अनुसूची' : 'Complete EMI Schedule'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {data.totalInstalments} {language === 'hi' ? 'किस्तें' : 'Instalments'} · {frequencyLabel}
            </p>
          </div>

          {hasMoreRows && (
            <button
              type="button"
              onClick={() => setShowAllRows(!showAllRows)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              <span>
                {showAllRows
                  ? language === 'hi' ? 'कम देखें' : 'Show Less'
                  : language === 'hi' ? `सभी ${data.totalInstalments} देखें` : `View All ${data.totalInstalments}`}
              </span>
              {showAllRows ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <th className="py-2.5 px-3 text-center">{t.colInstalmentNo}</th>
                <th className="py-2.5 px-3 text-center">{t.colDueDate}</th>
                <th className="py-2.5 px-3 text-right">{t.colInstalmentAmount}</th>
                <th className="py-2.5 px-3 text-right">{t.colInterest}</th>
                <th className="py-2.5 px-3 text-right">{t.colPrincipal}</th>
                <th className="py-2.5 px-3 text-right">{t.colRemainingBalance}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedSchedule.map((row) => (
                <tr
                  key={row.instalmentNo}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    row.instalmentNo % 2 === 0 ? 'bg-slate-50/40' : 'bg-white'
                  }`}
                >
                  <td className="py-2.5 px-3 text-center font-medium text-slate-800">
                    {row.instalmentNo}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-600">
                    {row.dueDate}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">
                    {formatINR(row.instalmentAmount)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 tabular-nums">
                    {formatINR(row.interest)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 tabular-nums">
                    {formatINR(row.principal)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-900 tabular-nums">
                    {formatINR(row.remainingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hasMoreRows && !showAllRows && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => setShowAllRows(true)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 py-1.5 px-4 bg-emerald-50 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              {language === 'hi'
                ? `शेष ${data.totalInstalments - 15} किस्तें और देखें`
                : `View remaining ${data.totalInstalments - 15} instalments`}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Sticky-like Action Row */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <button
          type="button"
          onClick={onBackToForm}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-xs text-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToFormBtn}</span>
        </button>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={onNewLoan}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 font-semibold text-xs text-rose-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.newLoanBtn}</span>
          </button>

          <button
            type="button"
            disabled={isDownloading}
            onClick={onDownloadPdf}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md shadow-emerald-900/15 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? t.generatingPdf : t.downloadPdfBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
