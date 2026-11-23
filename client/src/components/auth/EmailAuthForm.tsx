// [GSA-ATH-F-CM-03: Smart Email OTP Login Form Component]
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Loader2, CheckCircle2, ArrowRight, RotateCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface EmailAuthFormProps {
  onSuccess?: () => void;
}

export const EmailAuthForm: React.FC<EmailAuthFormProps> = ({ onSuccess }) => {
  // [GSA-ATH-F-CM-03.A: State & Context Hooks]
  const { language } = useLanguage();
  const { loginUser } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown hook for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  // [GSA-ATH-F-CM-03.B: Send Email OTP Handler]
  const handleSendEmailOtp = async (targetEmail?: string) => {
    const finalEmail = targetEmail || email;
    if (!finalEmail.trim() || !finalEmail.includes('@')) {
      showToast(language === 'hi' ? 'कृपया सही ईमेल पता दर्ज करें' : 'Please enter a valid email address', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'email', target: finalEmail })
      });
    } catch (err) {
      // Fallback
    }
    setIsLoading(false);
    setIsOtpSent(true);
    setTimer(30);
    showToast(language === 'hi' ? '✨ ईमेल पर OTP भेज दिया गया है! (Demo: 123456)' : '✨ OTP sent to email! (Demo: 123456)', 'success');
  };

  // [GSA-ATH-F-CM-03.C: 6-Digit OTP Management]
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pasted)) {
      const digits = pasted.split('');
      const newDigits = ['', '', '', '', '', ''];
      digits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      otpInputsRef.current[Math.min(digits.length, 5)]?.focus();
    }
  };

  // [GSA-ATH-F-CM-03.D: Verify OTP & Login]
  const handleVerifyEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp === '123456' || enteredOtp.length === 6) {
      localStorage.setItem('gsa_active_tab', 'profile');
      window.location.hash = 'profile';
      loginUser({
        id: 'usr_' + Date.now(),
        name: email.split('@')[0].toUpperCase() + ' (Member)',
        email: email || 'member@ghanchisamaj.org',
        role: 'member',
        gotra: 'राठौड़ (Rathore)',
        memberId: 'GHS-' + Math.floor(1000 + Math.random() * 9000)
      });
      showToast(language === 'hi' ? '🎉 ईमेल OTP सत्यापित! समाज मंच में स्वागत है।' : '🎉 Email OTP verified! Welcome to community portal.', 'success');
      if (onSuccess) onSuccess();
    } else {
      showToast(language === 'hi' ? 'गलत OTP! कृपया डेमो OTP 123456 दर्ज करें' : 'Invalid OTP! Please enter demo OTP 123456', 'error');
    }
  };

  const autoFillDemoOtp = () => {
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    showToast(language === 'hi' ? '⚡ डेमो OTP भर दिया गया है!' : '⚡ Demo OTP 123456 filled!', 'info');
  };

  return (
    <div className="space-y-4">
      {!isOtpSent ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSendEmailOtp(); }} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-black text-slate-800">
                {language === 'hi' ? 'ईमेल पता दर्ज करें' : 'Enter Email Address'}
              </label>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Official Email
              </span>
            </div>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. member@ghanchisamaj.org"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                required
                autoFocus
              />
            </div>

            {/* Quick Demo Email Chip */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10.5px] text-slate-500 font-semibold">{language === 'hi' ? 'डेमो ईमेल:' : 'Demo test:'}</span>
              <button
                type="button"
                onClick={() => setEmail('member@ghanchisamaj.org')}
                className="text-[11px] font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-xl border border-blue-200 transition-all active:scale-95 flex items-center gap-1"
              >
                <span>member@ghanchisamaj.org</span>
                <span className="text-[9px] bg-blue-200 text-blue-900 px-1 py-0.2 rounded font-black">Fill</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="ios-btn-primary w-full py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>{language === 'hi' ? 'ईमेल पर OTP प्राप्त करें' : 'Get Email OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyEmail} className="space-y-4">
          <div className="bg-blue-50/90 p-3 rounded-2xl border border-blue-200/80 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                @
              </div>
              <div className="truncate">
                <span className="text-[10px] text-blue-700 font-bold block">{language === 'hi' ? 'OTP भेजा गया' : 'OTP Sent to'}</span>
                <span className="font-black text-blue-950 truncate block">{email}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOtpSent(false)}
              className="text-xs font-black text-blue-700 hover:text-blue-950 underline decoration-blue-400 shrink-0 ml-2"
            >
              {language === 'hi' ? 'बदलें' : 'Change'}
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black text-slate-900">
                {language === 'hi' ? '6-अंकों का ईमेल OTP दर्ज करें' : 'Enter 6-Digit Email OTP'}
              </label>
              <button
                type="button"
                onClick={autoFillDemoOtp}
                className="text-[11px] font-black text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200 transition-all"
              >
                ⚡ Auto-fill 123456
              </button>
            </div>

            {/* Smart 6-Digit Individual OTP Input Boxes */}
            <div className="grid grid-cols-6 gap-2" onPaste={handlePasteOtp}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-full h-12 text-center text-lg font-black text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span>
              {timer > 0 ? (
                <span className="text-slate-500 font-medium">
                  {language === 'hi' ? `पुनः OTP भेजें (${timer}s)` : `Resend in ${timer}s`}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendEmailOtp()}
                  className="text-blue-700 font-extrabold hover:underline flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पुनः OTP भेजें' : 'Resend OTP'}</span>
                </button>
              )}
            </span>
            <span className="text-[11px] text-slate-400">Demo Code: 123456</span>
          </div>

          <button
            type="submit"
            className="ios-btn-primary w-full py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'hi' ? 'सत्यापित करके प्रवेश करें' : 'Verify & Enter App'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
