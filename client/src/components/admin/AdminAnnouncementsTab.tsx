// [GSA-ADM-F-CM-05: Admin Announcements & Notice Management Component]
import React, { useState } from 'react';
import { Bell, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AnnouncementItem {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  status: string;
}

interface AdminAnnouncementsTabProps {
  announcements: AnnouncementItem[];
  onCreate: (title: string, category: string, location: string) => void;
}

export const AdminAnnouncementsTab: React.FC<AdminAnnouncementsTabProps> = ({
  announcements,
  onCreate
}) => {
  const { language } = useLanguage();
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('Annual Meeting');
  const [newNoticeLocation, setNewNoticeLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) return;
    onCreate(newNoticeTitle, newNoticeCategory, newNoticeLocation);
    setNewNoticeTitle('');
    setNewNoticeLocation('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
      {/* Create Notice Form */}
      <div className="ios-glass-card p-4 sm:p-5 space-y-3 bg-white/90">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          {language === 'hi' ? 'नई समाज सूचना / कार्यक्रम जारी करें' : 'Publish New Notice / Event'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newNoticeTitle}
              onChange={(e) => setNewNoticeTitle(e.target.value)}
              placeholder={language === 'hi' ? 'सूचना का शीर्षक...' : 'Notice Title...'}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              required
            />
            <select
              value={newNoticeCategory}
              onChange={(e) => setNewNoticeCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            >
              <option value="Annual Meeting">{language === 'hi' ? 'वार्षिक सभा' : 'Annual Meeting'}</option>
              <option value="Matchmaking Meet">{language === 'hi' ? 'सम्मेलन' : 'Matchmaking Meet'}</option>
              <option value="General Notice">{language === 'hi' ? 'सामान्य सूचना' : 'General Notice'}</option>
            </select>
            <input
              type="text"
              value={newNoticeLocation}
              onChange={(e) => setNewNoticeLocation(e.target.value)}
              placeholder={language === 'hi' ? 'स्थान (उदा: जोधपुर)...' : 'Location (e.g. Jodhpur)...'}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <button
            type="submit"
            className="ios-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:scale-[1.01] transition-all"
          >
            📢 {language === 'hi' ? 'सूचना प्रकाशित करें' : 'Publish Announcement'}
          </button>
        </form>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.map((n) => (
          <div key={n.id} className="ios-glass-card p-4 flex items-center justify-between flex-wrap gap-3 bg-white/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="ios-badge-gotra text-[10px] font-extrabold px-2 py-0.5 rounded-full">{n.category}</span>
                <span className="text-[10px] text-slate-400 font-medium">🕒 {n.date}</span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">{n.title}</h4>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {n.location}
              </p>
            </div>
            <span className="ios-badge-verified text-xs font-bold px-3 py-1 rounded-full">
              {n.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
