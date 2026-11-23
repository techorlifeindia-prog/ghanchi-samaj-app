// [GSA-ADM-F-CM-04: Admin Edit & Create Member Modal Component]
import React from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AdminMember } from '../../pages/AdminDashboard';
import { GOTRA_OPTIONS, capitalizeWords } from '../../data/locationGotraData';
import { LocationDatalists } from '../common/LocationDatalists';

interface AdminEditMemberModalProps {
  member: AdminMember | null;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  onChange: (updated: AdminMember) => void;
  isSaving: boolean;
}

export const AdminEditMemberModal: React.FC<AdminEditMemberModalProps> = ({
  member,
  onClose,
  onSave,
  onChange,
  isSaving
}) => {
  const { language } = useLanguage();

  if (!member) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="ios-glass-card w-full max-w-lg bg-white shadow-2xl rounded-3xl border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:px-7 shrink-0 bg-white z-10">
          <h3 className="font-extrabold text-base text-slate-900">
            {member.id === 'new' 
              ? (language === 'hi' ? '➕ नया समाज सदस्य जोड़ें' : '➕ Add New Community Member') 
              : (language === 'hi' ? '✏️ सदस्य जानकारी संपादित करें' : '✏️ Edit Member Information')}
          </h3>
          <button onClick={onClose} className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:px-7 space-y-4 text-xs font-medium text-slate-700">
          <LocationDatalists prefix="admin" language={language} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
            <div className="ios-field-group">
              <label className="ios-field-label">
                {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
              </label>
              <input
                type="text"
                autoCapitalize="words"
                value={member.name}
                onChange={(e) => onChange({ ...member, name: capitalizeWords(e.target.value) })}
                className="ios-field-input"
                required
              />
            </div>

            <div className="ios-field-group">
              <label className="ios-field-label">
                {language === 'hi' ? 'पिता / संरक्षक का नाम' : 'Guardian Name'}
              </label>
              <input
                type="text"
                autoCapitalize="words"
                value={member.guardianName || ''}
                onChange={(e) => onChange({ ...member, guardianName: capitalizeWords(e.target.value) })}
                className="ios-field-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
            <div className="ios-field-group">
              <label className="ios-field-label text-amber-800">
                {language === 'hi' ? 'गोत्र' : 'Gotra'}
              </label>
              <select
                value={member.gotra}
                onChange={(e) => onChange({ ...member, gotra: e.target.value })}
                className="ios-field-select"
              >
                {GOTRA_OPTIONS.map(g => (
                  <option key={g.value} value={language === 'hi' ? g.hi : g.en}>
                    {language === 'hi' ? g.hi : g.en}
                  </option>
                ))}
              </select>
            </div>

            <div className="ios-field-group">
              <label className="ios-field-label">
                {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
              </label>
              <input
                type="text"
                value={member.phone}
                onChange={(e) => onChange({ ...member, phone: e.target.value })}
                className="ios-field-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
            <div className="ios-field-group">
              <label className="ios-field-label">
                {language === 'hi' ? 'ईमेल (Email Address)' : 'Email Address'}
              </label>
              <input
                type="email"
                value={member.email || ''}
                onChange={(e) => onChange({ ...member, email: e.target.value })}
                placeholder="member@gmail.com"
                className="ios-field-input"
              />
            </div>
          </div>

          {/* Location Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
            <div className="ios-field-group">
              <label className="ios-field-label">
                {language === 'hi' ? 'मूल गाँव' : 'Native Village'}
              </label>
              <input
                type="text"
                autoCapitalize="words"
                list="admin-village-options"
                value={member.village || ''}
                onChange={(e) => onChange({ ...member, village: capitalizeWords(e.target.value) })}
                className="ios-field-input"
              />
            </div>

            <div className="ios-field-group">
              <label className="ios-field-label">
                {language === 'hi' ? 'ज़िला' : 'District'}
              </label>
              <input
                type="text"
                autoCapitalize="words"
                list="admin-district-options"
                value={member.district || ''}
                onChange={(e) => onChange({ ...member, district: capitalizeWords(e.target.value) })}
                className="ios-field-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
            <div className="ios-field-group">
              <label className="ios-field-label">
                {language === 'hi' ? 'राज्य' : 'State'}
              </label>
              <input
                type="text"
                autoCapitalize="words"
                list="admin-state-options"
                value={member.state || (language === 'hi' ? 'राजस्थान' : 'Rajasthan')}
                onChange={(e) => onChange({ ...member, state: capitalizeWords(e.target.value) })}
                className="ios-field-input"
              />
            </div>

            <div className="ios-field-group">
              <label className="ios-field-label">
                {language === 'hi' ? 'हाल (वर्तमान शहर)' : 'Current City (Hal)'}
              </label>
              <input
                type="text"
                autoCapitalize="words"
                list="admin-city-options"
                value={member.city}
                onChange={(e) => onChange({ ...member, city: capitalizeWords(e.target.value) })}
                className="ios-field-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
            <div className="ios-field-group">
              <label className="ios-field-label">
                {language === 'hi' ? 'भूमिका' : 'Role'}
              </label>
              <input
                type="text"
                value={member.role}
                onChange={(e) => onChange({ ...member, role: e.target.value })}
                className="ios-field-input"
              />
            </div>

            <div className="ios-field-group">
              <label className="ios-field-label">
                {language === 'hi' ? 'सत्यापन स्थिति' : 'Verification Status'}
              </label>
              <select
                value={member.status}
                onChange={(e) => onChange({ ...member, status: e.target.value as 'verified' | 'pending' })}
                className="ios-field-select"
              >
                <option value="verified">{language === 'hi' ? 'सत्यापित (Verified)' : 'Verified'}</option>
                <option value="pending">{language === 'hi' ? 'लंबित (Pending)' : 'Pending'}</option>
              </select>
            </div>
          </div>

          </div>

          {/* Fixed Footer */}
          <div className="p-5 sm:px-7 border-t border-slate-100 shrink-0 bg-slate-50/50">
            <button
              type="submit"
              disabled={isSaving}
              className="ios-btn-primary w-full py-3 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? (language === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...') : (language === 'hi' ? 'सुरक्षित करें' : 'Save Details')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
