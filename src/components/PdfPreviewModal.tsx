import React from 'react';
import { Language, LoanCalculationResult } from '../types';
import { translations } from '../translations';
import { OfficialPdfDocument } from './OfficialPdfDocument';
import { Download, Printer, X } from 'lucide-react';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LoanCalculationResult;
  language: Language;
  onDownload: () => void;
  onPrint: () => void;
  isDownloading: boolean;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
  language,
  onDownload,
  onPrint,
  isDownloading,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-xs">
      {/* Top action bar */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>{t.pdfDocumentTitle}</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              {data.loanNumber}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printBtn}</span>
          </button>
          <button
            type="button"
            disabled={isDownloading}
            onClick={onDownload}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? t.generatingPdf : t.downloadPdfBtn}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Document Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-800/50 flex justify-center">
        <div className="transform origin-top scale-[0.85] sm:scale-100 max-w-full">
          <OfficialPdfDocument data={data} language={language} />
        </div>
      </div>
    </div>
  );
};
