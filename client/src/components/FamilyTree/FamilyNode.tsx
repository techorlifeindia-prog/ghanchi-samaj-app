// [GSA-FAM-F-CM-01: Family Node Component]
import React from 'react';
import { FamilyMember } from '../../types/family';
import { useLanguage } from '../../context/LanguageContext';

interface FamilyNodeProps {
  node: FamilyMember;
  isClickable?: boolean;
  isFocus?: boolean;
  onClick?: (id: string) => void;
}

export const FamilyNode: React.FC<FamilyNodeProps> = ({ node, isClickable = true, isFocus = false, onClick }) => {
  const { language } = useLanguage();
  const isFemale = node.gender === 'F';
  
  let borderColor = 'border-slate-200';
  let tagBg = isFemale ? 'bg-pink-500 text-white' : 'bg-blue-600 text-white';
  let extraClasses = '';
  
  if (isFocus) {
    borderColor = 'border-amber-400 ring-4 ring-amber-400/40 bg-gradient-to-br from-amber-500/15 via-amber-100/40 to-white';
    tagBg = 'ios-btn-gold text-slate-900 font-black shadow-sm';
    extraClasses = 'scale-105 z-10 shadow-lg';
  } else if (isClickable) {
    borderColor = 'border-amber-200 border-dashed hover:border-amber-400';
  } else {
    borderColor = isFemale ? 'border-pink-300' : 'border-blue-300';
  }

  const defaultAvatar = isFemale
    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';

  const avatarSrc = node.avatarUrl || defaultAvatar;

  return (
    <div 
      onClick={() => isClickable && onClick && onClick(node.id)}
      className={`bg-white/95 backdrop-blur-md py-1.5 px-2 rounded-2xl border text-center flex flex-col items-center justify-center flex-1 max-w-[130px] sm:max-w-[155px] transition-all duration-300 ${isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : ''} ${borderColor} ${extraClasses}`}
    >
      <div className="relative mb-0.5">
        <img 
          src={avatarSrc} 
          alt={node.nameEn} 
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover mx-auto border-2 border-white shadow-md ring-1 ring-amber-300/60" 
        />
        <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-[6.5px] sm:text-[7.5px] font-black px-1.5 py-0.2 rounded-full whitespace-nowrap shadow-sm leading-none ${tagBg}`}>
          {language === 'hi' ? node.roleHi : node.roleEn}
        </span>
      </div>

      <h4 className="font-black text-[10px] sm:text-[11px] text-slate-900 mt-1 leading-tight truncate w-full">
        {language === 'hi' ? node.nameHi : node.nameEn}
      </h4>
      {(node.detailsHi || node.detailsEn) && (
        <p className="text-[7.5px] sm:text-[8px] text-slate-500 mt-0.5 font-semibold leading-none truncate w-full">
          {language === 'hi' ? node.detailsHi : node.detailsEn}
        </p>
      )}
      {(node.statusHi || node.statusEn) && (
        <span className={`inline-block mt-0.5 text-[7px] sm:text-[7.5px] font-bold px-1 py-0 rounded shadow-sm leading-tight ${node.statusColor}`}>
          {language === 'hi' ? node.statusHi : node.statusEn}
        </span>
      )}
    </div>
  );
};
