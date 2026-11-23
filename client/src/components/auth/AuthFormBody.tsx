// [GSA-ATH-F-CM-02: Reusable Smart Glassmorphism Auth Tabs Component]
import React, { useState } from 'react';
import { Mail, MessageSquare, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { EmailAuthForm } from './EmailAuthForm';
import { WhatsAppAuthForm } from './WhatsAppAuthForm';
import { AdminAuthForm } from './AdminAuthForm';

interface AuthFormBodyProps {
  defaultTab?: 'whatsapp' | 'email' | 'admin';
  onSuccess?: () => void;
}

export const AuthFormBody: React.FC<AuthFormBodyProps> = ({ defaultTab = 'whatsapp', onSuccess }) => {
  // [GSA-ATH-F-CM-02.A: Context Hooks & State]
  const { language, t } = useLanguage();
  const { loginUser, loginAdmin } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email' | 'admin'>(defaultTab);

  // [GSA-ATH-F-CM-02.B: 1-Click Instant Demo Login Helpers]
  const handleQuickMemberDemo = () => {
    localStorage.setItem('gsa_active_tab', 'profile');
    window.location.hash = 'profile';
    loginUser({
      id: 'usr_demo_101',
      name: 'राजेश घाँची (Rajesh Ghanchi)',
      mobile: '9829012345',
      email: 'rajesh@ghanchisamaj.org',
      role: 'member',
      gotra: 'बोराणा (Borana)',
      memberId: 'GHS-RAJ-2026'
    });
    showToast(language === 'hi' ? '✨ डेमो सदस्य लॉगिन सफल! समाज मंच में आपका स्वागत है।' : '✨ Demo Member Logged In Successfully!', 'success');
    if (onSuccess) onSuccess();
  };

  const handleQuickAdminDemo = () => {
    loginAdmin();
    showToast(language === 'hi' ? '🛡️ व्यवस्थापक (Admin) लॉगिन सफल! डैशबोर्ड में आपका स्वागत है।' : '🛡️ Admin Logged In Successfully!', 'success');
    if (onSuccess) onSuccess();
  };

  return (
    <div className="space-y-4">
      {/* [GSA-ATH-F-CM-02.C: 1-Click Quick Demo Bar for Rapid Evaluation] */}
      <div className="bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-emerald-500/10 border border-amber-300/40 rounded-2xl p-2.5">
        <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-slate-700 mb-1.5 px-1">
          <span className="flex items-center gap-1.5 text-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            {t('loginQuickDemoBadge')}
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">Instant</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleQuickMemberDemo}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white/95 hover:bg-white text-emerald-800 rounded-xl text-xs font-black shadow-sm border border-emerald-200 transition-all hover:scale-[1.02] active:scale-95"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('loginDemoMemberBtn')}</span>
          </button>
          <button
            type="button"
            onClick={handleQuickAdminDemo}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white/95 hover:bg-white text-blue-900 rounded-xl text-xs font-black shadow-sm border border-blue-200 transition-all hover:scale-[1.02] active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('loginDemoAdminBtn')}</span>
          </button>
        </div>
      </div>

      {/* [GSA-ATH-F-CM-02.D: Segmented Glass Navigation Pills] */}
      <div className="grid grid-cols-3 gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl text-xs font-bold border border-slate-200/80 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`py-2.5 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-md font-black scale-102 ring-1 ring-emerald-500'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <MessageSquare className={`w-3.5 h-3.5 ${activeTab === 'whatsapp' ? 'text-white' : 'text-emerald-600'}`} />
          <span className="truncate">{t('loginTabWhatsApp')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`py-2.5 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'email'
              ? 'bg-blue-600 text-white shadow-md font-black scale-102 ring-1 ring-blue-500'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Mail className={`w-3.5 h-3.5 ${activeTab === 'email' ? 'text-white' : 'text-blue-600'}`} />
          <span className="truncate">{t('loginTabEmail')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`py-2.5 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'admin'
              ? 'bg-slate-900 text-white shadow-md font-black scale-102 ring-1 ring-slate-800'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'admin' ? 'text-amber-400' : 'text-slate-700'}`} />
          <span className="truncate">{t('loginTabAdmin')}</span>
        </button>
      </div>

      {/* [GSA-ATH-F-CM-02.E: Tab Content Mounts] */}
      <div className="pt-1">
        {activeTab === 'whatsapp' && <WhatsAppAuthForm onSuccess={onSuccess} />}
        {activeTab === 'email' && <EmailAuthForm onSuccess={onSuccess} />}
        {activeTab === 'admin' && <AdminAuthForm onSuccess={onSuccess} />}
      </div>
    </div>
  );
};
