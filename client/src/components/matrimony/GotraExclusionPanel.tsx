// [GSA-MAT-F-CM: Gotra Exclusion Panel] - Samaj 2-Gotra Marriage Exclusion Component
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface GotraExclusionPanelProps {
  isGotraRuleActive: boolean;
  setIsGotraRuleActive: (active: boolean) => void;
  gotraExclusionLevel: '1' | '2';
  setGotraExclusionLevel: (level: '1' | '2') => void;
  userPaternalGotra: string;
  setUserPaternalGotra: (gotra: string) => void;
  userMotherGotra: string;
  setUserMotherGotra: (gotra: string) => void;
}

export const GotraExclusionPanel: React.FC<GotraExclusionPanelProps> = ({
  isGotraRuleActive,
  setIsGotraRuleActive,
  gotraExclusionLevel,
  setGotraExclusionLevel,
  userPaternalGotra,
  setUserPaternalGotra,
  userMotherGotra,
  setUserMotherGotra,
}) => {
  // [GSA-MAT-F-CM-01: Language Context & State]
  const { t, language } = useLanguage();

  return (
    // [GSA-MAT-F-CM-02: Render Exclusion Rule Controls]
    <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-3 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <h3 className="font-extrabold text-xs sm:text-sm text-amber-950">
            {t('gotraRuleTitle')}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-white/80 px-3 py-1.5 rounded-xl border border-amber-300 shadow-sm">
            <input 
              type="checkbox" 
              checked={isGotraRuleActive} 
              onChange={(e) => setIsGotraRuleActive(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            {language === 'hi' ? 'स्मार्ट नियम चालू' : 'Smart Rule ON'}
          </label>
        </div>
      </div>
      
      <p className="text-[11px] text-amber-800 font-medium">
        {t('gotraRuleDesc')}
      </p>

      {isGotraRuleActive && (
        <>
          <div className="pt-1">
            <select
              value={gotraExclusionLevel}
              onChange={(e) => setGotraExclusionLevel(e.target.value as '1' | '2')}
              className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-amber-500 shadow-sm"
            >
              <option value="1">{t('level1Gotra')}</option>
              <option value="2">{t('level2Gotra')}</option>
            </select>
          </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('mySelfGotra')}</label>
          <select 
            value={userPaternalGotra} 
            onChange={(e) => setUserPaternalGotra(e.target.value)}
            className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-amber-500 shadow-sm"
          >
            <option value="बोराणा">बोराणा (Borana)</option>
            <option value="सोलंकी">सोलंकी (Solanki)</option>
            <option value="पंवार">पंवार (Panwar)</option>
            <option value="राठौड़">राठौड़ (Rathore)</option>
            <option value="भाटी">भाटी (Bhati)</option>
            <option value="चौहान">चौहान (Chauhan)</option>
            <option value="सिसोदिया">सिसोदिया (Sisodia)</option>
            <option value="परमार">परमार (Parmar)</option>
            <option value="गहलोत">गहलोत (Gehlot)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('myMotherGotra')}</label>
          <select 
            value={userMotherGotra} 
            onChange={(e) => setUserMotherGotra(e.target.value)}
            className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-amber-500 shadow-sm"
          >
            <option value="बोराणा">बोराणा (Borana)</option>
            <option value="सोलंकी">सोलंकी (Solanki)</option>
            <option value="पंवार">पंवार (Panwar)</option>
            <option value="राठौड़">राठौड़ (Rathore)</option>
            <option value="भाटी">भाटी (Bhati)</option>
            <option value="चौहान">चौहान (Chauhan)</option>
            <option value="सिसोदिया">सिसोदिया (Sisodia)</option>
            <option value="परमार">परमार (Parmar)</option>
            <option value="गहलोत">गहलोत (Gehlot)</option>
          </select>
        </div>
        </div>
        </>
      )}
    </div>
  );
};
