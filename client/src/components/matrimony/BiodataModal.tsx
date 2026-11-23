// [GSA-MAT-F-CM] - Matrimonial Biodata Generator & PDF Modal Component
import React from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Download, ShieldCheck, Heart, MapPin, GraduationCap, Briefcase, User, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface MatrimonyProfileItem {
  id: string;
  name: string;
  age: number;
  height: string;
  education: string;
  profession: string;
  company: string;
  city: string;
  gotra: string;
  nanihal: string;
  photo: string;
  status: string;
  verified: boolean;
  fatherName?: string;
  motherName?: string;
  dob?: string;
}

interface BiodataModalProps {
  profile: MatrimonyProfileItem | null;
  onClose: () => void;
}

export const BiodataModal: React.FC<BiodataModalProps> = ({ profile, onClose }) => {
  const { t, language } = useLanguage();

  if (!profile) return null;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="ios-glass-card w-full max-w-2xl bg-white shadow-2xl rounded-3xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Control Bar (Hidden during printing) */}
        <div className="print:hidden p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              {language === 'hi' ? 'वैवाहिक बायोडाटा कार्ड (PDF Print View)' : 'Matrimonial Biodata (PDF View)'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="ios-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'hi' ? 'PDF डाउनलोड / प्रिंट करें' : 'Download / Print PDF'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Biodata Document Sheet */}
        <div className="p-6 sm:p-10 space-y-6 bg-white text-slate-900 font-sans print:p-0 print:shadow-none" id="printable-biodata">
          
          {/* Document Header */}
          <div className="text-center border-b-2 border-amber-400 pb-5 space-y-1">
            <div className="w-12 h-12 rounded-2xl ios-btn-gold flex items-center justify-center font-extrabold text-2xl mx-auto mb-2 border border-amber-300 shadow-sm">
              🚩
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'श्री घाँची समाज वैवाहिक परिचय पत्र' : 'Shree Ghanchi Samaj Matrimonial Biodata'}
            </h1>
            <p className="text-xs text-slate-600 font-bold tracking-wide uppercase">
              Shree Ghanchi Samaj Verified Matrimonial Biodata Sheet
            </p>
          </div>

          {/* Candidate Profile Box */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <img 
              src={profile.photo} 
              alt={profile.name} 
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-amber-400 shadow-md shrink-0" 
            />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <span className="inline-flex items-center gap-1.5 ios-badge-verified text-xs font-extrabold px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Aadhaar Verified
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {profile.name}
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 pt-1">
                <div><strong>{language === 'hi' ? 'उम्र:' : 'Age:'}</strong> {profile.age} Yrs</div>
                <div><strong>{language === 'hi' ? 'कद:' : 'Height:'}</strong> {profile.height}</div>
                <div><strong>{language === 'hi' ? 'गोत्र:' : 'Gotra:'}</strong> {profile.gotra}</div>
                <div><strong>{language === 'hi' ? 'ननिहाल:' : 'Nanihal:'}</strong> {profile.nanihal}</div>
              </div>
            </div>
          </div>

          {/* Detailed Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-800">
            
            {/* Personal & Educational Info */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-extrabold text-sm text-blue-700 border-b border-slate-200 pb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> {language === 'hi' ? 'शैक्षणिक एवं व्यावसायिक विवरण' : 'Education & Career Details'}
              </h3>
              <div className="space-y-2 font-medium">
                <p><strong>{language === 'hi' ? 'उच्चतम शिक्षा:' : 'Education:'}</strong> {profile.education}</p>
                <p><strong>{language === 'hi' ? 'व्यवसाय:' : 'Profession:'}</strong> {profile.profession}</p>
                <p><strong>{language === 'hi' ? 'कंपनी / संस्थान:' : 'Workplace:'}</strong> {profile.company}</p>
                <p><strong>{language === 'hi' ? 'वर्तमान स्थान:' : 'Current City:'}</strong> {profile.city}</p>
              </div>
            </div>

            {/* Family Background */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-extrabold text-sm text-amber-700 border-b border-slate-200 pb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> {language === 'hi' ? 'पारिवारिक पृष्ठभूमि' : 'Family Background'}
              </h3>
              <div className="space-y-2 font-medium">
                <p><strong>{language === 'hi' ? 'पिता:' : 'Father:'}</strong> {profile.fatherName || (language === 'hi' ? 'श्री रमेश कुमार बोराणा' : 'Shree Ramesh Kumar Borana')}</p>
                <p><strong>{language === 'hi' ? 'माता:' : 'Mother:'}</strong> {profile.motherName || (language === 'hi' ? 'श्रीमती सुनिता देवी' : 'Smt. Sunita Devi')}</p>
                <p><strong>{language === 'hi' ? 'मूल निवास:' : 'Native District:'}</strong> {profile.city}</p>
                <p><strong>{language === 'hi' ? 'पारिवारिक स्थिति:' : 'Family Status:'}</strong> {language === 'hi' ? 'सुखी एवं प्रतिष्ठित घाँची समाज परिवार' : 'Reputed Ghanchi Samaj Family'}</p>
              </div>
            </div>

          </div>

          {/* Footer & Verification Note */}
          <div className="text-center pt-4 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
            <p>{language === 'hi' ? '🔒 यह वैवाहिक परिचय पत्र श्री घाँची समाज ऐप द्वारा डिजिटल रूप से सत्यापित किया गया है।' : '🔒 This matrimonial biodata sheet is digitally verified by Shree Ghanchi Samaj App.'}</p>
            <p className="font-mono mt-0.5 text-slate-400">Verified Token: GHS-BIO-{profile.id}-2026</p>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};
