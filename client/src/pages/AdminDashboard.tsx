// [GSA-ADM-F-PG-01: Admin Web Portal & Control Center Page Component]
import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminKycTab } from '../components/admin/AdminKycTab';
import { AdminMembersTab } from '../components/admin/AdminMembersTab';
import { AdminAnnouncementsTab } from '../components/admin/AdminAnnouncementsTab';
import { AdminEditMemberModal } from '../components/admin/AdminEditMemberModal';

export interface AdminMember {
  id: string;
  name: string;
  guardianName?: string;
  gotra: string;
  village?: string;
  district?: string;
  state?: string;
  city: string;
  phone: string;
  email?: string;
  status: 'verified' | 'pending';
  role: string;
}

export const AdminDashboard: React.FC = () => {
  // [GSA-ADM-F-PG-01.A: Portal State & Datasets]
  const { language } = useLanguage();
  const { showToast } = useToast();
  const getInitialAdminTab = (): 'overview' | 'kyc' | 'members' | 'announcements' => {
    try {
      const fullHash = window.location.hash.replace('#', '');
      if (fullHash.startsWith('admin/')) {
        const sub = fullHash.split('/')[1];
        if (['overview', 'kyc', 'members', 'announcements'].includes(sub)) {
          return sub as any;
        }
      }
      const saved = localStorage.getItem('gsa_admin_subtab');
      if (saved && ['overview', 'kyc', 'members', 'announcements'].includes(saved)) {
        return saved as any;
      }
    } catch (e) {}
    return 'overview';
  };

  const [adminTab, setAdminTabState] = useState<'overview' | 'kyc' | 'members' | 'announcements'>(getInitialAdminTab);

  const setAdminTab = (tab: 'overview' | 'kyc' | 'members' | 'announcements') => {
    setAdminTabState(tab);
    try {
      localStorage.setItem('gsa_admin_subtab', tab);
      window.location.hash = `admin/${tab}`;
    } catch (e) {}
  };

  useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash.replace('#', '');
      if (fullHash.startsWith('admin/')) {
        const sub = fullHash.split('/')[1];
        if (['overview', 'kyc', 'members', 'announcements'].includes(sub)) {
          setAdminTabState(sub as any);
          localStorage.setItem('gsa_admin_subtab', sub);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const [kycQueue, setKycQueue] = useState<any[]>([]);
  const [membersList, setMembersList] = useState<AdminMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<AdminMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [announcements, setAnnouncements] = useState([
    { id: '1', title: 'Shree Ghanchi Samaj Annual Meeting', category: 'Annual Meeting', date: '15 Oct 2026', location: 'Ghanchi Samaj Bhavan, Jodhpur', status: 'Active' },
    { id: '2', title: 'Free Matrimonial Matchmaking Conference', category: 'Matchmaking Meet', date: '02 Nov 2026', location: 'Town Hall, Pali', status: 'Active' }
  ]);

  useEffect(() => {
    fetch('/api/admin/members')
      .then(res => res.json())
      .then(data => {
        if (data.success) setMembersList(data.data);
        return fetch('/api/admin/kyc-queue');
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) setKycQueue(data.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load admin data", err);
        setIsLoading(false);
      });
  }, []);

  const handleApproveKYC = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/kyc-queue/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' })
      });
      if (res.ok) {
        setKycQueue(prev => prev.filter(item => item.id !== id));
        showToast(language === 'hi' ? 'KYC स्वीकृत!' : 'KYC Approved!', 'success');
      }
    } catch (e) {
      showToast('Error approving KYC', 'error');
    }
  };

  const handleRejectKYC = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/kyc-queue/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (res.ok) {
        setKycQueue(prev => prev.filter(item => item.id !== id));
        showToast(language === 'hi' ? 'KYC अस्वीकृत!' : 'KYC Rejected!', 'info');
      }
    } catch (e) {
      showToast('Error rejecting KYC', 'error');
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setIsSaving(true);
    try {
      const isNew = editingMember.id === 'new';
      const url = isNew ? `/api/admin/members` : `/api/admin/members/${editingMember.id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMember)
      });
      const data = await response.json();
      
      if (data.success) {
        if (isNew) {
          setMembersList(prev => [...prev, data.data]);
        } else {
          setMembersList(prev => prev.map(m => m.id === editingMember.id ? data.data : m));
        }
        setEditingMember(null);
        showToast(language === 'hi' ? 'सदस्य का विवरण सहेजा गया!' : 'Member details saved!', 'success');
      } else {
        showToast(data.error || 'Failed to save', 'error');
      }
    } catch (err) {
      showToast('Server error while saving.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await fetch(`/api/admin/members/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
    setMembersList(prev => prev.filter(m => m.id !== id));
    if (editingMember?.id === id) setEditingMember(null);
    showToast(language === 'hi' ? '🗑️ सदस्य हटा दिया गया।' : '🗑️ Member deleted.', 'success');
  };

  const handleCreateAnnouncement = (title: string, category: string, location: string) => {
    const notice = {
      id: Date.now().toString(),
      title,
      category,
      date: language === 'hi' ? 'अभी जारी' : 'Just Now',
      location: location || 'Jodhpur',
      status: 'Active'
    };
    setAnnouncements(prev => [notice, ...prev]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] max-w-6xl mx-auto ios-glass-card overflow-hidden pb-4">
      
      {/* Header Banner */}
      <div className="shrink-0 p-3 sm:p-4 border-b border-slate-200/60 flex justify-between items-center flex-wrap gap-2 bg-white/50">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            {language === 'hi' ? 'एडमिन पोर्टल' : 'Admin Dashboard'}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {language === 'hi' ? 'व्यवस्थापक कंट्रोल सेंटर' : 'Admin Control Portal'}
          </h2>
        </div>

        {/* Navigation Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 flex-wrap">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              adminTab === 'overview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'डैशबोर्ड' : 'Overview'}
          </button>
          <button
            onClick={() => setAdminTab('kyc')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              adminTab === 'kyc' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>KYC</span>
            {kycQueue.length > 0 && (
              <span className="w-4 h-4 bg-amber-500 text-slate-950 rounded-full text-[10px] font-extrabold flex items-center justify-center">
                {kycQueue.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setAdminTab('members')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              adminTab === 'members' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'सदस्य प्रबंधन' : 'Members'}
          </button>
          <button
            onClick={() => setAdminTab('announcements')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              adminTab === 'announcements' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'घोषणाएं' : 'Notices'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/30">
        {adminTab === 'overview' && <AdminOverviewTab membersList={membersList} />}
        {adminTab === 'kyc' && <AdminKycTab kycQueue={kycQueue} onApprove={handleApproveKYC} onReject={handleRejectKYC} />}
        {adminTab === 'members' && (
          <AdminMembersTab
            membersList={membersList}
            isLoading={isLoading}
            onEdit={(m) => setEditingMember(m)}
            onDelete={handleDeleteMember}
            onAddNew={() => setEditingMember({ id: 'new', name: '', gotra: 'Borana', city: 'Jodhpur', phone: '', status: 'pending', role: 'Member', village: '' })}
          />
        )}
        {adminTab === 'announcements' && (
          <AdminAnnouncementsTab
            announcements={announcements}
            onCreate={handleCreateAnnouncement}
          />
        )}
      </div>

      <AdminEditMemberModal
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onSave={handleSaveMember}
        onChange={(updated) => setEditingMember(updated)}
        isSaving={isSaving}
      />
    </div>
  );
};
