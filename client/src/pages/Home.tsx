// [GSA-HOM-F-PG] - Samaj Home Page & Hero Banner Component
import React from 'react';
import { Users, Heart, Briefcase, Bot, Sparkles, Calendar, ChevronRight, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  openAIBot: () => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, openAIBot }) => {
  // [GSA-HOM-F-PG-01: Language Context & Actions]
  const { t, language } = useLanguage();

  return (
    // [GSA-HOM-F-PG-02: Render Hero Banner & Action Grid]
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* iOS 18 Light Glass Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-10 shadow-xl border border-white/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3.5 py-1 rounded-full text-xs font-extrabold border border-white/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            {t('heroBadge')}
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {t('heroTitle')}
          </h1>
          
          <p className="text-sm sm:text-base text-blue-50 leading-relaxed font-medium max-w-2xl">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-wrap gap-3.5 pt-2">
            <button 
              onClick={() => setActiveTab('matrimony')}
              className="ios-btn-gold font-extrabold px-6 py-3 rounded-2xl shadow-lg text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-amber-300"
            >
              <Heart className="w-4.5 h-4.5 text-slate-950 fill-slate-950" />
              {t('cardMatrimonyTitle')}
            </button>
            
            <button 
              onClick={() => setActiveTab('family')}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-5 py-3 rounded-2xl text-sm flex items-center gap-2 transition-all backdrop-blur-md border border-white/30"
            >
              <Users className="w-4.5 h-4.5" />
              {t('btnViewFamilyTree')}
            </button>
          </div>
        </div>
      </div>

      {/* Category Grid (iOS 18 Light Glass Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Matrimony */}
        <div 
          onClick={() => setActiveTab('matrimony')} 
          className="ios-glass-card p-5 cursor-pointer text-center group transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-200 group-hover:scale-110 transition-transform">
            <Heart className="w-7 h-7 fill-rose-600 text-rose-600" />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
            {t('cardMatrimonyTitle')}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">{t('cardMatrimonySub')}</p>
        </div>

        {/* Family Tree */}
        <div 
          onClick={() => setActiveTab('family')} 
          className="ios-glass-card p-5 cursor-pointer text-center group transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-200 group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
            {t('cardFamilyTitle')}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">{t('cardFamilySub')}</p>
        </div>

        {/* Directory */}
        <div 
          onClick={() => setActiveTab('directory')} 
          className="ios-glass-card p-5 cursor-pointer text-center group transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto mb-3 border border-amber-200 group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
            {t('cardDirectoryTitle')}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">{t('cardDirectorySub')}</p>
        </div>

        {/* Business */}
        <div 
          onClick={() => setActiveTab('business')} 
          className="ios-glass-card p-5 cursor-pointer text-center group transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200 group-hover:scale-110 transition-transform">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
            {t('cardBusinessTitle')}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">{t('cardBusinessSub')}</p>
        </div>

      </div>

      {/* Upcoming Events (iOS 18 Light Glass Card) */}
      <div className="ios-glass-card p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-blue-600" />
            {t('eventsHeader')}
          </h3>
          <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline flex items-center gap-1">
            {t('viewAll')} <ChevronRight className="w-4 h-4" />
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4.5 border border-slate-200/80 flex gap-4 hover:border-blue-400 transition-all">
            <div className="bg-blue-600 text-white rounded-2xl p-3 h-fit text-center min-w-[65px] shadow-sm font-black">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider">OCT</span>
              <span className="block text-xl font-black leading-tight">15</span>
            </div>
            <div className="space-y-1">
              <span className="inline-block bg-blue-100 text-blue-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                {t('event1Category')}
              </span>
              <h4 className="font-extrabold text-sm text-slate-900">{t('event1Title')}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {t('event1Location')}
              </p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4.5 border border-slate-200/80 flex gap-4 hover:border-amber-400 transition-all">
            <div className="ios-btn-gold text-slate-950 rounded-2xl p-3 h-fit text-center min-w-[65px] shadow-sm font-black">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider">NOV</span>
              <span className="block text-xl font-black leading-tight">02</span>
            </div>
            <div className="space-y-1">
              <span className="inline-block bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                {t('event2Category')}
              </span>
              <h4 className="font-extrabold text-sm text-slate-900">{t('event2Title')}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {t('event2Location')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
