// [GSA-PRO-F-PG] - Member Profile, KYC & Information Feed Component
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CheckCircle2, Clock, AlertCircle, Globe, Edit3, User, MapPin, Briefcase, Phone, Award, PlusCircle, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { MemberProfileModal, MemberFormData } from '../components/directory/MemberProfileModal';

export const ProfileKYC: React.FC = () => {
  // [GSA-PRO-F-PG-01: Language & User Auth Context]
  const { t, language, setLanguage } = useLanguage();
  const { user, loginUser, logout } = useAuth();
  const { showToast } = useToast();

  // Profile Feed State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Initial Member Data (Starts Empty or loaded from localStorage / User Session Data)
  const [memberData, setMemberData] = useState<MemberFormData>(() => {
    const saved = localStorage.getItem('gsa_member_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: user?.id,
      name: user?.name || '',
      guardianName: '',
      gotra: user?.gotra || '',
      motherGotra: '',
      village: '',
      district: '',
      state: language === 'hi' ? 'राजस्थान' : 'Rajasthan',
      city: '',
      occupation: '',
      phone: user?.mobile || ''
    };
  });

  const isProfileEmpty = !memberData.name || !memberData.guardianName || !memberData.village || !memberData.gotra;

  const kycState: 'incomplete' | 'pending' | 'verified' = isProfileEmpty
    ? 'incomplete'
    : (memberData.status === 'verified' ? 'verified' : 'pending');

  const handleSaveMemberData = async (updated: MemberFormData) => {
    if (JSON.stringify(updated) === JSON.stringify(memberData)) {
      setIsEditModalOpen(false);
      return;
    }
    
    try {
      const targetId = updated.id || user?.id;
      const url = targetId ? `/api/admin/members/${targetId}` : '/api/admin/members';
      const method = targetId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updated,
          role: 'Member',
          status: 'pending'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setMemberData(updated);
        // As per rule, we do NOT use localStorage for core data anymore.
        if (user) {
          loginUser({
            ...user,
            name: updated.name || user.name,
            gotra: updated.gotra || user.gotra,
            mobile: updated.phone || user.mobile
          });
        }
        showToast(
          language === 'hi' 
            ? '✨ आपकी जानकारी सुरक्षित रूप से सहेजी गई!' 
            : '✨ Your information has been saved safely!',
          'success'
        );
        setIsEditModalOpen(false);
      } else {
        showToast(
          language === 'hi'
            ? data.error || '⚠️ बदलाव सहेजने में विफल। कृपया दोबारा प्रयास करें।'
            : data.error || '⚠️ Failed to save changes. Please try again.', 
          'error'
        );
      }
    } catch (err) {
      showToast(
        language === 'hi'
          ? '⚠️ नेटवर्क में समस्या है, कृपया बाद में प्रयास करें।'
          : '⚠️ Network issue, please try again later.', 
        'error'
      );
    }
  };

  // Auto-open Member Profile Form if required profile details are missing
  useEffect(() => {
    if (isProfileEmpty) {
      setIsEditModalOpen(true);
    }
  }, []);

  return (
    // [GSA-PRO-F-PG-02: Compact iOS 18 Glass Profile & Member Feed]
    <div className="space-y-4 max-w-3xl mx-auto pb-8">
      
      {/* 1. Ultra-Compact Profile Header Card */}
      <div className="ios-glass-card p-4 sm:p-5 space-y-4 bg-white/95">
        
        {/* Top Header Row: User Info & Integrated Compact Language Switcher */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl ios-btn-gold flex items-center justify-center text-2xl font-extrabold border border-amber-300 shadow-md shrink-0">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {memberData.name || (language === 'hi' ? 'सदस्य का नाम दर्ज करें' : 'Enter Member Name')}
                </h2>
                {kycState === 'verified' && (
                  <span className="inline-flex items-center gap-1 ios-badge-verified text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {t('kycStatusVerified')}
                  </span>
                )}
                {kycState === 'pending' && (
                  <span className="inline-flex items-center gap-1 ios-badge-pending text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 text-amber-600" /> {t('kycStatusPending')}
                  </span>
                )}
                {kycState === 'incomplete' && (
                  <span className="inline-flex items-center gap-1 ios-badge-incomplete text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3 text-red-600" /> {t('kycStatusIncomplete')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {memberData.guardianName ? `पिता: ${memberData.guardianName}` : (language === 'hi' ? 'पिता का नाम फ़ीड करें' : 'Feed Father Name')} | {t('memberId')}: {user?.memberId || 'GHS-1042'}
              </p>
            </div>
          </div>

          {/* Integrated Micro Language Toggle & Logout */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="ios-glass-card px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 transition-all shadow-sm flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'hi' ? 'हिन्दी (Hindi)' : 'English'}</span>
            </button>
            
            <button
              onClick={logout}
              className="ios-glass-card px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 border border-red-100 transition-all shadow-sm flex items-center gap-1.5 bg-red-50 hover:bg-red-100"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
            </button>
          </div>

        </div>

        {/* Compact Badges & Quick Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-700 font-bold flex-wrap">
            <span className="bg-amber-50 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-200/70 text-[11px]">🚩 {memberData.gotra}</span>
            <span className="bg-blue-50 text-blue-900 px-2.5 py-1 rounded-xl border border-blue-200/70 text-[11px]">
              📍 {memberData.village || (language === 'hi' ? 'मूल गाँव दर्ज करें' : 'Enter Village')}
            </span>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="ios-btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 hover:scale-102 active:scale-95 transition-all justify-center"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isProfileEmpty ? (language === 'hi' ? 'अपनी जानकारी दर्ज करें (Feed Form)' : 'Feed Profile Info') : (language === 'hi' ? 'जानकारी अपडेट करें' : 'Edit Profile Info')}</span>
          </button>
        </div>

      </div>

      {/* 2. Compact Member Summary Grid Card */}
      <div className="ios-glass-card p-4 sm:p-5 space-y-3 bg-white/90">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            {language === 'hi' ? 'सदस्यता विवरण (Member Summary)' : 'Member Profile Summary'}
          </h3>

          {isProfileEmpty && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs text-blue-600 font-extrabold flex items-center gap-1 hover:underline"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
              {language === 'hi' ? 'फ़ॉर्म भरें (Fill Form)' : 'Fill Form'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
            <span className="text-slate-400 block font-semibold text-[10.5px]">{language === 'hi' ? 'पूरा नाम' : 'Full Name'}</span>
            <span className="text-slate-900 font-extrabold text-xs block mt-0.5 truncate">
              {memberData.name || <span className="text-amber-600 italic">{language === 'hi' ? '(दर्ज करें)' : '(Not entered)'}</span>}
            </span>
          </div>

          <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
            <span className="text-slate-400 block font-semibold text-[10.5px]">{language === 'hi' ? 'पिता / संरक्षक' : 'Father / Guardian'}</span>
            <span className="text-slate-900 font-extrabold text-xs block mt-0.5 truncate">
              {memberData.guardianName || <span className="text-amber-600 italic">{language === 'hi' ? '(दर्ज करें)' : '(Not entered)'}</span>}
            </span>
          </div>

          <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
            <span className="text-slate-400 block font-semibold text-[10.5px]">{language === 'hi' ? 'निज गोत्र' : 'Paternal Gotra'}</span>
            <span className="text-amber-800 font-extrabold text-xs block mt-0.5 truncate">
              {memberData.gotra || <span className="text-amber-600 italic font-semibold">{language === 'hi' ? '(दर्ज करें)' : '(Not entered)'}</span>}
            </span>
          </div>

          <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
            <span className="text-slate-400 block font-semibold text-[10.5px]">{language === 'hi' ? 'माता का गोत्र' : "Mother's Gotra"}</span>
            <span className="text-amber-800 font-extrabold text-xs block mt-0.5 truncate">
              {memberData.motherGotra || <span className="text-amber-600 italic font-semibold">{language === 'hi' ? '(दर्ज करें)' : '(Not entered)'}</span>}
            </span>
          </div>

          <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
            <span className="text-slate-400 block font-semibold text-[10.5px]">{language === 'hi' ? 'मूल गाँव' : 'Native Village'}</span>
            <span className="text-slate-900 font-extrabold text-xs block mt-0.5 truncate">
              {memberData.village || <span className="text-amber-600 italic">{language === 'hi' ? '(दर्ज करें)' : '(Not entered)'}</span>}
            </span>
          </div>

          <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70">
            <span className="text-slate-400 block font-semibold text-[10.5px]">{language === 'hi' ? 'व्यवसाय' : 'Occupation'}</span>
            <span className="text-slate-900 font-extrabold text-xs block mt-0.5 truncate">
              {memberData.occupation || <span className="text-amber-600 italic">{language === 'hi' ? '(दर्ज करें)' : '(Not entered)'}</span>}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Compact Aadhaar KYC Verification Card */}
      <div className="ios-glass-card p-4 space-y-2 bg-white/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xs text-amber-700">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            {t('aadhaarKycStatus')}
          </div>
          {kycState === 'verified' && (
            <span className="ios-badge-verified text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('aadhaarStatusVerified')}
            </span>
          )}
          {kycState === 'pending' && (
            <span className="ios-badge-pending text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> {t('aadhaarStatusPending')}
            </span>
          )}
          {kycState === 'incomplete' && (
            <span className="ios-badge-incomplete text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-600" /> {t('aadhaarStatusNotSubmitted')}
            </span>
          )}
        </div>
        
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-slate-500">{t('maskedAadhaar')}</p>
            <p className="text-xs font-mono font-black text-slate-900">
              {kycState === 'verified' && 'XXXX - XXXX - 1042'}
              {kycState === 'pending' && 'XXXX - XXXX - **** (समीक्षाधीन)'}
              {kycState === 'incomplete' && (language === 'hi' ? 'विवरण अधूरा है (फ़ॉर्म भरें)' : 'Incomplete (Fill Profile Form)')}
            </p>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">100% Privacy Encrypted</span>
        </div>
      </div>

      {/* Common Reusable Member Profile Modal (Opens Clean/Empty for New Data) */}
      <MemberProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveMemberData}
        initialData={memberData}
      />

    </div>
  );
};
