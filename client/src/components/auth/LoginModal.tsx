// [GSA-ATH-F-CM-01: Hybrid Email, WhatsApp OTP & Admin PIN Login Modal Component]
import React from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AuthFormBody } from './AuthFormBody';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'email' | 'whatsapp' | 'admin';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, defaultTab = 'email' }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="ios-glass-card w-full max-w-md bg-white/95 p-6 sm:p-7 shadow-2xl rounded-3xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header Row */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-100 text-amber-700 font-extrabold text-lg">
              🚩
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                {language === 'hi' ? 'श्री घाँची समाज लॉगिन' : 'Shree Ghanchi Samaj Login'}
              </h3>
              <p className="text-[10.5px] text-slate-500 font-semibold">
                {language === 'hi' ? 'सुरक्षित प्रमाणीकरण फ़ॉर्म' : 'Secure Authentication Form'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Body Form */}
        <AuthFormBody defaultTab={defaultTab} onSuccess={onClose} />

      </div>
    </div>,
    document.body
  );
};
