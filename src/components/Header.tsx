import React, { useState } from 'react';
import { 
  Sun, 
  Wifi, 
  WifiOff, 
  Bell, 
  ShieldCheck, 
  UserCheck, 
  Globe,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { QuickGuideModal } from './QuickGuideModal';

export const Header: React.FC = () => {
  const { 
    settings, 
    role, 
    setRole, 
    language, 
    setLanguage, 
    isOnline, 
    toggleOnline, 
    offlineQueueCount, 
    syncOfflineQueue, 
    notifications,
    setActiveTab,
    setMoreSubPage,
    t
  } = useApp();

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const cycleLanguage = () => {
    const order: Language[] = ['en', 'am', 'om'];
    const currentIndex = order.indexOf(language);
    const nextLang = order[(currentIndex + 1) % order.length];
    setLanguage(nextLang);
  };

  const getLanguageDetails = (lang: Language) => {
    switch (lang) {
      case 'am': return { code: 'አማ', name: 'አማርኛ' };
      case 'om': return { code: 'Oro', name: 'Afaan Oromoo' };
      default: return { code: 'EN', name: 'English' };
    }
  };

  const currentLang = getLanguageDetails(language);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-3.5 py-2.5 shadow-md">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          
          {/* Shop Identity & Logo */}
          <div 
            onClick={() => { setActiveTab('home'); setMoreSubPage(null); }}
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 shrink-0">
              <Sun className="w-5 h-5 text-slate-950 fill-slate-950/20" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-sm leading-tight text-white truncate max-w-[130px] sm:max-w-[170px]">
                {settings.businessName}
              </h1>
              <p className="text-[11px] text-amber-400 font-medium tracking-wide flex items-center gap-1">
                <span>{settings.city || 'Addis Ababa'}</span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-slate-400 font-normal">Electronics & Solar</span>
              </p>
            </div>
          </div>

          {/* Action Controls (Right) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Quick Guide Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              title="Help & 1-minute Guide"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 active:scale-95 transition-all flex items-center gap-1"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-[10px] font-bold hidden sm:inline">Guide</span>
            </button>

            {/* Offline / Online indicator */}
            <button
              onClick={offlineQueueCount > 0 && isOnline ? syncOfflineQueue : toggleOnline}
              title={isOnline ? 'Online - Tap to test offline mode' : 'Offline - Tap to reconnect'}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold transition-colors active:scale-95 ${
                isOnline 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80' 
                  : 'bg-amber-950/90 text-amber-300 border border-amber-700/80 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] font-medium hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-bold">Offline</span>
                </>
              )}
              {offlineQueueCount > 0 && (
                <span className="ml-0.5 bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {offlineQueueCount}
                </span>
              )}
            </button>

            {/* Role Switcher Pill */}
            <button
              onClick={() => setRole(role === 'owner' ? 'salesperson' : 'owner')}
              title={`Currently in ${role === 'owner' ? 'Owner Mode' : 'Sales Staff Mode'}. Tap to switch.`}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl border text-xs font-medium active:scale-95 transition-all ${
                role === 'owner'
                  ? 'bg-amber-950/60 border-amber-700/80 text-amber-300'
                  : 'bg-sky-950/60 border-sky-700/80 text-sky-300'
              }`}
            >
              {role === 'owner' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-bold">Owner</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-[11px] font-bold">Staff</span>
                </>
              )}
            </button>

            {/* Language Switcher (EN, አማ, Oro) */}
            <button
              onClick={cycleLanguage}
              title="Change Language (English / አማርኛ / Afaan Oromoo)"
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold active:scale-95 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] text-indigo-300 font-bold">{currentLang.code}</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => {
                setActiveTab('more');
                setMoreSubPage('notifications');
              }}
              className="relative p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 active:scale-95"
              title={t('notif_title')}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* Quick Guide Modal */}
      <QuickGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </>
  );
};
