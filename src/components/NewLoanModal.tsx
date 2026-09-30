import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { AlertCircle } from 'lucide-react';

interface NewLoanModalProps {
  isOpen: boolean;
  language: Language;
  onConfirm: () => void;
  onCancel: () => void;
}

export const NewLoanModal: React.FC<NewLoanModalProps> = ({
  isOpen,
  language,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        className={`bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 transform transition-all ${
          language === 'hi' ? 'font-devanagari' : ''
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl shrink-0 border border-amber-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {t.newLoanConfirmTitle}
            </h3>
            <p className="text-sm text-slate-700 mt-2 leading-relaxed">
              {t.newLoanConfirmDesc}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {t.cancelBtn}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            {t.confirmBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
