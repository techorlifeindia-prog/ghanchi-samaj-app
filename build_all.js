const fs = require('fs');
const path = require('path');

const files = {
  'client/src/App.tsx': import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AIAssistantModal } from './components/AIAssistantModal';
import { Home } from './pages/Home';
import { FamilyTree } from './pages/FamilyTree';
import { Directory } from './pages/Directory';
import { Matrimony } from './pages/Matrimony';
import { Business } from './pages/Business';
import { ProfileKYC } from './pages/ProfileKYC';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleUpdateStatus = (memberName: string, newStatus: string) => {
    setNotification(\?????! \ ?? ?????? \ ????? ?? ?? ?? ???\);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className=" min-h-screen bg-slate-50 flex flex-col pb-16 md:pb-0\>
 <Navbar activeTab={activeTab} setActiveTab={setActiveTab} openAIBot={() => setIsAIOpen(true)} />
 
 {notification && (
 <div className=\bg-emerald-600 text-white text-center py-2.5 px-4 font-semibold text-sm shadow-md animate-bounce\>
 {notification}
 </div>
 )}

 <main className=\flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6\>
 {activeTab === 'home' && <Home setActiveTab={setActiveTab} openAIBot={() => setIsAIOpen(true)} />}
 {activeTab === 'family' && <FamilyTree />}
 {activeTab === 'directory' && <Directory />}
 {activeTab === 'matrimony' && <Matrimony />}
 {activeTab === 'business' && <Business />}
 {activeTab === 'profile' && <ProfileKYC />}
 </main>

 <AIAssistantModal 
 isOpen={isAIOpen} 
 onClose={() => setIsAIOpen(false)} 
 onUpdateStatus={handleUpdateStatus} 
 />
 </div>
 );
}

export default App;,

 'client/src/pages/Home.tsx': import React from 'react';
import { Users, Heart, Briefcase, Bot, Sparkles } from 'lucide-react';

interface HomeProps {
 setActiveTab: (tab: string) => void;
 openAIBot: () => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, openAIBot }) => {
 return (
 <div className=\space-y-6\>
 <div className=\relative overflow-hidden rounded-2xl bg-samaj-gradient text-white p-6 sm:p-8 shadow-xl border border-amber-400/30\>
 <div className=\relative z-10 max-w-2xl space-y-3\>
 <div className=\inline-flex items-center gap-2 gold-badge px-3 py-1 rounded-full text-xs font-bold shadow-sm\>
 <Sparkles className=\w-3.5 h-3.5 text-amber-900\ />
 ???? ????? ???? — ?????? ?? ????? ??
 </div>
 <h1 className=\text-2xl sm:text-3xl font-extrabold text-amber-100 leading-tight\>
 ???? ?????? ??????? (Family Tree) ?? ???? ?? ?? ??? ??????
 </h1>
 <p className=\text-sm text-blue-100 leading-relaxed\>
 ???? ?????? AI ????? ?? 10 ????? ??? ???? ????????? ?????? (????, ????) ????? ????, ???????? ????? ?????? ????? ?? ???? ??????? ?? ???????
 </p>
 <div className=\flex flex-wrap gap-3 pt-2\>
 <button 
 onClick={() => setActiveTab('family')}
 className=\bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-amber-400/20 text-sm flex items-center gap-2 transition-all active:scale-95\
 >
 <Users className=\w-4 h-4\ />
 ?????? ???? ?????
 </button>
 <button 
 onClick={openAIBot}
 className=\bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl border border-white/20 text-sm flex items-center gap-2 transition-all\
 >
 <Bot className=\w-4 h-4 text-amber-300\ />
 AI ????? ?? ?????
 </button>
 </div>
 </div>
 </div>

 <div className=\grid grid-cols-2 sm:grid-cols-4 gap-4\>
 <div onClick={() => setActiveTab('family')} className=\bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-amber-400 cursor-pointer text-center group transition-all\>
 <div className=\w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform\><Users className=\w-6 h-6\ /></div>
 <h3 className=\font-bold text-sm text-slate-800\>?????? ???? (???????)</h3>
 <p className=\text-[11px] text-slate-500 mt-0.5\>????-???? ?? ?????? ??</p>
 </div>
 <div onClick={() => setActiveTab('matrimony')} className=\bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-pink-400 cursor-pointer text-center group transition-all\>
 <div className=\w-12 h-12 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform\><Heart className=\w-6 h-6\ /></div>
 <h3 className=\font-bold text-sm text-slate-800\>????? ????? ???</h3>
 <p className=\text-[11px] text-slate-500 mt-0.5\>???????? ??????</p>
 </div>
 <div onClick={() => setActiveTab('directory')} className=\bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 cursor-pointer text-center group transition-all\>
 <div className=\w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform\><Users className=\w-6 h-6\ /></div>
 <h3 className=\font-bold text-sm text-slate-800\>???? ??????????</h3>
 <p className=\text-[11px] text-slate-500 mt-0.5\>????? ? ???? ??????</p>
 </div>
 <div onClick={() => setActiveTab('business')} className=\bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-400 cursor-pointer text-center group transition-all\>
 <div className=\w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform\><Briefcase className=\w-6 h-6\ /></div>
 <h3 className=\font-bold text-sm text-slate-800\>??????? ??????????</h3>
 <p className=\text-[11px] text-slate-500 mt-0.5\>???? ???????</p>
 </div>
 </div>
 </div>
 );
};,

 'client/src/pages/FamilyTree.tsx': import React from 'react';
import { Users, Plus, Heart } from 'lucide-react';

export const FamilyTree: React.FC = () => {
 return (
 <div className=\space-y-6\>
 <div className=\bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between flex-wrap gap-3\>
 <div>
 <h2 className=\text-xl font-bold text-slate-900 flex items-center gap-2\>
 <Users className=\w-6 h-6 text-amber-600\ />
 ?????? ?????? ??????? (Family Tree)
 </h2>
 <p className=\text-xs text-slate-500 mt-0.5\>??? ??????: ?????? (????????) | ??? ?????: 8</p>
 </div>
 <button className=\bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all\>
 <Plus className=\w-4 h-4\ /> ????? ??????
 </button>
 </div>

 <div className=\bg-slate-100/70 p-6 rounded-2xl border border-slate-200 overflow-x-auto\>
 <div className=\min-w-[650px] flex flex-col items-center space-y-6\>
 <div className=\flex justify-center gap-6\>
 <div className=\bg-white p-3.5 rounded-xl border-2 border-amber-400 shadow-md text-center w-52\>
 <span className=\text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full\>???? (Grandfather)</span>
 <h4 className=\font-bold text-sm text-slate-900 mt-1\>???. ?????? ?? ?????</h4>
 <p className=\text-[11px] text-slate-500\>?????: ??????</p>
 </div>
 <div className=\bg-white p-3.5 rounded-xl border-2 border-amber-400 shadow-md text-center w-52\>
 <span className=\text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full\>???? (Grandmother)</span>
 <h4 className=\font-bold text-sm text-slate-900 mt-1\>??????? ???? ????</h4>
 <p className=\text-[11px] text-slate-500\>??????: ?????? (????)</p>
 </div>
 </div>

 <div className=\w-0.5 h-6 bg-amber-400\></div>

 <div className=\flex justify-center gap-6\>
 <div className=\bg-white p-3.5 rounded-xl border-2 border-blue-500 shadow-md text-center w-56\>
 <span className=\text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full\>???? / ??????</span>
 <h4 className=\font-bold text-sm text-slate-900 mt-1\>???? ????? ?????</h4>
 <p className=\text-[11px] text-slate-500\>????: 52 ???? | ????? ????????</p>
 </div>
 <div className=\bg-white p-3.5 rounded-xl border-2 border-blue-500 shadow-md text-center w-56\>
 <span className=\text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full\>???? (Mother)</span>
 <h4 className=\font-bold text-sm text-slate-900 mt-1\>??????? ?????? ????</h4>
 <p className=\text-[11px] text-slate-500\>??????: ????? (??????)</p>
 </div>
 </div>

 <div className=\w-0.5 h-6 bg-blue-400\></div>

 <div className=\grid grid-cols-3 gap-4 w-full\>
 <div className=\bg-white p-3.5 rounded-xl border border-emerald-400 shadow-sm text-center\>
 <span className=\text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full\>???? ????</span>
 <h4 className=\font-bold text-sm text-slate-900 mt-1\>????? ?????</h4>
 <span className=\inline-block mt-1 bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded\>???????</span>
 </div>

 <div className=\bg-white p-3.5 rounded-xl border border-pink-400 shadow-sm text-center ring-2 ring-pink-300\>
 <span className=\text-[10px] font-bold bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full flex items-center justify-center gap-1\>
 <Heart className=\w-3 h-3 text-pink-600\ /> ???? (Daughter)
 </span>
 <h4 className=\font-bold text-sm text-slate-900 mt-1\>?????? ?????</h4>
 <span className=\inline-block mt-1 bg-pink-100 text-pink-800 text-[10px] font-semibold px-2 py-0.5 rounded\>???? ?? ????</span>
 </div>

 <div className=\bg-white p-3.5 rounded-xl border border-amber-300 shadow-sm text-center\>
 <span className=\text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full\>???? ????</span>
 <h4 className=\font-bold text-sm text-slate-900 mt-1\>????? ?????</h4>
 <span className=\inline-block mt-1 bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded\>????????</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};,

 'client/src/pages/Directory.tsx': import React, { useState } from 'react';
import { Search, Phone, MapPin, Briefcase, Users } from 'lucide-react';
import { GHANCHI_GOTRAS } from '../../shared/types';

export const Directory: React.FC = () => {
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedGotra, setSelectedGotra] = useState('');

 const members = [
 { id: '1', name: '???? ????? ??????', gotra: '?????? (Borana)', city: '??????', profession: '????? ????????', phone: '98290-XXXXX' },
 { id: '2', name: '????? ??????', gotra: '?????? (Solanki)', city: '????', profession: '?????? ?????', phone: '94141-XXXXX' },
 { id: '3', name: '????? ?????', gotra: '????? (Panwar)', city: '????????', profession: '????????? ????????', phone: '97250-XXXXX' },
 { id: '4', name: '???? ??????', gotra: '?????? (Rathore)', city: '?????', profession: '??????? ????????', phone: '99280-XXXXX' },
 ];

 return (
 <div className=\space-y-5\>
 <div className=\bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3\>
 <h2 className=\text-xl font-bold text-slate-900 flex items-center gap-2\>
 <Users className=\w-6 h-6 text-blue-600\ />
 ???? ?????????? (Member Search)
 </h2>
 
 <div className=\grid grid-cols-1 sm:grid-cols-3 gap-3\>
 <div className=\sm:col-span-2 relative\>
 <Search className=\w-5 h-5 absolute left-3 top-3 text-slate-400\ />
 <input 
 type=\text\
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 placeholder=\??? ??? ?? ??????? ?? ?????...\
 className=\w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500\
 />
 </div>
 <select 
 value={selectedGotra}
 onChange={(e) => setSelectedGotra(e.target.value)}
 className=\bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500\
 >
 <option value=\\>??? ????? (All Gotras)</option>
 {GHANCHI_GOTRAS.map((g) => (
 <option key={g} value={g}>{g}</option>
 ))}
 </select>
 </div>
 </div>

 <div className=\grid grid-cols-1 md:grid-cols-2 gap-4\>
 {members.map((m) => (
 <div key={m.id} className=\bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex justify-between items-start\>
 <div className=\space-y-1\>
 <span className=\inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded\>{m.gotra}</span>
 <h3 className=\font-bold text-base text-slate-900\>{m.name}</h3>
 <p className=\text-xs text-slate-600 flex items-center gap-1\><MapPin className=\w-3.5 h-3.5 text-slate-400\ /> {m.city}</p>
 <p className=\text-xs text-slate-600 flex items-center gap-1\><Briefcase className=\w-3.5 h-3.5 text-slate-400\ /> {m.profession}</p>
 </div>
 <button className=\bg-blue-50 text-blue-700 hover:bg-blue-100 p-2.5 rounded-full transition-colors\ title=\?????? ????\>
 <Phone className=\w-4 h-4\ />
 </button>
 </div>
 ))}
 </div>
 </div>
 );
};,

 'client/src/pages/Matrimony.tsx': import React from 'react';
import { Heart, ShieldCheck, MapPin, GraduationCap, Briefcase, Download } from 'lucide-react';

export const Matrimony: React.FC = () => {
 const profiles = [
 {
 id: '1',
 name: '????? ????? (??????)',
 age: 24,
 height: '5 ft 9 in',
 education: 'B.Tech (Software)',
 profession: 'IT Engineer (????????)',
 city: '??????',
 gotra: '??????',
 nanihal: '?????? (????)',
 status: '???????? (Available)'
 },
 {
 id: '2',
 name: '???? ????? (??????)',
 age: 22,
 height: '5 ft 4 in',
 education: 'M.Com, B.Ed',
 profession: '???????? (Teacher)',
 city: '????',
 gotra: '??????',
 nanihal: '????? (??????)',
 status: '???????? (Available)'
 }
 ];

 return (
 <div className=\space-y-5\>
 <div className=\bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center flex-wrap gap-3\>
 <div>
 <h2 className=\text-xl font-bold text-slate-900 flex items-center gap-2\>
 <Heart className=\w-6 h-6 text-pink-600\ />
 ???? ????? ???? ????? ????? ???
 </h2>
 <p className=\text-xs text-slate-500 mt-0.5\>???? ???? ??? ????? ?????? ???????? ????????</p>
 </div>
 <button className=\bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all\>
 <Heart className=\w-4 h-4\ /> ???????? ??????
 </button>
 </div>

 <div className=\grid grid-cols-1 md:grid-cols-2 gap-5\>
 {profiles.map((p) => (
 <div key={p.id} className=\bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 relative overflow-hidden hover:border-pink-300 transition-all\>
 <div className=\flex justify-between items-start\>
 <div>
 <span className=\inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1\>
 <ShieldCheck className=\w-3 h-3 text-emerald-600\ /> ???? Verified
 </span>
 <h3 className=\font-bold text-lg text-slate-900\>{p.name}</h3>
 <p className=\text-xs text-slate-500\>????: {p.age} ???? | ??: {p.height}</p>
 </div>
 <span className=\bg-pink-50 text-pink-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-pink-200\>
 {p.status}
 </span>
 </div>

 <div className=\bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-700\>
 <p className=\flex items-center gap-2\><GraduationCap className=\w-4 h-4 text-slate-400\ /> <strong>??????:</strong> {p.education}</p>
 <p className=\flex items-center gap-2\><Briefcase className=\w-4 h-4 text-slate-400\ /> <strong>???????:</strong> {p.profession}</p>
 <p className=\flex items-center gap-2\><MapPin className=\w-4 h-4 text-slate-400\ /> <strong>???:</strong> {p.city} | <strong>??????:</strong> {p.nanihal}</p>
 </div>

 <div className=\pt-2 flex gap-2\>
 <button className=\flex-1 bg-samaj-gradient text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:brightness-110 transition-all\>
 <Heart className=\w-3.5 h-3.5 text-pink-400\ /> ?????? ?????? ?????
 </button>
 <button className=\bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl text-xs flex items-center gap-1 transition-colors\ title=\???????? ??????? ????\>
 <Download className=\w-4 h-4\ />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 );
};,

 'client/src/pages/Business.tsx': import React from 'react';
import { Briefcase, MapPin, Phone, Plus, Store } from 'lucide-react';

export const Business: React.FC = () => {
 const businesses = [
 {
 id: '1',
 title: '???? ????? ??????????? & ???? ????',
 owner: '???? ????? ??????',
 category: '????? / ?????????',
 city: '?????? (????????)',
 address: '????? ??????, ??? ???, ??????',
 phone: '98290-XXXXX'
 },
 {
 id: '2',
 title: '????? ?????? & ???????',
 owner: '????? ??????',
 category: '??????? / ??????',
 city: '????',
 address: '?????? ???, ????',
 phone: '94141-XXXXX'
 }
 ];

 return (
 <div className=\space-y-5\>
 <div className=\bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center flex-wrap gap-3\>
 <div>
 <h2 className=\text-xl font-bold text-slate-900 flex items-center gap-2\>
 <Briefcase className=\w-6 h-6 text-emerald-600\ />
 ???? ??????? ? ?????? ??????????
 </h2>
 <p className=\text-xs text-slate-500 mt-0.5\>???? ???? ?? ?????? ?? ??????? ?? ?????? ???</p>
 </div>
 <button className=\bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all\>
 <Plus className=\w-4 h-4\ /> ??????? ??????
 </button>
 </div>

 <div className=\grid grid-cols-1 md:grid-cols-2 gap-4\>
 {businesses.map((b) => (
 <div key={b.id} className=\bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-emerald-300 transition-all\>
 <div className=\flex justify-between items-start\>
 <div className=\flex items-start gap-3\>
 <div className=\w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold\>
 <Store className=\w-5 h-5\ />
 </div>
 <div>
 <span className=\inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200\>{b.category}</span>
 <h3 className=\font-bold text-base text-slate-900 mt-0.5\>{b.title}</h3>
 <p className=\text-xs text-slate-500\>?????: {b.owner}</p>
 </div>
 </div>
 </div>

 <div className=\text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100\>
 <p className=\flex items-center gap-1.5\><MapPin className=\w-3.5 h-3.5 text-slate-400\ /> {b.address}, {b.city}</p>
 </div>

 <button className=\w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors\>
 <Phone className=\w-3.5 h-3.5\ /> ??? / WhatsApp ?????? ????
 </button>
 </div>
 ))}
 </div>
 </div>
 );
};,

 'client/src/pages/ProfileKYC.tsx': import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const ProfileKYC: React.FC = () => {
 return (
 <div className=\space-y-5 max-w-3xl mx-auto\>
 <div className=\bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4\>
 <div className=\w-16 h-16 rounded-full gold-badge flex items-center justify-center text-2xl font-bold border-2 border-amber-300 shadow-md\>
 ??
 </div>
 <div>
 <div className=\flex items-center gap-2 flex-wrap\>
 <h2 className=\text-xl font-bold text-slate-900\>???? ????? ??????</h2>
 <span className=\inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300\>
 <CheckCircle2 className=\w-3.5 h-3.5 text-emerald-600\ /> ???? KYC Verified
 </span>
 </div>
 <p className=\text-xs text-slate-500 mt-0.5\>?????? ?????? | ?????? ???: GHS-JODH-1042</p>
 </div>
 </div>

 <div className=\bg-amber-50/80 p-5 rounded-2xl border border-amber-300 space-y-3\>
 <div className=\flex items-center gap-2 font-bold text-sm text-amber-950\>
 <ShieldCheck className=\w-5 h-5 text-amber-600\ />
 ???? ??????? (Aadhaar KYC Status)
 </div>
 <div className=\bg-white p-3.5 rounded-xl border border-amber-200 flex items-center justify-between\>
 <div>
 <p className=\text-xs font-semibold text-slate-700\>????? ???? ???? (Masked Aadhaar)</p>
 <p className=\text-sm font-mono font-bold text-slate-900 mt-0.5\>XXXX - XXXX - 1042</p>
 </div>
 <span className=\bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1\>
 <CheckCircle2 className=\w-4 h-4 text-emerald-600\ /> ????????
 </span>
 </div>
 <p className=\text-[11px] text-amber-900 leading-relaxed\>
 ?? ??????? ??????: ???? 12 ????? ?? ???? ???? ???? ?? ??? ??? ?? ????????? ?? ?????-??????? ??? ????? ???? ???? ????? ???? ??????? ???? ????? ??? ????? ??? ???? ???? ???
 </p>
 </div>

 <div className=\bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4\>
 <h3 className=\font-bold text-base text-slate-900 flex items-center gap-2\>
 <Lock className=\w-5 h-5 text-blue-600\ />
 ????????? ???????? (Privacy Permissions)
 </h3>

 <div className=\space-y-3 text-xs text-slate-700\>
 <div className=\flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200\>
 <div>
 <p className=\font-semibold text-slate-900\>?????? ???? ??????? (Phone Visibility)</p>
 <p className=\text-[11px] text-slate-500\>??? ???? ???? ??? ???? ???</p>
 </div>
 <select className=\bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none\>
 <option value=\verified\>???????? ????? (Verified)</option>
 <option value=\family\>???? ?????? (Family Only)</option>
 <option value=\none\>??? ???? (Hidden)</option>
 </select>
 </div>

 <div className=\flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200\>
 <div>
 <p className=\font-semibold text-slate-900\>????? ??? ??? ????? ???? (Matrimony Search)</p>
 <p className=\text-[11px] text-slate-500\>????-????? ????? ???? ??? ???????</p>
 </div>
 <input type=\checkbox\ defaultChecked className=\w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500\ />
 </div>
 </div>
 </div>
 </div>
 );
};\
};

Object.entries(files).forEach(([file, content]) => {
 const fullPath = path.join('C:/Project/GhanchiSamajApp', file);
 fs.mkdirSync(path.dirname(fullPath), { recursive: true });
 fs.writeFileSync(fullPath, content, 'utf8');
});

console.log('All files successfully written!');

