// [GSA-MAT-F-CM-01: Matrimonial Candidate Profile Card Component]
import React from 'react';
import { Heart, MapPin, GraduationCap, Briefcase, Download, Star, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { MatrimonyProfileItem } from './BiodataModal';

interface MatrimonialProfileCardProps {
  profile: MatrimonyProfileItem;
  isShortlisted: boolean;
  isInterestSent: boolean;
  onToggleShortlist: (id: string) => void;
  onSendInterest: (id: string) => void;
  onOpenBiodata: (profile: MatrimonyProfileItem) => void;
}

export const MatrimonialProfileCard: React.FC<MatrimonialProfileCardProps> = ({
  profile: p,
  isShortlisted,
  isInterestSent,
  onToggleShortlist,
  onSendInterest,
  onOpenBiodata
}) => {
  const { language } = useLanguage();

  return (
    <div className="ios-glass-card group overflow-hidden bg-white/95 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div className="relative">
        <div className="h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
          <img
            src={p.photo}
            alt={p.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="ios-badge-gotra font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-sm">
            {p.gotra}
          </span>
          {p.verified && (
            <span className="ios-badge-verified font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              {language === 'hi' ? 'सत्यापित' : 'Verified'}
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleShortlist(p.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isShortlisted ? 'bg-rose-500 text-white shadow-lg scale-110' : 'bg-white/80 text-slate-600 hover:bg-white'
          }`}
          title={isShortlisted ? 'Shortlisted' : 'Shortlist'}
        >
          <Star className={`w-4 h-4 ${isShortlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-black text-base text-slate-900 group-hover:text-amber-800 transition-colors">
                {p.name}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {p.age} {language === 'hi' ? 'वर्ष' : 'Yrs'} • {p.height}
              </p>
            </div>
            <span className="text-[10.5px] font-bold text-amber-900 bg-amber-100/90 border border-amber-200 px-2 py-0.5 rounded-lg">
              {language === 'hi' ? 'ननिहाल' : 'Nanihal'}: {p.nanihal || 'N/A'}
            </span>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100 mt-3 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{p.education}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{p.profession} {p.company ? `(${p.company})` : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">{p.city}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => onSendInterest(p.id)}
            disabled={isInterestSent}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isInterestSent
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-sm hover:scale-[1.02]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isInterestSent ? 'fill-emerald-800' : 'fill-white'}`} />
            {isInterestSent
              ? (language === 'hi' ? 'रुचि भेजी' : 'Sent')
              : (language === 'hi' ? 'रुचि भेजें' : 'Send Interest')}
          </button>

          <button
            onClick={() => onOpenBiodata(p)}
            className="py-2 px-3 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
          >
            <Download className="w-3.5 h-3.5" />
            {language === 'hi' ? 'बायोडाटा PDF' : 'Biodata PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};
