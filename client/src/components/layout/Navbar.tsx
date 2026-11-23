// [GSA-NAV-F-CM] - Ghanchi Samaj App Header & Navigation Dock Component
import React from 'react';
import { Home, Users, Heart, Briefcase, Bot, ShieldCheck, LogIn, UserCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAIBot: () => void;
  openLoginModal: (defaultTab?: 'email' | 'whatsapp' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAIBot, openLoginModal }) => {
  // [GSA-NAV-F-CM-01: Navigation Items & Auth State]
  const { t, language } = useLanguage();
  const { user, role, isLoggedIn } = useAuth();

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'family', label: t('navFamily'), icon: Users },
    { id: 'matrimony', label: t('navMatrimony'), icon: Heart },
    { id: 'directory', label: t('navDirectory'), icon: Users },
    { id: 'business', label: t('navBusiness'), icon: Briefcase },
  ];

  const handleAdminClick = () => {
    if (role === 'admin') {
      setActiveTab('admin');
    } else {
      openLoginModal('admin');
    }
  };

  return (
    <>
      {/* [GSA-NAV-F-CM-02: iOS 18 Light Glass Top Header Bar] */}
      <header className="sticky top-0 z-40 ios-glass-nav text-slate-900 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Row: Menu | Centered App Title | Admin & Profile Buttons */}
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Left: Admin Quick Button */}
            {role !== 'member' && (
              <button 
                id="nav-btn-admin"
                data-nav="admin"
                data-testid="nav-btn-admin"
                aria-label="Admin Control Panel"
                onClick={handleAdminClick}
                className={`p-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  role === 'admin' && activeTab === 'admin'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-amber-50/90 text-amber-900 border-amber-200/80 hover:bg-amber-100'
                }`}
                title="Admin Panel"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline font-extrabold">
                  {role === 'admin' ? (language === 'hi' ? 'एडमिन एक्टिव' : 'Admin Mode') : (language === 'hi' ? 'एडमिन लॉगिन' : 'Admin Login')}
                </span>
              </button>
            )}

            {/* Center: Title & Subtitle */}
            <div 
              id="nav-header-logo"
              data-nav="home"
              data-testid="nav-header-logo"
              aria-label="Shree Ghanchi Samaj Home"
              className="text-center cursor-pointer group"
              onClick={() => setActiveTab('home')}
            >
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight tracking-tight flex items-center justify-center gap-1.5">
                <span>🚩</span> {t('appTitle')}
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">{t('appTagline')}</p>
            </div>

            {/* Right: Login/Logout + AI Bot + Profile Icon */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {!isLoggedIn && (
                <button
                  onClick={() => openLoginModal('email')}
                  className="ios-btn-primary px-3 py-1.5 rounded-2xl text-xs font-extrabold shadow-sm border border-blue-600 flex items-center gap-1 hover:scale-105 active:scale-95 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{language === 'hi' ? 'लॉगिन' : 'Login'}</span>
                </button>
              )}

              <button
                id="nav-btn-ai-bot"
                data-nav="ai-assistant"
                data-testid="nav-btn-ai-bot"
                aria-label="Open AI Voice Assistant"
                onClick={openAIBot}
                className="ios-btn-gold p-2 rounded-2xl shadow-sm border border-amber-300 active:scale-95 transition-all"
                title={t('navAIAssistant')}
              >
                <Bot className="w-5 h-5 text-slate-950" />
              </button>
              
              {/* Profile Icon in Top Header */}
              <button
                id="nav-btn-profile"
                data-nav="profile"
                data-testid="nav-btn-profile"
                aria-label="Profile and KYC Page"
                onClick={() => setActiveTab('profile')}
                className={`p-2 rounded-2xl border transition-all active:scale-95 ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title={t('navProfile')}
              >
                <Users className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Desktop Navigation Row */}
          <div className="hidden lg:flex items-center justify-center pb-3 border-t border-slate-200/40 pt-2.5">
            <nav className="flex items-center gap-1 bg-white/70 p-1.5 rounded-2xl border border-slate-200/80 backdrop-blur-md shadow-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-desktop-${item.id}`}
                    data-nav={item.id}
                    data-testid={`nav-desktop-${item.id}`}
                    aria-label={item.label}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'ios-btn-primary shadow-md scale-105'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

        </div>
      </header>

      {/* [GSA-NAV-F-CM-03: Floating iOS 18 Light Glass Mobile Bottom Dock (5 Clean Tabs)] */}
      {activeTab !== 'admin' && (
        <div className="lg:hidden fixed bottom-3 left-4 right-4 z-50">
          <nav className="ios-glass-dock rounded-3xl p-2 flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-mobile-${item.id}`}
                data-nav={item.id}
                data-testid={`nav-mobile-${item.id}`}
                aria-label={item.label}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all ${
                  isActive ? 'bg-blue-600 text-white font-extrabold shadow-md scale-105' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-[10px] mt-0.5 tracking-tight font-bold">
                  {item.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
          </nav>
        </div>
      )}
    </>
  );
};
