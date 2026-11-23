// [GSA-ADM-F-CM-01: Admin Overview Statistics & Demographics Component]
import React from 'react';
import { Users, ShieldCheck, Heart, BarChart3, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AdminMember } from '../../pages/AdminDashboard';

interface AdminOverviewTabProps {
  membersList: AdminMember[];
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ membersList }) => {
  const { language } = useLanguage();

  const metrics = React.useMemo(() => {
    const memberCount = membersList.length;
    const verifiedCount = membersList.filter(m => m.status === 'verified').length;
    const uniqueDistricts = new Set(membersList.map(m => m.city).filter(Boolean));
    const matrimonyCount = membersList.filter(m => 
      m.role.toLowerCase().includes('sister') || 
      m.role.toLowerCase().includes('brother') || 
      m.role.toLowerCase().includes('unmarried')
    ).length;

    return {
      totalMembers: memberCount,
      verifiedFamilies: verifiedCount,
      matrimonyProfiles: matrimonyCount,
      activeDistricts: uniqueDistricts.size
    };
  }, [membersList]);

  const districtCensus = React.useMemo(() => {
    const map = new Map<string, { total: number; verified: number; matrimony: number }>();
    membersList.forEach(m => {
      const city = m.city || 'Unknown';
      if (!map.has(city)) {
        map.set(city, { total: 0, verified: 0, matrimony: 0 });
      }
      const data = map.get(city)!;
      data.total++;
      if (m.status === 'verified') data.verified++;
      if (m.role.toLowerCase().includes('sister') || m.role.toLowerCase().includes('brother') || m.role.toLowerCase().includes('unmarried')) data.matrimony++; 
    });
    return Array.from(map.entries()).map(([district, stats]) => ({ district, ...stats }));
  }, [membersList]);

  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-3 sm:p-4">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="ios-glass-card p-3 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-900 leading-none mb-1">{metrics.totalMembers.toLocaleString()}</span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold leading-tight">{language === 'hi' ? 'कुल सदस्य' : 'Total Members'}</span>
          </div>
        </div>

        <div className="ios-glass-card p-3 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-900 leading-none mb-1">{metrics.verifiedFamilies.toLocaleString()}</span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold leading-tight">{language === 'hi' ? 'सत्यापित परिवार' : 'Verified'}</span>
          </div>
        </div>

        <div className="ios-glass-card p-3 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-rose-600" />
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-900 leading-none mb-1">{metrics.matrimonyProfiles.toLocaleString()}</span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold leading-tight">{language === 'hi' ? 'वैवाहिक बायोडाटा' : 'Matrimony'}</span>
          </div>
        </div>

        <div className="ios-glass-card p-3 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="block text-lg sm:text-xl font-black text-slate-900 leading-none mb-1">{metrics.activeDistricts.toLocaleString()}</span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold leading-tight">{language === 'hi' ? 'सक्रिय ज़िला' : 'Districts'}</span>
          </div>
        </div>
      </div>

      {/* District Breakdown Table */}
      <div className="ios-glass-card p-6 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          {language === 'hi' ? 'ज़िला अनुसार वंशावली एवं सदस्य आंकड़े' : 'District Demographics Census'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700 min-w-[520px]">
            <thead className="text-[11px] font-extrabold uppercase bg-slate-100 text-slate-800 rounded-xl whitespace-nowrap">
              <tr>
                <th className="p-3">{language === 'hi' ? 'ज़िला' : 'District'}</th>
                <th className="p-3">{language === 'hi' ? 'कुल सदस्य' : 'Total Members'}</th>
                <th className="p-3">{language === 'hi' ? 'सत्यापित परिवार' : 'Verified Families'}</th>
                <th className="p-3">{language === 'hi' ? 'वैवाहिक प्रोफ़ाइल' : 'Matrimony Profiles'}</th>
                <th className="p-3">{language === 'hi' ? 'स्थिति' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium whitespace-nowrap">
              {districtCensus.length > 0 ? (
                districtCensus.map(data => (
                  <tr key={data.district}>
                    <td className="p-3 font-bold text-slate-900">{data.district}</td>
                    <td className="p-3">{data.total}</td>
                    <td className="p-3">{data.verified}</td>
                    <td className="p-3">{data.matrimony}</td>
                    <td className="p-3">
                      <span className="ios-badge-verified px-2 py-0.5 rounded-full font-bold">
                        {language === 'hi' ? '100% सक्रिय' : '100% Active'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-sm font-semibold">
                    {language === 'hi' ? 'कोई डेटा उपलब्ध नहीं है' : 'No data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
