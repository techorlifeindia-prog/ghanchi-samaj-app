// [GSA-PRO-F-CM-01: Common Member Information Feed & Admin Edit Modal Component]
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserCheck, X, Save } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { GOTRA_OPTIONS, capitalizeWords } from '../../data/locationGotraData';
import { LocationDatalists } from '../common/LocationDatalists';

export interface MemberFormData {
  id?: string;
  name: string;
  guardianName: string;
  gotra: string;
  motherGotra: string;
  village: string;
  district?: string;
  state?: string;
  city: string;
  occupation: string;
  phone: string;
  email?: string;
  status?: 'verified' | 'pending';
  role?: string;
}

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MemberFormData) => void;
  initialData?: Partial<MemberFormData>;
  title?: string;
  isFirstLogin?: boolean;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
  isFirstLogin = false
}) => {
  // [GSA-PRO-F-CM-01.A: State Hooks & Defaults]
  const { language } = useLanguage();
  const defaultState = initialData?.state || (language === 'hi' ? 'राजस्थान' : 'Rajasthan');

  const [name, setName] = useState(initialData?.name || '');
  const [guardianName, setGuardianName] = useState(initialData?.guardianName || '');
  const [gotra, setGotra] = useState(initialData?.gotra || '');
  const [motherGotra, setMotherGotra] = useState(initialData?.motherGotra || '');
  const [village, setVillage] = useState(initialData?.village || '');
  const [district, setDistrict] = useState(initialData?.district || '');
  const [stateName, setStateName] = useState(defaultState);
  const [city, setCity] = useState(initialData?.city || '');
  const [occupation, setOccupation] = useState(initialData?.occupation || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setGuardianName(initialData?.guardianName || '');
      setGotra(initialData?.gotra || '');
      setMotherGotra(initialData?.motherGotra || '');
      setVillage(initialData?.village || '');
      setDistrict(initialData?.district || '');
      setStateName(initialData?.state || (language === 'hi' ? 'राजस्थान' : 'Rajasthan'));
      setCity(initialData?.city || '');
      setOccupation(initialData?.occupation || '');
      setPhone(initialData?.phone || '');
      setEmail(initialData?.email || '');
    }
  }, [isOpen, initialData, language]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialData?.id || 'm_' + Date.now(),
      name, guardianName, gotra, motherGotra, village, district, state: stateName, city, occupation, phone, email,
      status: initialData?.status || 'verified',
      role: initialData?.role || (language === 'hi' ? 'सदस्य' : 'Member')
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="ios-glass-card w-full max-w-lg bg-white p-6 sm:p-7 shadow-2xl rounded-3xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header Row */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-blue-100 text-blue-700 font-extrabold">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                {title || (isFirstLogin
                  ? (language === 'hi' ? '🚩 स्वागत है! अपनी जानकारी दर्ज करें' : 'Welcome! Feed Member Profile')
                  : (language === 'hi' ? 'सदस्य जानकारी संपादित करें' : 'Edit Member Profile'))
                }
              </h3>
              <p className="text-[10.5px] text-slate-500 font-semibold">
                {language === 'hi' ? 'श्री घाँची समाज डिजिटल सदस्यता फ़ॉर्म' : 'Shree Ghanchi Samaj Membership Form'}
              </p>
            </div>
          </div>
          {!isFirstLogin && (
            <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-slate-700 pt-1">
          <LocationDatalists prefix="modal" language={language} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
            <div className="ios-field-group">
              <label className="ios-field-label">{language === 'hi' ? 'पूरा नाम' : 'Full Name'}</label>
              <input type="text" autoCapitalize="words" value={name} onChange={(e) => setName(capitalizeWords(e.target.value))} placeholder={language === 'hi' ? 'उदा: विक्रम घाँची...' : 'e.g. Vikram Ghanchi...'} className="ios-field-input" required />
            </div>

            <div className="ios-field-group">
              <label className="ios-field-label">{language === 'hi' ? 'पिता / संरक्षक का नाम' : 'Father / Guardian Name'}</label>
              <input type="text" autoCapitalize="words" value={guardianName} onChange={(e) => setGuardianName(capitalizeWords(e.target.value))} placeholder={language === 'hi' ? 'उदा: श्री मोहनलालजी...' : 'e.g. Shri Mohanlalji...'} className="ios-field-input" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
            <div className="ios-field-group">
              <label className="ios-field-label text-amber-800">{language === 'hi' ? 'निज गोत्र' : 'Paternal Gotra'}</label>
              <select value={gotra} onChange={(e) => setGotra(e.target.value)} className="ios-field-select">
                <option value="">{language === 'hi' ? '-- गोत्र चुनें --' : '-- Select Gotra --'}</option>
                {GOTRA_OPTIONS.map((g: any) => (
                  <option key={g.value} value={language === 'hi' ? g.hi : g.en}>{language === 'hi' ? g.hi : g.en}</option>
                ))}
              </select>
            </div>

            <div className="ios-field-group">
              <label className="ios-field-label text-amber-800">{language === 'hi' ? 'माता का गोत्र' : "Mother's Gotra"}</label>
              <select value={motherGotra} onChange={(e) => setMotherGotra(e.target.value)} className="ios-field-select">
                <option value="">{language === 'hi' ? '-- ननिहाल गोत्र चुनें --' : '-- Select Mother Gotra --'}</option>
                {GOTRA_OPTIONS.map((g: any) => (
                  <option key={g.value} value={language === 'hi' ? g.hi : g.en}>{language === 'hi' ? g.hi : g.en}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
            <div className="ios-field-group">
              <label className="ios-field-label">{language === 'hi' ? 'मूल गाँव' : 'Native Village'}</label>
              <input type="text" autoCapitalize="words" list="modal-village-options" value={village} onChange={(e) => setVillage(capitalizeWords(e.target.value))} placeholder={language === 'hi' ? 'उदा: बागरा, आकोली...' : 'e.g. Bagra, Aakoli...'} className="ios-field-input" />
            </div>

            <div className="ios-field-group">
              <label className="ios-field-label">{language === 'hi' ? 'ज़िला' : 'District'}</label>
              <input type="text" autoCapitalize="words" list="modal-district-options" value={district} onChange={(e) => setDistrict(capitalizeWords(e.target.value))} placeholder={language === 'hi' ? 'उदा: जालोर, जोधपुर...' : 'e.g. Jalore, Jodhpur...'} className="ios-field-input" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
            <div className="ios-field-group">
              <label className="ios-field-label">{language === 'hi' ? 'राज्य' : 'State'}</label>
              <input type="text" autoCapitalize="words" list="modal-state-options" value={stateName} onChange={(e) => setStateName(capitalizeWords(e.target.value))} placeholder={language === 'hi' ? 'उदा: राजस्थान, गुजरात...' : 'e.g. Rajasthan, Gujarat...'} className="ios-field-input" />
            </div>

            <div className="ios-field-group">
              <label className="ios-field-label">{language === 'hi' ? 'हाल (वर्तमान शहर)' : 'Current City (Hal)'}</label>
              <input type="text" autoCapitalize="words" list="modal-city-options" value={city} onChange={(e) => setCity(capitalizeWords(e.target.value))} placeholder={language === 'hi' ? 'उदा: जोधपुर, सूरत...' : 'e.g. Jodhpur, Surat...'} className="ios-field-input" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3 gap-y-4">
            <div className="ios-field-group">
              <label className="ios-field-label">{language === 'hi' ? 'व्यवसाय' : 'Occupation'}</label>
              <input type="text" autoCapitalize="words" value={occupation} onChange={(e) => setOccupation(capitalizeWords(e.target.value))} placeholder={language === 'hi' ? 'उदा: व्यापार' : 'e.g. Business'} className="ios-field-input" />
            </div>

            <div className="ios-field-group">
              <label className="ios-field-label">{language === 'hi' ? 'फ़ोन नंबर' : 'Phone'}</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98290XXXXX" className="ios-field-input" />
            </div>

            <div className="ios-field-group">
              <label className="ios-field-label">{language === 'hi' ? 'ईमेल (Email)' : 'Email'}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="member@gmail.com" className="ios-field-input" />
            </div>
          </div>

          <button type="submit" className="ios-btn-primary w-full py-3.5 rounded-xl text-xs font-extrabold shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mt-4">
            <Save className="w-4 h-4" />
            {language === 'hi' ? 'जानकारी दर्ज करके सहेजें' : 'Save Member Information'}
          </button>
        </form>

      </div>
    </div>,
    document.body
  );
};
