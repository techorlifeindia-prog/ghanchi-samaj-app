// [GSA-ADM-F-CM-03: Admin Member Management & Search Table Component]
import React, { useState, useMemo } from 'react';
import { Search, UserCheck, CheckCircle2, AlertCircle, Edit3, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AdminMember } from '../../pages/AdminDashboard';
import { ConfirmModal } from '../common/ConfirmModal';
import { ActionMenu } from '../common/ActionMenu';

interface AdminMembersTabProps {
  membersList: AdminMember[];
  isLoading: boolean;
  onEdit: (member: AdminMember) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const AdminMembersTab: React.FC<AdminMembersTabProps> = ({
  membersList,
  isLoading,
  onEdit,
  onDelete,
  onAddNew
}) => {
  const { language } = useLanguage();
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    if (!memberSearchTerm.trim()) return membersList;
    const q = memberSearchTerm.toLowerCase();
    return membersList.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.gotra.toLowerCase().includes(q) ||
      (m.village && m.village.toLowerCase().includes(q)) ||
      m.city.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      (m.email && m.email.toLowerCase().includes(q))
    );
  }, [membersList, memberSearchTerm]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="shrink-0 border-b border-slate-200/60 p-3 sm:p-4 bg-white/40 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={memberSearchTerm}
            onChange={(e) => setMemberSearchTerm(e.target.value)}
            placeholder={language === 'hi' ? 'नाम, गोत्र या शहर से खोजें...' : 'Search by Name, Gotra or City...'}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <button
          onClick={onAddNew}
          className="ios-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm whitespace-nowrap"
        >
          <UserCheck className="w-4 h-4" />
          {language === 'hi' ? 'नया सदस्य जोड़ें' : 'Add Member'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-3">
              {filteredMembers.map((m) => (
                <div key={m.id} className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-sm shrink-0 border border-blue-200">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                          {m.name}
                        </h4>
                        {m.guardianName && (
                          <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                            {m.guardianName}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {m.role}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-1">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="ios-badge-gotra text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                            {m.gotra}
                          </span>
                          {m.status === 'verified' ? (
                            <span className="ios-badge-verified px-1.5 py-0.5 rounded-md text-[9px] font-bold inline-flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              {language === 'hi' ? 'सत्यापित' : 'Verified'}
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-md text-[9px] font-bold inline-flex items-center gap-0.5">
                              <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                              {language === 'hi' ? 'लंबित' : 'Pending'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="-mt-1 -mr-1">
                        <ActionMenu
                          items={[
                            { label: language === 'hi' ? 'संपादित करें' : 'Edit', icon: <Edit3 />, onClick: () => onEdit(m) },
                            { label: language === 'hi' ? 'हटाएं' : 'Delete', icon: <Trash2 />, onClick: () => setMemberToDelete(m.id), variant: 'danger' }
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 font-medium bg-slate-50/80 p-2 rounded-xl border border-slate-100 grid grid-cols-2 gap-y-1 gap-x-2">
                    <p className="truncate">🏡 {language === 'hi' ? 'गाँव' : 'Village'}: <span className="font-bold text-slate-800">{m.village || '-'}</span></p>
                    <p className="truncate">🗺️ {language === 'hi' ? 'ज़िला' : 'District'}: <span className="font-bold text-slate-800">{m.district || '-'}</span></p>
                    <p className="truncate">📍 {language === 'hi' ? 'हाल' : 'City'}: <span className="font-bold text-slate-800">{m.city || '-'}</span></p>
                    <p className="truncate">📱 {language === 'hi' ? 'फ़ोन' : 'Phone'}: <span className="font-bold text-slate-800">{m.phone}</span></p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block ios-glass-card overflow-hidden">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="text-[11px] font-extrabold uppercase bg-slate-100 text-slate-800">
                  <tr>
                    <th className="p-3">{language === 'hi' ? 'सदस्य का नाम' : 'Member Name'}</th>
                    <th className="p-3">{language === 'hi' ? 'गोत्र' : 'Gotra'}</th>
                    <th className="p-3">{language === 'hi' ? 'मूल गाँव / शहर' : 'Village / City'}</th>
                    <th className="p-3">{language === 'hi' ? 'संपर्क' : 'Contact'}</th>
                    <th className="p-3">{language === 'hi' ? 'स्थिति' : 'Status'}</th>
                    <th className="p-3 text-right">{language === 'hi' ? 'कार्रवाई' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{m.name}</div>
                        {m.guardianName && <div className="text-[10px] text-slate-500 font-medium mt-0.5">{m.guardianName}</div>}
                      </td>
                      <td className="p-3"><span className="ios-badge-gotra text-[11px] font-extrabold px-2 py-0.5 rounded-full">{m.gotra}</span></td>
                      <td className="p-3">{m.village || m.city}, {m.state || ''}</td>
                      <td className="p-3">
                        <div className="font-mono text-slate-900">{m.phone}</div>
                        {m.email && <div className="text-[10px] text-blue-600 font-sans truncate max-w-[140px]">{m.email}</div>}
                      </td>
                      <td className="p-3">
                        {m.status === 'verified' ? (
                          <span className="ios-badge-verified px-2 py-0.5 rounded-full text-[10px] font-bold">{language === 'hi' ? 'सत्यापित' : 'Verified'}</span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">{language === 'hi' ? 'लंबित' : 'Pending'}</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end">
                          <ActionMenu
                            items={[
                              { label: language === 'hi' ? 'संपादित करें' : 'Edit', icon: <Edit3 />, onClick: () => onEdit(m) },
                              { label: language === 'hi' ? 'हटाएं' : 'Delete', icon: <Trash2 />, onClick: () => setMemberToDelete(m.id), variant: 'danger' }
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!memberToDelete}
        title={language === 'hi' ? 'सदस्य को हटाएं?' : 'Delete Member?'}
        message={language === 'hi' ? 'क्या आप वाकई इस सदस्य को हटाना चाहते हैं? यह डेटा वापस नहीं लाया जा सकेगा।' : 'Are you sure you want to delete this member? This action cannot be undone.'}
        confirmText={language === 'hi' ? 'हाँ, हटाएं' : 'Yes, Delete'}
        cancelText={language === 'hi' ? 'रद्द करें' : 'Cancel'}
        onConfirm={() => {
          if (memberToDelete) onDelete(memberToDelete);
        }}
        onCancel={() => setMemberToDelete(null)}
      />
    </div>
  );
};
