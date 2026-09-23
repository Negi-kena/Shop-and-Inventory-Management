import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  ArrowLeft, 
  Save, 
  Globe, 
  ShieldCheck, 
  Building, 
  Phone, 
  MapPin, 
  FileText, 
  RotateCcw,
  Sparkles,
  Lock,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language, UserRole } from '../types';

export const SettingsScreen: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    language, 
    setLanguage, 
    role, 
    setRole, 
    setMoreSubPage, 
    resetToDemoData, 
    showToast,
    t 
  } = useApp();

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [city, setCity] = useState(settings.city);
  const [tinNumber, setTinNumber] = useState(settings.tinNumber);
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      businessName,
      ownerName,
      phone,
      address,
      city,
      tinNumber,
      receiptFooter,
    });
    showToast('Business settings saved successfully');
  };

  const handleReset = () => {
    if (window.confirm('Reset all inventory, sales, and obligations to original demo data?')) {
      resetToDemoData();
      showToast('Reset to demo data');
      setMoreSubPage(null);
    }
  };

  return (
    <div className="pb-24 pt-2 px-3.5 max-w-lg mx-auto space-y-4 animate-in fade-in">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMoreSubPage(null)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to More</span>
        </button>

        <span className="text-xs font-bold text-amber-400">Settings</span>
      </div>

      <div>
        <h2 className="font-bold text-base text-white">{t('set_title')}</h2>
        <p className="text-[11px] text-slate-400">
          Configure business profile, language, and staff role
        </p>
      </div>

      {/* Language Selection Card */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 space-y-2.5 shadow-sm">
        <label className="text-xs font-bold text-white flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-indigo-400" />
          <span>{t('set_language')}</span>
        </label>
        <p className="text-[11px] text-slate-400">
          Select interface language. Afaan Oromoo is displayed as "Oro".
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <span className="block text-sm">English</span>
            <span className="text-[10px] text-slate-500">EN</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('am')}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
              language === 'am'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <span className="block text-sm">አማርኛ</span>
            <span className="text-[10px] text-slate-500">Amharic</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('om')}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
              language === 'om'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            <span className="block text-sm">Afaan Oromoo</span>
            <span className="text-[10px] text-slate-500">Oro</span>
          </button>
        </div>
      </div>

      {/* Role / Staff Mode Switcher */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 space-y-2.5 shadow-sm">
        <label className="text-xs font-bold text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Active User Role & Access</span>
        </label>
        <p className="text-[11px] text-slate-400">
          Switch between Owner (sees profits, costs, settlements) and Sales Staff (POS, product catalog, stock receiving).
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setRole('owner')}
            className={`p-3 rounded-xl border text-left transition-all ${
              role === 'owner'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Owner Mode</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Full access (Margins, P&L, Obligations)</p>
          </button>

          <button
            type="button"
            onClick={() => setRole('salesperson')}
            className={`p-3 rounded-xl border text-left transition-all ${
              role === 'salesperson'
                ? 'bg-sky-500/20 border-sky-500 text-sky-300 ring-1 ring-sky-500'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>Sales Staff</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Selling, Catalog & Stock receiving</p>
          </button>
        </div>
      </div>

      {/* Business Details Form */}
      <form onSubmit={handleSave} className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-sm text-xs">
        <h3 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
          <Building className="w-4 h-4 text-amber-400" />
          <span>Shop & Receipt Profile</span>
        </h3>

        <div>
          <label className="text-slate-400 block mb-0.5">{t('set_business_name')}</label>
          <input
            type="text"
            required
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-0.5">{t('set_owner_name')}</label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={e => setOwnerName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-0.5">{t('set_phone')}</label>
            <input
              type="text"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-0.5">{t('set_address')}</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-0.5">{t('set_city')}</label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-slate-400 block mb-0.5">{t('set_tin')}</label>
          <input
            type="text"
            placeholder="e.g. 0089421589"
            value={tinNumber}
            onChange={e => setTinNumber(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-slate-400 block mb-0.5">{t('set_receipt_footer')}</label>
          <input
            type="text"
            value={receiptFooter}
            onChange={e => setReceiptFooter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>{t('set_save_btn')}</span>
        </button>
      </form>

      {/* Demo Reset */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-400 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Demo Data</span>
        </button>
      </div>

    </div>
  );
};
