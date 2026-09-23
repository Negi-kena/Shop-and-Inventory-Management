import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  ArrowLeft, 
  Search,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomersScreen: React.FC = () => {
  const { 
    customers, 
    addCustomer, 
    setMoreSubPage, 
    formatMoney, 
    t 
  } = useApp();

  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const filtered = customers.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.location.toLowerCase().includes(q);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomer({
      name: name.trim(),
      phone: phone.trim() || '+251 9...',
      location: location.trim() || 'Addis Ababa',
      notes: notes.trim(),
    });

    setIsAddOpen(false);
    setName('');
    setPhone('');
    setLocation('');
    setNotes('');
  };

  return (
    <div className="pb-24 pt-2 px-3.5 max-w-lg mx-auto space-y-3.5 animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMoreSubPage(null)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to More</span>
        </button>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>{t('cust_add_new')}</span>
        </button>
      </div>

      <div>
        <h2 className="font-bold text-base text-white">{t('cust_title')}</h2>
        <p className="text-[11px] text-slate-400">
          Client identification and purchase history tracking
        </p>
      </div>

      {/* No Customer Credit Policy Notice */}
      <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-2xl flex items-center gap-2.5 text-xs text-amber-300">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-[11px] font-medium">{t('cust_no_credit_policy')}</span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by customer name, phone, or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700/80 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-inner"
        />
      </div>

      {/* Customers List */}
      <div className="space-y-3">
        {filtered.map(cust => (
          <div
            key={cust.id}
            className="bg-slate-800/90 border border-slate-700/70 rounded-2xl p-3.5 space-y-2 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-white">{cust.name}</h3>
                <a
                  href={`tel:${cust.phone}`}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Phone className="w-3 h-3" />
                  <span>{cust.phone}</span>
                </a>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">{t('cust_total_spent')}</span>
                <span className="font-mono text-xs font-black text-amber-400">
                  {formatMoney(cust.totalSpent)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {cust.ordersCount} {cust.ordersCount === 1 ? 'sale' : 'sales'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
              <span className="flex items-center gap-1 truncate max-w-[180px]">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="truncate">{cust.location}</span>
              </span>

              {cust.notes && (
                <span className="italic text-slate-400 truncate max-w-[140px]">
                  {cust.notes}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-4 space-y-3">
            <h3 className="font-bold text-sm text-white">{t('cust_add_new')}</h3>
            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-0.5">{t('cust_name')} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kassahun Worku"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">{t('cust_phone')} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +251 91 123 4567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">{t('cust_location')}</label>
                <input
                  type="text"
                  placeholder="e.g. Bole Subcity, Woreda 03"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Electrical installer / Church choir tech"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  {t('common_cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 text-slate-950 rounded-xl font-bold"
                >
                  {t('common_save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
