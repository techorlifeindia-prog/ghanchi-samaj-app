// [GSA-ADM-F-CM-02: Admin KYC Verification Queue Tab Component]
import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AdminKycTabProps {
  kycQueue: any[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const AdminKycTab: React.FC<AdminKycTabProps> = ({ kycQueue, onApprove, onReject }) => {
  const { language } = useLanguage();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="shrink-0 flex items-center justify-between border-b border-slate-200/60 p-3 sm:p-4 bg-white/40">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            {language === 'hi' ? 'लंबित आधार KYC सत्यापन कतार' : 'Pending Aadhaar KYC Approvals Queue'}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {language === 'hi' ? 'सदस्यों द्वारा सबमिट किए गए मास्क आधार कार्ड की समीक्षा करें' : 'Review masked Aadhaar submissions'}
          </p>
        </div>
        <span className="ios-badge-gotra text-xs font-bold px-3 py-1 rounded-full">
          {kycQueue.length} {language === 'hi' ? 'लंबित' : 'Pending'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {kycQueue.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-medium text-xs">
            ✅ {language === 'hi' ? 'सभी आधार KYC सबमिशन स्वीकृत हो चुके हैं!' : 'All pending KYC applications approved!'}
          </div>
        ) : (
          <div className="space-y-3">
            {kycQueue.map((item) => (
              <div key={item.id} className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {item.aadhaarMasked}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    📱 {item.phone} | 📍 {item.city} | 🕒 {item.submittedDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onApprove(item.id)}
                    className="ios-btn-primary text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {language === 'hi' ? 'स्वीकार करें' : 'Approve'}
                  </button>
                  <button
                    onClick={() => onReject(item.id)}
                    className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-rose-200"
                  >
                    <XCircle className="w-4 h-4" />
                    {language === 'hi' ? 'अस्वीकार करें' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
