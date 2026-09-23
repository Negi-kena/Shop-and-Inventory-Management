import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Phone, 
  MapPin, 
  DollarSign, 
  ArrowLeft,
  ChevronRight,
  User,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SupplierPartner } from '../types';

export const SuppliersScreen: React.FC = () => {
  const { 
    supplierPartners, 
    supplierObligations, 
    addSupplierPartner, 
    setMoreSubPage, 
    formatMoney, 
    t 
  } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<SupplierPartner['type']>('supplier');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !phone.trim()) return;

    addSupplierPartner({
      name: name.trim() || company.trim(),
      company: company.trim(),
      phone: phone.trim(),
      location: location.trim() || 'Addis Ababa',
      type,
      notes: notes.trim(),
    });

    setIsAddOpen(false);
    setName('');
    setCompany('');
    setPhone('');
    setLocation('');
    setNotes('');
  };

  const getPartnerTypeBadge = (tType: string) => {
    switch (tType) {
      case 'supplier': return { label: 'Direct Supplier', bg: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
      case 'distributor': return { label: 'Distributor', bg: 'bg-sky-950 text-sky-300 border-sky-800' };
      case 'partner': return { label: 'Retailer Partner', bg: 'bg-purple-950 text-purple-300 border-purple-800' };
      default: return { label: 'Other', bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="pb-24 pt-2 px-3.5 max-w-lg mx-auto space-y-3.5 animate-in fade-in">
      
      {/* Header with back button */}
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
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="font-bold text-base text-white">{t('sup_title')}</h2>
          <p className="text-[11px] text-slate-400">
            {supplierPartners.length} registered suppliers & retail partners
          </p>
        </div>
      </div>

      {/* Suppliers List */}
      <div className="space-y-3">
        {supplierPartners.map(partner => {
          const badge = getPartnerTypeBadge(partner.type);
          const partnerObligations = supplierObligations.filter(o => o.supplierPartnerId === partner.id);
          const pendingBalance = partnerObligations
            .filter(o => o.status !== 'settled' && o.status !== 'returned')
            .reduce((sum, o) => sum + o.remainingBalance, 0);

          return (
            <div
              key={partner.id}
              className="bg-slate-800/90 border border-slate-700/70 rounded-2xl p-3.5 space-y-2.5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm text-white">{partner.company}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{partner.name}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">{t('sup_obligations_total')}</span>
                  <span className={`font-mono text-xs font-bold ${pendingBalance > 0 ? 'text-purple-400' : 'text-emerald-400'}`}>
                    {pendingBalance > 0 ? formatMoney(pendingBalance) : 'Fully Settled'}
                  </span>
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-xl">
                <a 
                  href={`tel:${partner.phone}`}
                  className="flex items-center gap-1 text-slate-300 hover:text-amber-400 truncate"
                >
                  <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{partner.phone}</span>
                </a>
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{partner.location}</span>
                </span>
              </div>

              {partner.notes && (
                <p className="text-[11px] text-slate-400 italic">
                  Note: {partner.notes}
                </p>
              )}

              {/* Active Consignment Count */}
              {partnerObligations.length > 0 && (
                <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-700/50">
                  <Package className="w-3 h-3 text-slate-500" />
                  <span>{partnerObligations.length} consignment batches recorded</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Supplier Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-4 space-y-3">
            <h3 className="font-bold text-sm text-white">{t('sup_add_new')}</h3>
            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-0.5">{t('sup_company')} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Merkato Solar Importers PLC"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">{t('sup_name')}</label>
                <input
                  type="text"
                  placeholder="Contact person name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">{t('sup_phone')} *</label>
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
                <label className="text-slate-400 block mb-0.5">{t('sup_location')}</label>
                <input
                  type="text"
                  placeholder="e.g. Merkato Sebategna"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">{t('sup_type')}</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as SupplierPartner['type'])}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="supplier">{t('sup_type_supplier')}</option>
                  <option value="distributor">{t('sup_type_distributor')}</option>
                  <option value="partner">{t('sup_type_partner')}</option>
                  <option value="other">{t('sup_type_other')}</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-0.5">Notes</label>
                <input
                  type="text"
                  placeholder="Payment terms, products, etc."
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
