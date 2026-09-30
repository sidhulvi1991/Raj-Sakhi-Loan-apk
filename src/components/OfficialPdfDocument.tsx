import React from 'react';
import { Language, LoanCalculationResult, InstalmentRow } from '../types';
import { translations } from '../translations';
import { formatINR } from '../utils/calculations';

interface OfficialPdfDocumentProps {
  data: LoanCalculationResult;
  language: Language;
  containerRef?: React.Ref<HTMLDivElement>;
  isPrintVersion?: boolean;
}

interface PageChunk {
  pageNumber: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  rows: InstalmentRow[];
  showInfoGrid: boolean;
  showSignatures: boolean;
}

export const OfficialPdfDocument: React.FC<OfficialPdfDocumentProps> = ({
  data,
  language,
  containerRef,
  isPrintVersion = false,
}) => {
  const t = translations[language];

  // Helper translations for entities in selected language
  const lenderLabel = t.lenderOptions[data.lenderType];
  const borrowerLabel = t.borrowerOptions[data.borrowerType];
  const frequencyLabel = t.frequencyOptions[data.frequency];
  const periodUnitLabel = t.periodUnitOptions[data.periodUnit];

  // Build page chunks deterministically
  const totalRows = data.schedule.length;
  const pages: PageChunk[] = [];

  if (totalRows <= 12) {
    // Fits on 1 single A4 page cleanly
    pages.push({
      pageNumber: 1,
      isFirstPage: true,
      isLastPage: true,
      rows: data.schedule,
      showInfoGrid: true,
      showSignatures: true,
    });
  } else {
    // Multi-page layout
    const page1Rows = data.schedule.slice(0, 14);
    pages.push({
      pageNumber: 1,
      isFirstPage: true,
      isLastPage: false,
      rows: page1Rows,
      showInfoGrid: true,
      showSignatures: false,
    });

    let currentIdx = 14;
    let pageNum = 2;

    while (currentIdx < totalRows) {
      const remainingRows = totalRows - currentIdx;
      // If remaining rows <= 20, they can fit on the last page along with declaration & signatures
      if (remainingRows <= 20) {
        pages.push({
          pageNumber: pageNum,
          isFirstPage: false,
          isLastPage: true,
          rows: data.schedule.slice(currentIdx, totalRows),
          showInfoGrid: false,
          showSignatures: true,
        });
        currentIdx = totalRows;
      } else {
        // Take a batch of 26 rows for this middle page
        const chunkSize = Math.min(26, remainingRows);
        const isLastChunk = currentIdx + chunkSize >= totalRows;
        pages.push({
          pageNumber: pageNum,
          isFirstPage: false,
          isLastPage: isLastChunk,
          rows: data.schedule.slice(currentIdx, currentIdx + chunkSize),
          showInfoGrid: false,
          showSignatures: isLastChunk,
        });
        currentIdx += chunkSize;
      }
      pageNum++;
    }
  }

  const totalPages = pages.length;

  return (
    <div
      ref={containerRef}
      className={`official-document-container mx-auto ${
        isPrintVersion ? 'print-only' : ''
      }`}
    >
      {pages.map((page) => (
        <div
          key={page.pageNumber}
          className={`a4-page relative bg-white text-slate-900 border border-slate-300 shadow-lg mx-auto mb-8 p-8 flex flex-col justify-between ${
            language === 'hi' ? 'font-devanagari' : ''
          }`}
          style={{
            width: '210mm',
            minHeight: '297mm',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <div>
            <div className="text-center pb-3 border-b-2 border-slate-900">
              <h1 className="text-2xl font-bold tracking-wider uppercase text-slate-950">
                RAJ SAKHI LOAN
              </h1>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {t.departmentName}
              </p>
              <div className="mt-2 inline-block bg-slate-100 border border-slate-300 px-4 py-1 rounded text-xs font-bold tracking-wide uppercase text-slate-900">
                {t.pdfDocumentTitle}
                {!page.isFirstPage && (
                  <span className="font-normal text-slate-600">
                    {' '}
                    ({language === 'hi' ? 'क्रमशः' : 'Continued'})
                  </span>
                )}
              </div>
            </div>

            {/* Information Grid (Only on Page 1) */}
            {page.showInfoGrid && (
              <div className="mt-4 border border-slate-400 text-xs">
                <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300 bg-slate-50">
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.loanNumber}:</span>
                    <span className="font-mono font-semibold text-slate-900">{data.loanNumber}</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.loanDate}:</span>
                    <span className="font-semibold text-slate-900">{data.loanDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300">
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.loanGivenBy}:</span>
                    <span className="font-medium text-slate-900 text-right">{lenderLabel}</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.loanTakenBy}:</span>
                    <span className="font-medium text-slate-900 text-right">{borrowerLabel}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300">
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.loanGiverName}:</span>
                    <span className="font-bold text-slate-900 text-right">{data.lenderName}</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.loanReceiverName}:</span>
                    <span className="font-bold text-slate-900 text-right">{data.borrowerName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300 bg-slate-50/50">
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.loanAmount}:</span>
                    <span className="font-bold text-base text-slate-950">{formatINR(data.loanAmount)}</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.annualInterestRate}:</span>
                    <span className="font-bold text-slate-900">{data.annualRate}% {language === 'hi' ? 'वार्षिक' : 'p.a.'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300">
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.loanPeriod}:</span>
                    <span className="font-medium text-slate-900">{data.periodValue} {periodUnitLabel}</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.repaymentFrequency}:</span>
                    <span className="font-medium text-slate-900">{frequencyLabel}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300">
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.totalInstalments}:</span>
                    <span className="font-bold text-slate-900">{data.totalInstalments}</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.instalmentAmount}:</span>
                    <span className="font-bold text-slate-950">{formatINR(data.emiAmount)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-300 bg-slate-50/50">
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.totalInterest}:</span>
                    <span className="font-semibold text-slate-900">{formatINR(data.totalInterest)}</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.totalRepayment}:</span>
                    <span className="font-bold text-slate-950">{formatINR(data.totalRepayment)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-slate-300">
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.firstInstalment}:</span>
                    <span className="font-medium text-slate-900">{data.firstInstalmentDate}</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span className="font-bold text-slate-700">{t.lastInstalment}:</span>
                    <span className="font-medium text-slate-900">{data.lastInstalmentDate}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Repayment Schedule Table */}
            <div className="mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex justify-between items-center">
                <span>{language === 'hi' ? 'किस्त भुगतान अनुसूची' : 'Repayment Schedule'}</span>
                <span className="text-[11px] font-normal text-slate-500">
                  ({language === 'hi' ? 'घटती शेष राशि विधि' : 'Reducing Balance EMI Method'})
                </span>
              </div>
              <table className="w-full text-left text-[11px] border-collapse border border-slate-400">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b border-slate-400">
                    <th className="p-1.5 border-r border-slate-300 text-center w-12 font-bold">
                      {t.colInstalmentNo}
                    </th>
                    <th className="p-1.5 border-r border-slate-300 text-center w-24 font-bold">
                      {t.colDueDate}
                    </th>
                    <th className="p-1.5 border-r border-slate-300 text-right font-bold">
                      {t.colInstalmentAmount}
                    </th>
                    <th className="p-1.5 border-r border-slate-300 text-right font-bold">
                      {t.colInterest}
                    </th>
                    <th className="p-1.5 border-r border-slate-300 text-right font-bold">
                      {t.colPrincipal}
                    </th>
                    <th className="p-1.5 text-right font-bold">
                      {t.colRemainingBalance}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {page.rows.map((row) => (
                    <tr
                      key={row.instalmentNo}
                      className={row.instalmentNo % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}
                    >
                      <td className="p-1 border-r border-slate-200 text-center font-medium">
                        {row.instalmentNo}
                      </td>
                      <td className="p-1 border-r border-slate-200 text-center text-slate-700">
                        {row.dueDate}
                      </td>
                      <td className="p-1 border-r border-slate-200 text-right font-bold text-slate-900 tabular-nums">
                        {formatINR(row.instalmentAmount)}
                      </td>
                      <td className="p-1 border-r border-slate-200 text-right text-slate-700 tabular-nums">
                        {formatINR(row.interest)}
                      </td>
                      <td className="p-1 border-r border-slate-200 text-right text-slate-700 tabular-nums">
                        {formatINR(row.principal)}
                      </td>
                      <td className="p-1 text-right font-semibold text-slate-900 tabular-nums">
                        {formatINR(row.remainingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Declaration & Signatures (Only on final page) */}
            {page.showSignatures && (
              <div className="mt-6 border-t-2 border-slate-300 pt-4">
                {/* Official Declaration */}
                <div className="bg-slate-50 border border-slate-300 p-3 rounded">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
                    {t.pdfDeclarationTitle}
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-800">
                    "{t.pdfDeclarationText}"
                  </p>
                </div>

                {/* Signatures Section */}
                <div className="mt-6 grid grid-cols-3 gap-6 text-xs">
                  {/* Borrower */}
                  <div className="border border-slate-300 p-3 rounded bg-white">
                    <p className="font-bold text-slate-950 uppercase border-b border-slate-200 pb-1 text-center">
                      {t.borrowerSignatureTitle}
                    </p>
                    <div className="mt-6 space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {t.signatureName}:
                        </span>
                        <div className="font-bold text-slate-900 truncate">
                          {data.borrowerName}
                        </div>
                      </div>
                      <div className="pt-2">
                        <span className="text-[11px] text-slate-600 font-medium">
                          {t.signatureSign}:
                        </span>
                        <div className="mt-6 border-b border-slate-400 w-full" />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {t.signatureDate}:
                        </span>
                        <span className="ml-1 text-slate-700">________________</span>
                      </div>
                    </div>
                  </div>

                  {/* Lender */}
                  <div className="border border-slate-300 p-3 rounded bg-white">
                    <p className="font-bold text-slate-950 uppercase border-b border-slate-200 pb-1 text-center">
                      {t.lenderSignatureTitle}
                    </p>
                    <div className="mt-6 space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {t.signatureName}:
                        </span>
                        <div className="font-bold text-slate-900 truncate">
                          {data.lenderName}
                        </div>
                      </div>
                      <div className="pt-2">
                        <span className="text-[11px] text-slate-600 font-medium">
                          {t.signatureSign}:
                        </span>
                        <div className="mt-6 border-b border-slate-400 w-full" />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {t.signatureDate}:
                        </span>
                        <span className="ml-1 text-slate-700">________________</span>
                      </div>
                    </div>
                  </div>

                  {/* Witness */}
                  <div className="border border-slate-300 p-3 rounded bg-white">
                    <p className="font-bold text-slate-950 uppercase border-b border-slate-200 pb-1 text-center">
                      {t.witnessSignatureTitle}
                    </p>
                    <div className="mt-6 space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {t.signatureName}:
                        </span>
                        <div className="border-b border-slate-300 mt-4" />
                      </div>
                      <div className="pt-2">
                        <span className="text-[11px] text-slate-600 font-medium">
                          {t.signatureSign}:
                        </span>
                        <div className="mt-6 border-b border-slate-400 w-full" />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {t.signatureDate}:
                        </span>
                        <span className="ml-1 text-slate-700">________________</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-3 border-t border-slate-300 text-[10px] text-slate-600 flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-800">RAJ SAKHI LOAN</span>
              <span className="mx-1.5">|</span>
              <span>{t.pdfFooterGenerated}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">{t.pdfFooterDocNo}:</span>{' '}
              <span className="font-mono text-slate-900 font-semibold">{data.loanNumber}</span>
            </div>
            <div className="font-semibold text-slate-800">
              {t.pdfFooterPage(page.pageNumber, totalPages)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
