// [GSA-COM-F-CM-01: Reusable Confirmation Modal]
import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDestructive = true
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="ios-glass-card w-full max-w-sm bg-white p-6 shadow-2xl rounded-3xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        <h3 className="text-lg font-black text-slate-900 text-center mb-2">{title}</h3>
        <p className="text-xs font-medium text-slate-500 text-center mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
              isDestructive 
                ? 'bg-rose-600 text-white hover:bg-rose-700 hover:scale-105 active:scale-95' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
