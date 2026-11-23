// [GSA-DIR-F-PG] - Samaj Member Directory Page Component
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Users, PhoneCall, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Directory: React.FC = () => {
  // [GSA-DIR-F-PG-01: Member Search & Filter State]
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGotra, setSelectedGotra] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const gotras = [
    'बोराणा (Borana)',
    'सोलंकी (Solanki)',
    'पंवार (Panwar)',
    'राठौड़ (Rathore)',
    'भाटी (Bhati)',
    'चौहान (Chauhan)',
    'परमार (Parmar)',
    'गहलोत (Gehlot)',
  ];

  const villages = [
    'बागरा (Bagra)',
    'आकोली (Aakoli)',
    'सियाणा (Siyana)',
    'धानपुर (Dhanpur)',
    'रायपुरिया (Raipuriya)',
    'बिबलसर (Bibalsar)',
    'डूडसी (Dudsi)',
    'नागणी (Nagani)',
    'मायलावास (Maylawas)',
    'मोक (Mok)',
    'रेवतड़ा (Revatda)',
    'साँथू (Santhu)',
    'चूरा (Chura)',
    'धाणसा (Dhansa)',
    'बाकरा (Bakra)',
    'सेरणा (Serna)',
  ];

  useEffect(() => {
    fetchMembers();
  }, [searchTerm, selectedGotra, selectedVillage]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (selectedGotra) params.append('gotra', selectedGotra);
      if (selectedVillage) params.append('village', selectedVillage);

      const response = await fetch(`/api/members?${params.toString()}`);
      if (response.ok) {
        const json = await response.json();
        setMembers(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch directory members:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* iOS 18 Light Glass Search Header Panel */}
      <div className="ios-glass-card p-6 space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Users className="w-6 h-6 text-blue-600" />
          {t('dirTitle')}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-white/70 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm backdrop-blur-md"
            />
          </div>
          <select 
            value={selectedGotra}
            onChange={(e) => setSelectedGotra(e.target.value)}
            className="bg-white/70 border border-slate-200 text-slate-700 rounded-2xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm backdrop-blur-md"
          >
            <option value="">{t('allGotra')}</option>
            {gotras.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select 
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="bg-white/70 border border-slate-200 text-slate-700 rounded-2xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm backdrop-blur-md"
          >
            <option value="">{language === 'hi' ? 'सभी गाँव' : 'All Villages'}</option>
            {villages.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="ios-glass-card p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">डेटा लोड हो रहा है... (Loading Directory)</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((m) => (
            <div 
              key={m.id} 
              className="ios-glass-card p-5 flex items-center justify-between gap-4 hover:border-blue-400 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center font-bold text-xl text-slate-700 border-2 border-white shadow-md shrink-0">
                  👤
                </div>
                <div className="space-y-1">
                  <span className="inline-block ios-badge-gotra text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    {m.paternalGotra || m.gotra}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">{m.fullName || m.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {m.currentCity || m.city}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" /> {m.professionDetails || m.profession}
                  </p>
                </div>
              </div>

              <a 
                href={`tel:${m.phone}`} 
                className="ios-btn-primary p-3.5 rounded-2xl transition-all shadow-md shrink-0"
                title={t('btnCall')}
              >
                <PhoneCall className="w-4.5 h-4.5 text-white" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
