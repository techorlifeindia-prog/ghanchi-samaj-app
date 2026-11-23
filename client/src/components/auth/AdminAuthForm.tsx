// [GSA-ATH-F-CM-05: Smart Admin Security PIN Login Form Component]
import React, { useState } from 'react';
import { KeyRound, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AdminAuthFormProps {
  onSuccess?: () => void;
}

export const AdminAuthForm: React.FC<AdminAuthFormProps> = ({ onSuccess }) => {
  // [GSA-ATH-F-CM-05.A: State & Context Hooks]
  const { language } = useLanguage();
  const { loginAdmin } = useAuth();
  const { showToast } = useToast();
  const [adminPin, setAdminPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  // [GSA-ATH-F-CM-05.B: Submit Admin Login]
  const handleAdminLogin = (e?: React.FormEvent, overridePin?: string) => {
    if (e) e.preventDefault();
    const pin = overridePin || adminPin;
    if (pin === '7860' || pin === '9999' || pin === 'admin') {
      loginAdmin();
      showToast(language === 'hi' ? '🛡️ एडमिन लॉगिन सफल! समाज डैशबोर्ड में स्वागत है।' : '🛡️ Admin logged in successfully!', 'success');
      if (onSuccess) onSuccess();
    } else {
      showToast(language === 'hi' ? 'गलत एडमिन पिन! (डेमो पिन: 7860)' : 'Incorrect Admin PIN! (Demo PIN: 7860)', 'error');
    }
  };

  return (
    <form onSubmit={handleAdminLogin} className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'hi' ? 'व्यवस्थापक सुरक्षा पिन (Admin PIN)' : 'Admin Security PIN'}</span>
          </label>
          <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Trust Protected
          </span>
        </div>

        <div className="relative">
          <input
            type={showPin ? 'text' : 'password'}
            maxLength={6}
            value={adminPin}
            onChange={(e) => setAdminPin(e.target.value)}
            placeholder="• • • •"
            className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-center text-xl tracking-widest text-slate-900 font-black focus:outline-none focus:ring-2 focus:ring-slate-800 shadow-sm"
            required
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Demo PIN Suggestion */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10.5px] text-slate-500 font-semibold">{language === 'hi' ? 'डेमो पिन:' : 'Demo test:'}</span>
          <button
            type="button"
            onClick={() => {
              setAdminPin('7860');
              handleAdminLogin(undefined, '7860');
            }}
            className="text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-200 transition-all active:scale-95 flex items-center gap-1"
          >
            <span>7860 (Auto-Login)</span>
            <span className="text-[9px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-black">Click</span>
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-slate-900/30 transition-all flex items-center justify-center gap-2"
      >
        <KeyRound className="w-4 h-4 text-amber-400" />
        <span>{language === 'hi' ? 'व्यवस्थापक डैशबोर्ड में प्रवेश करें' : 'Access Admin Dashboard'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};
