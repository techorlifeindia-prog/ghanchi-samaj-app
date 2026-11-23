// [GSA-APP-F-PG] - Root Application Shell & Tab Router Component
import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { AIAssistantModal } from './components/layout/AIAssistantModal';
import { LoginModal } from './components/auth/LoginModal';
import { LoginPage } from './pages/LoginPage';
import { Home } from './pages/Home';
import { FamilyTree } from './pages/FamilyTree';
import { Directory } from './pages/Directory';
import { Matrimony } from './pages/Matrimony';
import { Business } from './pages/Business';
import { ProfileKYC } from './pages/ProfileKYC';
import { AdminDashboard } from './pages/AdminDashboard';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';

export function MainAppContent() {
  // [GSA-APP-F-PG-01: Navigation Tab Router & Auth State]
  const { isLoggedIn, role } = useAuth();

  // Helper to determine initial main active tab from hash or localStorage
  const getInitialTab = () => {
    try {
      const fullHash = window.location.hash.replace('#', '');
      const mainHash = fullHash.split('/')[0];
      if (['home', 'family', 'directory', 'matrimony', 'business', 'profile', 'admin'].includes(mainHash)) {
        return mainHash;
      }
      const saved = localStorage.getItem('gsa_active_tab');
      if (saved && ['home', 'family', 'directory', 'matrimony', 'business', 'profile', 'admin'].includes(saved)) {
        return saved;
      }
    } catch (e) {}
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('gsa_active_tab', tab);
      if (tab === 'admin') {
        const sub = localStorage.getItem('gsa_admin_subtab') || 'overview';
        window.location.hash = `admin/${sub}`;
      } else {
        window.location.hash = tab;
      }
    } catch (e) {
      console.error('Failed to save active tab in localStorage', e);
    }
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash.replace('#', '');
      const mainHash = fullHash.split('/')[0];
      if (['home', 'family', 'directory', 'matrimony', 'business', 'profile', 'admin'].includes(mainHash)) {
        setActiveTabState(mainHash);
        localStorage.setItem('gsa_active_tab', mainHash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginDefaultTab, setLoginDefaultTab] = useState<'email' | 'whatsapp' | 'admin'>('email');

  const { showToast } = useToast();

  // 🔴 Mandatory First-Load Authentication Check
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const handleOpenLoginModal = (tab: 'email' | 'whatsapp' | 'admin' = 'email') => {
    setLoginDefaultTab(tab);
    setIsLoginOpen(true);
  };

  const handleUpdateStatus = (memberName: string, newStatus: string) => {
    const statusText = newStatus === 'engaged' ? 'सगाई / Engaged' : 'विवाहित / Married';
    showToast(`✨ Success! ${memberName} updated to ${statusText}.`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col pb-20 lg:pb-0 selection:bg-amber-400 selection:text-slate-950 font-sans">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openAIBot={() => setIsAIOpen(true)} 
        openLoginModal={handleOpenLoginModal}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-28 lg:pb-10">
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} openAIBot={() => setIsAIOpen(true)} />}
        {activeTab === 'family' && <FamilyTree />}
        {activeTab === 'directory' && <Directory />}
        {activeTab === 'matrimony' && <Matrimony />}
        {activeTab === 'business' && <Business />}
        {activeTab === 'profile' && <ProfileKYC />}
        {activeTab === 'admin' && (
          role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <div className="ios-glass-card p-8 text-center space-y-4 max-w-md mx-auto my-12">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto border border-amber-300">
                🔒
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">एडमिन लॉगिन आवश्यक है</h2>
              <p className="text-xs text-slate-600 font-medium">
                एडमिन डैशबोर्ड का उपयोग करने के लिए कृपया एडमिन सुरक्षा पिन (Admin PIN) दर्ज करें।
              </p>
              <button
                onClick={() => handleOpenLoginModal('admin')}
                className="ios-btn-gold px-6 py-3 rounded-2xl text-xs font-black shadow-md border border-amber-300 w-full"
              >
                🔑 एडमिन सुरक्षा पिन दर्ज करें (Demo: 7860)
              </button>
            </div>
          )
        )}
      </main>

      <AIAssistantModal 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
        onUpdateStatus={handleUpdateStatus} 
      />

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        defaultTab={loginDefaultTab}
      />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainAppContent />
        </AuthProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}

export default App;

