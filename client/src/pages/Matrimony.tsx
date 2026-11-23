// [GSA-MAT-F-PG] - Matrimonial Bureau & Matchmaker Page Component
import React, { useState, useEffect } from 'react';
import { Heart, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { BiodataModal, MatrimonyProfileItem } from '../components/matrimony/BiodataModal';
import { GotraExclusionPanel } from '../components/matrimony/GotraExclusionPanel';
import { MatrimonialProfileCard } from '../components/matrimony/MatrimonialProfileCard';

export const Matrimony: React.FC = () => {
  // [GSA-MAT-F-PG-01: State Management & Filters]
  const { language } = useLanguage();
  const { showToast } = useToast();
  const [shortlisted, setShortlisted] = useState<Record<string, boolean>>({});
  const [interestSent, setInterestSent] = useState<Record<string, boolean>>({});
  const [selectedProfileForBiodata, setSelectedProfileForBiodata] = useState<MatrimonyProfileItem | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGotra, setSelectedGotra] = useState('');
  const [selectedAge, setSelectedAge] = useState('');

  // Samaj Gotra Exclusion State
  const [isGotraRuleActive, setIsGotraRuleActive] = useState(true);
  const [gotraExclusionLevel, setGotraExclusionLevel] = useState<'1' | '2'>('1');
  const [userPaternalGotra, setUserPaternalGotra] = useState('बोराणा');
  const [userMotherGotra, setUserMotherGotra] = useState('सोलंकी');

  const [profiles, setProfiles] = useState<MatrimonyProfileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/matrimony')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const formatted = data.data.map((p: any) => ({
            id: p.id,
            name: p.name || 'Unknown',
            age: p.age || 25,
            height: p.height || "5'5\"",
            education: p.education || 'N/A',
            profession: p.profession || 'N/A',
            company: p.company || '',
            city: p.city || 'Unknown',
            gotra: p.gotra || '',
            nanihal: p.nanihal || '',
            photo: p.photo || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&q=80',
            status: p.status || 'Available',
            verified: p.verified || false,
            fatherName: p.fatherName || '',
            motherName: p.motherName || ''
          }));
          setProfiles(formatted);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch matrimony profiles:", err);
        setIsLoading(false);
      });
  }, []);

  // [GSA-MAT-F-PG-02: Gotra Exclusion Filter Logic]
  const checkGotraExcluded = (p: MatrimonyProfileItem) => {
    if (!isGotraRuleActive) return false;
    const pGotra = (p.gotra || '').toLowerCase();
    const pNanihal = (p.nanihal || '').toLowerCase();
    const selfG = (userPaternalGotra || '').toLowerCase();
    const momG = (userMotherGotra || '').toLowerCase();

    if (!selfG) return false;
    let isExcluded = selfG && pGotra.includes(selfG);

    if (gotraExclusionLevel === '2') {
      const matchesMom = momG && pGotra.includes(momG);
      const nanihalMatchesSelf = selfG && pNanihal.includes(selfG);
      const nanihalMatchesMom = momG && pNanihal.includes(momG);
      isExcluded = isExcluded || matchesMom || nanihalMatchesSelf || nanihalMatchesMom;
    }
    return isExcluded;
  };

  const filteredProfiles = profiles.filter((p) => {
    if (isGotraRuleActive && checkGotraExcluded(p)) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchGotra = p.gotra.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchProf = p.profession.toLowerCase().includes(q);
      if (!matchName && !matchGotra && !matchCity && !matchProf) return false;
    }

    if (selectedGotra && p.gotra !== selectedGotra) return false;
    if (selectedAge && p.age > parseInt(selectedAge)) return false;

    return true;
  });

  const toggleShortlist = (id: string) => {
    setShortlisted(prev => ({ ...prev, [id]: !prev[id] }));
    showToast(shortlisted[id] ? (language === 'hi' ? 'शॉर्टलिस्ट से हटाया' : 'Removed from shortlist') : (language === 'hi' ? '⭐ बायोडाटा शॉर्टलिस्ट किया गया!' : '⭐ Profile Shortlisted!'), 'info');
  };

  const handleSendInterest = (id: string) => {
    setInterestSent(prev => ({ ...prev, [id]: true }));
    showToast(language === 'hi' ? '💖 रुचि प्रस्ताव सफलतापूर्वक भेजा गया!' : '💖 Express Interest Request Sent!', 'success');
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4">
      {/* Top Banner Header */}
      <div className="ios-glass-card p-6 sm:p-8 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 border border-rose-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            {language === 'hi' ? 'श्री घाँची समाज वैवाहिक मंच' : 'Ghanchi Samaj Matrimonial Portal'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {language === 'hi' ? 'सत्यापित विवाह संबंध एवं बायोडाटा' : 'Verified Community Matches & Biodatas'}
          </h1>
          <p className="text-xs text-slate-600 font-semibold mt-1">
            {language === 'hi' ? '2-गोत्र परिहार नियम के तहत सुरक्षित एवं पवित्र संबंध खोजें' : 'Sacred & authentic matches powered by 2-Gotra exclusion rules'}
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'hi' ? 'नाम, गोत्र या शहर खोजें...' : 'Search by Name, Gotra, City...'}
            className="w-full bg-white/90 border border-slate-200 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
          />
        </div>
      </div>

      {/* 2-Gotra Samaj Rule Panel */}
      <GotraExclusionPanel
        isGotraRuleActive={isGotraRuleActive}
        setIsGotraRuleActive={setIsGotraRuleActive}
        gotraExclusionLevel={gotraExclusionLevel}
        setGotraExclusionLevel={setGotraExclusionLevel}
        userPaternalGotra={userPaternalGotra}
        setUserPaternalGotra={setUserPaternalGotra}
        userMotherGotra={userMotherGotra}
        setUserMotherGotra={setUserMotherGotra}
      />

      {/* Profiles Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="ios-glass-card p-12 text-center text-slate-500 space-y-2">
          <p className="text-base font-extrabold">
            {language === 'hi' ? 'कोई बायोडाटा फ़िल्टर से मेल नहीं खाता' : 'No profiles match your current search filters'}
          </p>
          <p className="text-xs font-medium">
            {language === 'hi' ? 'कृपया गोत्र नियम या खोज शब्द बदलकर पुनः प्रयास करें।' : 'Try relaxing 2-Gotra exclusion filters or search keywords.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((p) => (
            <MatrimonialProfileCard
              key={p.id}
              profile={p}
              isShortlisted={!!shortlisted[p.id]}
              isInterestSent={!!interestSent[p.id]}
              onToggleShortlist={toggleShortlist}
              onSendInterest={handleSendInterest}
              onOpenBiodata={(profile) => setSelectedProfileForBiodata(profile)}
            />
          ))}
        </div>
      )}

      {/* Printable Biodata Modal */}
      {selectedProfileForBiodata && (
        <BiodataModal
          profile={selectedProfileForBiodata}
          onClose={() => setSelectedProfileForBiodata(null)}
        />
      )}
    </div>
  );
};
