// [GSA-FAM-F-CM-02: Add Member Modal Component]
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Users, X, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { FamilyMember } from '../../types/family';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: FamilyMember, relationType: string) => void;
  focusId: string;
  isFirstMember?: boolean;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onAdd, focusId, isFirstMember = false }) => {
  // [GSA-FAM-F-CM-02.A: Relation & Gender Helper State]
  const { t, language } = useLanguage();
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('father');
  const [newMemberStatus, setNewMemberStatus] = useState('married');
  const [newMemberFatherName, setNewMemberFatherName] = useState('');
  const [newMemberMobile, setNewMemberMobile] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    let statusHi = 'अविवाहित';
    let statusEn = 'Unmarried';
    let statusColor = 'bg-slate-200 text-slate-700';

    if (newMemberStatus === 'married') {
      statusHi = 'विवाहित'; statusEn = 'Married'; statusColor = 'bg-emerald-600 text-white';
    } else if (newMemberStatus === 'engaged') {
      statusHi = 'सगाई हो चुकी'; statusEn = 'Engaged'; statusColor = 'bg-pink-500 text-white';
    }

    const isFemale = ['mother', 'grandmother', 'daughter', 'sister'].includes(newMemberRelation);

    let roleHi = 'सदस्य';
    let roleEn = 'Member';

    switch (newMemberRelation) {
      case 'father': roleHi = 'पिता'; roleEn = 'Father'; break;
      case 'mother': roleHi = 'माता'; roleEn = 'Mother'; break;
      case 'grandfather': roleHi = 'दादाजी'; roleEn = 'Grandfather'; break;
      case 'grandmother': roleHi = 'दादीजी'; roleEn = 'Grandmother'; break;
      case 'spouse': roleHi = 'पति/पत्नी'; roleEn = 'Spouse'; break;
      case 'son': roleHi = 'बेटा'; roleEn = 'Son'; break;
      case 'daughter': roleHi = 'बेटी'; roleEn = 'Daughter'; break;
      case 'brother': roleHi = 'भाई'; roleEn = 'Brother'; break;
      case 'sister': roleHi = 'बहन'; roleEn = 'Sister'; break;
    }

    const newMember: FamilyMember = {
      id: isFirstMember ? 'c1' : Date.now().toString(),
      nameHi: newMemberName,
      nameEn: newMemberName, 
      roleHi: isFirstMember ? 'मुखिया' : roleHi,
      roleEn: isFirstMember ? 'Head' : roleEn,
      parentId: isFirstMember ? null : focusId,
      spouseId: null,
      gender: isFemale ? 'F' : 'M',
      detailsHi: newMemberMobile ? `मो. ${newMemberMobile}` : undefined,
      detailsEn: newMemberFatherName ? `Father: ${newMemberFatherName}` : undefined,
      fatherName: newMemberFatherName, // We can attach it here to send to backend
      phone: newMemberMobile,
      avatarUrl: isFemale 
        ? 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' 
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      statusHi,
      statusEn,
      statusColor
    };

    onAdd(newMember, isFirstMember ? 'self' : newMemberRelation);
    setNewMemberName('');
    setNewMemberFatherName('');
    setNewMemberMobile('');
    setNewMemberRelation('father');
    setNewMemberStatus('married');
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="ios-glass-card w-full max-w-md bg-white p-6 shadow-2xl rounded-3xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            {t('btnAddMember')}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-medium text-slate-700">
          <div>
            <label className="block font-bold text-slate-900 mb-1">
              {language === 'hi' ? 'सदस्य का नाम' : 'Full Name'}
            </label>
            <input 
              type="text" 
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder={language === 'hi' ? "उदा: विक्रम घाँची..." : "e.g. Vikram Ghanchi..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
              required
            />
          </div>

          {!isFirstMember && (
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'रिश्ता (चुने हुए सदस्य से)' : 'Relation (to selected focus)'}
              </label>
              <select 
                value={newMemberRelation}
                onChange={(e) => setNewMemberRelation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-bold"
              >
                <optgroup label={language === 'hi' ? 'बुजुर्ग (Parents & Grandparents)' : 'Elders (Parents & Grandparents)'}>
                  <option value="father">{language === 'hi' ? '👨‍👧‍👦 पिता (Father)' : '👨‍👧‍👦 Father'}</option>
                  <option value="mother">{language === 'hi' ? '👩‍👧‍👦 माता (Mother)' : '👩‍👧‍👦 Mother'}</option>
                  <option value="grandfather">{language === 'hi' ? '👴 दादाजी (Grandfather)' : '👴 Grandfather'}</option>
                  <option value="grandmother">{language === 'hi' ? '👵 दादीजी (Grandmother)' : '👵 Grandmother'}</option>
                </optgroup>
                <optgroup label={language === 'hi' ? 'जीवनसाथी (Spouse)' : 'Spouse'}>
                  <option value="spouse">{language === 'hi' ? '💍 पति / पत्नी (Spouse)' : '💍 Spouse'}</option>
                </optgroup>
                <optgroup label={language === 'hi' ? 'संतान व भाई-बहन (Children & Siblings)' : 'Children & Siblings'}>
                  <option value="son">{language === 'hi' ? '👦 बेटा (Son)' : '👦 Son'}</option>
                  <option value="daughter">{language === 'hi' ? '👧 बेटी (Daughter)' : '👧 Daughter'}</option>
                  <option value="brother">{language === 'hi' ? '👨 भाई (Brother)' : '👨 Brother'}</option>
                  <option value="sister">{language === 'hi' ? '👩 बहन (Sister)' : '👩 Sister'}</option>
                </optgroup>
              </select>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-900 mb-1">
              {language === 'hi' ? 'वैवाहिक स्थिति' : 'Marital Status'}
            </label>
            <select 
              value={newMemberStatus}
              onChange={(e) => setNewMemberStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-bold"
            >
              <option value="married">{language === 'hi' ? '👩‍❤️‍👨 विवाहित (Married)' : '👩‍❤️‍👨 Married'}</option>
              <option value="unmarried">{language === 'hi' ? '👤 अविवाहित (Unmarried)' : '👤 Unmarried'}</option>
              <option value="engaged">{language === 'hi' ? '💍 सगाई हो चुकी (Engaged)' : '💍 Engaged'}</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3.5">
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'पिता का नाम (वैकल्पिक)' : "Father's Name (Optional)"}
              </label>
              <input 
                type="text" 
                value={newMemberFatherName}
                onChange={(e) => setNewMemberFatherName(e.target.value)}
                placeholder={language === 'hi' ? "पिता का नाम दर्ज करें" : "Enter father's name"}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'मोबाइल नंबर (वैकल्पिक)' : 'Mobile Number (Optional)'}
              </label>
              <input 
                type="tel" 
                value={newMemberMobile}
                onChange={(e) => setNewMemberMobile(e.target.value)}
                placeholder="9876543210"
                maxLength={10}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="ios-btn-primary w-full py-3 rounded-xl text-xs font-bold shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            {language === 'hi' ? 'वंशावली में जोड़ें' : 'Add to Family Tree'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

