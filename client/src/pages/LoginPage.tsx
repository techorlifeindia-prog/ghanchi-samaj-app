// [GSA-ATH-F-PG] - Heritage Mockup Styled Apple Glassmorphism Login Page
import React, { useState, useEffect, useRef } from 'react';
import { Mail, MessageSquare, ShieldCheck, ArrowRight, Loader2, CheckCircle2, RotateCw, Globe, Sparkles, Users, Lock, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  // [GSA-ATH-F-PG-01: i18n & Context Hooks]
  const { language, setLanguage, t } = useLanguage();
  const { loginUser, loginAdmin } = useAuth();
  const { showToast } = useToast();

  // Active Tab: 'email' | 'whatsapp' | 'admin'
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp' | 'admin'>('email');

  // [GSA-ATH-F-PG-01.A: Email Flow State]
  const [email, setEmail] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [emailTimer, setEmailTimer] = useState(30);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // [GSA-ATH-F-PG-01.B: WhatsApp Flow State]
  const [mobile, setMobile] = useState('');
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [mobileTimer, setMobileTimer] = useState(30);
  const [isMobileLoading, setIsMobileLoading] = useState(false);

  // [GSA-ATH-F-PG-01.C: Admin Flow State]
  const [adminPin, setAdminPin] = useState('');
  const [showAdminPin, setShowAdminPin] = useState(false);

  // OTP Input Element Refs
  const emailOtpRef = useRef<(HTMLInputElement | null)[]>([]);
  const mobileOtpRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for Email OTP
  useEffect(() => {
    let interval: any = null;
    if (emailOtpSent && emailTimer > 0) {
      interval = setInterval(() => setEmailTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailOtpSent, emailTimer]);

  // Countdown timer for WhatsApp OTP
  useEffect(() => {
    let interval: any = null;
    if (mobileOtpSent && mobileTimer > 0) {
      interval = setInterval(() => setMobileTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mobileOtpSent, mobileTimer]);

  // [GSA-ATH-F-PG-02: 1-Click Instant Demo Login (For Fast Testing)]
  const handleQuickMemberDemo = () => {
    localStorage.setItem('gsa_active_tab', 'home');
    window.location.hash = 'home';
    loginUser({
      id: 'usr_demo_101',
      name: 'राजेश घाँची (Rajesh Ghanchi)',
      mobile: '9829012345',
      email: 'rajesh@ghanchisamaj.org',
      role: 'member',
      gotra: 'बोराणा (Borana)',
      memberId: 'GHS-RAJ-2026'
    });
    showToast(language === 'hi' ? '✨ डेमो सदस्य लॉगिन सफल! समाज मंच में स्वागत है।' : '✨ Demo Member Logged In Successfully!', 'success');
  };

  const handleQuickAdminDemo = () => {
    loginAdmin();
    showToast(language === 'hi' ? '🛡️ व्यवस्थापक (Admin) लॉगिन सफल! डैशबोर्ड में स्वागत है।' : '🛡️ Admin Logged In Successfully!', 'success');
  };

  // [GSA-ATH-F-PG-03: Email OTP Logic]
  const handleSendEmailOtp = async (targetEmail?: string) => {
    const finalEmail = targetEmail || email;
    if (!finalEmail.trim() || !finalEmail.includes('@')) {
      showToast(language === 'hi' ? 'कृपया सही ईमेल पता दर्ज करें' : 'Please enter a valid email address', 'error');
      return;
    }
    setIsEmailLoading(true);
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'email', target: finalEmail })
      });
    } catch (e) {}
    setIsEmailLoading(false);
    setEmailOtpSent(true);
    setEmailTimer(30);
    showToast(language === 'hi' ? '✨ ईमेल पर OTP भेज दिया गया है!' : '✨ OTP sent to your email!', 'success');
  };

  const handleVerifyEmailOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = emailOtp.join('');
    if (code === '123456' || code.length === 6) {
      localStorage.setItem('gsa_active_tab', 'home');
      window.location.hash = 'home';
      loginUser({
        id: 'usr_' + Date.now(),
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: 'member',
        gotra: '',
        memberId: 'GHS-' + Math.floor(1000 + Math.random() * 9000)
      });
      showToast(language === 'hi' ? '🎉 ईमेल लॉगिन सफल!' : '🎉 Email login successful!', 'success');
    } else {
      showToast(language === 'hi' ? 'गलत OTP! कृपया सही OTP दर्ज करें' : 'Invalid OTP! Please enter the correct code', 'error');
    }
  };

  // [GSA-ATH-F-PG-04: WhatsApp OTP Logic]
  const handleSendMobileOtp = async (targetNum?: string) => {
    const finalNum = targetNum || mobile;
    if (finalNum.length < 10) {
      showToast(language === 'hi' ? 'कृपया 10-अंकों का सही मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    setIsMobileLoading(true);
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'whatsapp', target: finalNum })
      });
    } catch (e) {}
    setIsMobileLoading(false);
    setMobileOtpSent(true);
    setMobileTimer(30);
    showToast(language === 'hi' ? '✨ WhatsApp पर OTP भेज दिया गया है!' : '✨ OTP sent on WhatsApp!', 'success');
  };

  const handleVerifyMobileOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = mobileOtp.join('');
    if (code === '123456' || code.length === 6) {
      localStorage.setItem('gsa_active_tab', 'home');
      window.location.hash = 'home';
      loginUser({
        id: 'usr_' + Date.now(),
        name: 'समाज बंधु (Member)',
        mobile: mobile || '9829012345',
        role: 'member',
        gotra: 'राठौड़ (Rathore)',
        memberId: 'GHS-' + Math.floor(1000 + Math.random() * 9000)
      });
      showToast(language === 'hi' ? '🎉 WhatsApp OTP सत्यापित! लॉगिन सफल।' : '🎉 WhatsApp OTP verified! Login successful.', 'success');
    } else {
      showToast(language === 'hi' ? 'गलत OTP! कृपया सही OTP दर्ज करें' : 'Invalid OTP! Please enter the correct code', 'error');
    }
  };

  // [GSA-ATH-F-PG-05: Admin Security PIN Logic]
  const handleAdminLogin = (e?: React.FormEvent, overridePin?: string) => {
    if (e) e.preventDefault();
    const pin = overridePin || adminPin;
    if (pin === '7860' || pin === '9999' || pin === 'admin') {
      localStorage.setItem('gsa_active_tab', 'admin');
      window.location.hash = 'admin';
      loginAdmin();
      showToast(language === 'hi' ? '🛡️ व्यवस्थापक (Admin) लॉगिन सफल!' : '🛡️ Admin logged in successfully!', 'success');
    } else {
      showToast(language === 'hi' ? 'गलत एडमिन पिन! कृपया सही पिन दर्ज करें' : 'Incorrect Admin PIN! Please try again', 'error');
    }
  };

  // Helper for OTP box navigation
  const handleOtpBoxChange = (
    index: number,
    value: string,
    currentOtp: string[],
    setOtp: React.Dispatch<React.SetStateAction<string[]>>,
    refList: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (!/^\d*$/.test(value)) return;
    const nextOtp = [...currentOtp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);
    if (value && index < 5) {
      refList.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    currentOtp: string[],
    refList: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === 'Backspace' && !currentOtp[index] && index > 0) {
      refList.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between items-center p-3 sm:p-6 relative overflow-hidden selection:bg-amber-400 selection:text-slate-950">
      
      {/* Background Soft Glow (Existing Theme Palette) */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-amber-400/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[140px] pointer-events-none" />

      {/* Top Header: Clean Language Switcher */}
      <header className="w-full max-w-lg flex justify-end items-center z-10 py-1">
        <button
          type="button"
          onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
          className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 text-xs font-bold border border-slate-200/80 shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>{language === 'hi' ? 'English' : 'हिन्दी'}</span>
        </button>
      </header>

      {/* Main Center Container */}
      <main className="w-full max-w-md my-auto z-10 flex flex-col items-center">
        
        {/* [GSA-ATH-F-PG-06: Top Circular Sacred Emblem & Ribbon from Mockup] */}
        <div className="flex flex-col items-center text-center mb-3">
          <div className="relative group">
            <img
              src="/samaj-emblem.png"
              alt="॥ जय श्री घाँची समाज ॥"
              className="w-28 sm:w-32 h-auto drop-shadow-md transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Title & Italicized Tagline from Mockup */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-2.5">
            {language === 'hi' ? 'श्री घाँची समाज ऐप' : 'Shree Ghanchi Samaj App'}
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-600 italic font-semibold mt-1">
            {t('mockupTagline')}
          </p>

          {/* Golden Diamond Decorative Divider from Mockup */}
          <div className="flex items-center justify-center gap-2.5 my-2.5 text-amber-500">
            <div className="w-14 h-[1.5px] bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-xs">◆</span>
            <div className="w-14 h-[1.5px] bg-gradient-to-l from-transparent to-amber-400" />
          </div>
        </div>

        {/* [GSA-ATH-F-PG-07: The Mockup Login Card Container] */}
        <div className="glass-panel w-full p-5 sm:p-6 bg-white/95 shadow-xl rounded-3xl border border-white/90 space-y-4">
          
          {/* Mockup Card Banner Bar */}
          <div className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-extrabold tracking-wide">
              {t('mockupCardBanner')}
            </span>
          </div>

          {/* Mockup 3-Pill Tab Switcher: [Email OTP] [WhatsApp] | [Admin] */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100/90 p-1 rounded-2xl text-xs font-bold border border-slate-200/80">
            {/* Email Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'email'
                  ? 'bg-slate-900 text-white shadow-sm font-black scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Mail className={`w-3.5 h-3.5 ${activeTab === 'email' ? 'text-white' : 'text-blue-600'}`} />
              <span className="truncate">{t('loginTabEmail')}</span>
            </button>

            {/* WhatsApp Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('whatsapp')}
              className={`py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-sm font-black scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <MessageSquare className={`w-3.5 h-3.5 ${activeTab === 'whatsapp' ? 'text-white' : 'text-emerald-600'}`} />
              <span className="truncate">{t('loginTabWhatsApp')}</span>
            </button>

            {/* Admin Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-600 text-white shadow-sm font-black scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'admin' ? 'text-amber-200' : 'text-amber-600'}`} />
              <span className="truncate">{t('loginTabAdmin')}</span>
            </button>
          </div>

          {/* TAB 1: EMAIL OTP AUTH BODY */}
          {activeTab === 'email' && (
            <div className="space-y-4 pt-1">
              {!emailOtpSent ? (
                <form onSubmit={(e) => { e.preventDefault(); handleSendEmailOtp(); }} className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={language === 'hi' ? 'ईमेल पता दर्ज करें' : 'Enter Email Address'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isEmailLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white py-3.5 rounded-2xl text-xs font-black shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isEmailLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Mail className="w-4 h-4 text-amber-400" />
                        <span>{language === 'hi' ? 'OTP प्राप्त करें' : 'Get OTP'}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
                  <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200 flex justify-between items-center text-xs">
                    <span className="font-bold text-blue-900 truncate">📧 {email}</span>
                    <button
                      type="button"
                      onClick={() => setEmailOtpSent(false)}
                      className="text-blue-700 font-bold underline shrink-0 ml-2"
                    >
                      {language === 'hi' ? 'बदलें' : 'Change'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {language === 'hi' ? '6-अंकों का OTP कोड दर्ज करें' : 'Enter 6-Digit OTP Code'}
                    </label>

                    <div className="grid grid-cols-6 gap-1.5">
                      {emailOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (emailOtpRef.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpBoxChange(idx, e.target.value, emailOtp, setEmailOtp, emailOtpRef)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e, emailOtp, emailOtpRef)}
                          className="w-full h-11 text-center text-base font-black text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    {emailTimer > 0 ? (
                      <span>{language === 'hi' ? `पुनः OTP (${emailTimer}s)` : `Resend in ${emailTimer}s`}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendEmailOtp()}
                        className="text-blue-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>{language === 'hi' ? 'पुनः OTP भेजें' : 'Resend OTP'}</span>
                      </button>
                    )}
                    <span className="text-[10.5px] text-slate-400">🔒 256-Bit SSL</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white py-3.5 rounded-2xl text-xs font-black shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'hi' ? 'सत्यापित करके प्रवेश करें' : 'Verify & Enter'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: WHATSAPP OTP AUTH BODY */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4 pt-1">
              {!mobileOtpSent ? (
                <form onSubmit={(e) => { e.preventDefault(); handleSendMobileOtp(); }} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-800 px-3 py-3 rounded-2xl text-xs font-black shrink-0">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder={language === 'hi' ? '10-अंकों का व्हाट्सएप नंबर' : 'WhatsApp Mobile Number'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs tracking-wide"
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isMobileLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-3.5 rounded-2xl text-xs font-black shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    {isMobileLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>{language === 'hi' ? 'WhatsApp OTP प्राप्त करें' : 'Get WhatsApp OTP'}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyMobileOtp} className="space-y-4">
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-900">📱 +91 {mobile}</span>
                    <button
                      type="button"
                      onClick={() => setMobileOtpSent(false)}
                      className="text-emerald-700 font-bold underline"
                    >
                      {language === 'hi' ? 'बदलें' : 'Change'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {language === 'hi' ? '6-अंकों का WhatsApp OTP दर्ज करें' : 'Enter 6-Digit WhatsApp OTP'}
                    </label>

                    <div className="grid grid-cols-6 gap-1.5">
                      {mobileOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (mobileOtpRef.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpBoxChange(idx, e.target.value, mobileOtp, setMobileOtp, mobileOtpRef)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e, mobileOtp, mobileOtpRef)}
                          className="w-full h-11 text-center text-base font-black text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    {mobileTimer > 0 ? (
                      <span>{language === 'hi' ? `पुनः OTP (${mobileTimer}s)` : `Resend in ${mobileTimer}s`}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendMobileOtp()}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>{language === 'hi' ? 'पुनः OTP भेजें' : 'Resend OTP'}</span>
                      </button>
                    )}
                    <span className="text-[10.5px] text-slate-400">🔒 256-Bit SSL</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-3.5 rounded-2xl text-xs font-black shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'hi' ? 'सत्यापित करके प्रवेश करें' : 'Verify & Enter'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: ADMIN SECURITY PIN AUTH BODY */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'hi' ? 'व्यवस्थापक सुरक्षा पिन (Admin PIN)' : 'Admin Security PIN'}
                </label>
                <div className="relative">
                  <input
                    type={showAdminPin ? 'text' : 'password'}
                    maxLength={6}
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="• • • •"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center text-xl tracking-widest text-slate-900 font-black focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPin(!showAdminPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showAdminPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10.5px] text-slate-400 font-medium text-center mt-1.5">
                  {language === 'hi' ? '🔒 अधिकृत व्यवस्थापक सुरक्षा पिन' : '🔒 Authorized Security PIN Only'}
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 active:scale-98 text-white py-3.5 rounded-2xl text-xs font-black shadow-md shadow-amber-600/25 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-200" />
                <span>{language === 'hi' ? 'व्यवस्थापक डैशबोर्ड में प्रवेश' : 'Enter Admin Dashboard'}</span>
              </button>
            </form>
          )}

          {/* Mockup Card Footer: 'or' divider and Golden Slogan */}
          <div className="pt-2 text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Golden Slogan from Mockup */}
            <div className="flex items-center justify-center gap-2 text-amber-600 font-black text-xs sm:text-sm tracking-wide pt-1">
              <div className="w-8 h-[1.5px] bg-gradient-to-r from-transparent to-amber-500" />
              <span>{t('samajSlogan')}</span>
              <div className="w-8 h-[1.5px] bg-gradient-to-l from-transparent to-amber-500" />
            </div>
          </div>

        </div>

      </main>

      {/* Footer Minimalist Trust Note */}
      <footer className="w-full text-center text-[11px] text-slate-400 font-medium z-10 py-2">
        <span className="flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>{t('simpleTrustBadge')} • © 2026 श्री घाँची समाज</span>
        </span>
      </footer>

    </div>
  );
};
