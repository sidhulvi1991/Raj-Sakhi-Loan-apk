/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Language, LoanCalculationResult, LoanFormData } from './types';
import { calculateLoan } from './utils/calculations';
import { downloadPdfFromElement, triggerPrint } from './utils/pdfGenerator';
import { Header } from './components/Header';
import { LoanForm } from './components/LoanForm';
import { LoanSummary } from './components/LoanSummary';
import { OfficialPdfDocument } from './components/OfficialPdfDocument';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { NewLoanModal } from './components/NewLoanModal';

function getTodayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getNextMonthString(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const initialFormData: LoanFormData = {
  lenderType: 'SHG',
  borrowerType: 'MEMBER',
  lenderName: '',
  borrowerName: '',
  loanAmount: '',
  loanDate: getTodayString(),
  periodValue: '12',
  periodUnit: 'months',
  frequency: 'monthly',
  firstInstalmentDate: getNextMonthString(),
};

export default function App() {
  const [language, setLanguage] = useState<Language>('hi');
  const [formData, setFormData] = useState<LoanFormData>(initialFormData);
  const [calculationResult, setCalculationResult] = useState<LoanCalculationResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'form' | 'summary'>('form');

  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Hidden offscreen container for html2canvas PDF rendering
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    const result = calculateLoan(formData);
    setCalculationResult(result);
    setCurrentStep('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPdf = async () => {
    if (!calculationResult || !pdfContainerRef.current) return;
    try {
      setIsDownloading(true);
      const filename = `${calculationResult.loanNumber}.pdf`;
      await downloadPdfFromElement(pdfContainerRef.current, filename);
    } catch (err) {
      console.error('Failed to download PDF:', err);
      // Fallback: trigger print
      triggerPrint();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    triggerPrint();
  };

  const handleNewLoanClick = () => {
    setIsNewLoanModalOpen(true);
  };

  const handleConfirmNewLoan = () => {
    setFormData({
      ...initialFormData,
      loanDate: getTodayString(),
      firstInstalmentDate: getNextMonthString(),
    });
    setCalculationResult(null);
    setCurrentStep('form');
    setIsNewLoanModalOpen(false);
    setIsPdfPreviewOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900">
      {/* Top Header & Language Switcher */}
      <Header language={language} onLanguageChange={setLanguage} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentStep === 'form' && (
          <LoanForm
            formData={formData}
            setFormData={setFormData}
            language={language}
            onCalculate={handleCalculate}
          />
        )}

        {currentStep === 'summary' && calculationResult && (
          <LoanSummary
            data={calculationResult}
            language={language}
            onDownloadPdf={handleDownloadPdf}
            onPrint={handlePrint}
            onPreviewPdf={() => setIsPdfPreviewOpen(true)}
            onNewLoan={handleNewLoanClick}
            onBackToForm={() => setCurrentStep('form')}
            isDownloading={isDownloading}
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-semibold text-slate-700">
            RAJ SAKHI LOAN
          </div>
          <div className="text-slate-500">
            {language === 'hi'
              ? 'राजस्थान ग्रामीण आजीविका विकास परिषद (राजीविका) · पूर्णतः ऑफलाइन'
              : 'Rajasthan Grameen Aajeevika Vikas Parishad (Rajeevika) · 100% Offline'}
          </div>
        </div>
      </footer>

      {/* Dedicated Clean Print View (Only triggered by window.print()) */}
      {calculationResult && (
        <OfficialPdfDocument
          data={calculationResult}
          language={language}
          isPrintVersion={true}
        />
      )}

      {/* Off-screen Document Container used for Canvas -> jsPDF generation */}
      {calculationResult && (
        <div
          style={{
            position: 'fixed',
            left: '-99999px',
            top: 0,
            zIndex: -1,
            pointerEvents: 'none',
          }}
        >
          <OfficialPdfDocument
            containerRef={pdfContainerRef}
            data={calculationResult}
            language={language}
          />
        </div>
      )}

      {/* PDF Interactive Preview Modal */}
      {calculationResult && (
        <PdfPreviewModal
          isOpen={isPdfPreviewOpen}
          onClose={() => setIsPdfPreviewOpen(false)}
          data={calculationResult}
          language={language}
          onDownload={handleDownloadPdf}
          onPrint={handlePrint}
          isDownloading={isDownloading}
        />
      )}

      {/* New Loan Confirmation Modal */}
      <NewLoanModal
        isOpen={isNewLoanModalOpen}
        language={language}
        onConfirm={handleConfirmNewLoan}
        onCancel={() => setIsNewLoanModalOpen(false)}
      />
    </div>
  );
}
