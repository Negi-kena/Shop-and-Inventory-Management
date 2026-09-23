import React, { useState } from 'react';
import { X, Receipt, PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addExpense, settings, role, t } = useApp();

  const [category, setCategory] = useState<Expense['category']>('rent');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description.trim()) return;

    addExpense({
      category,
      amount,
      date: new Date(date).toISOString(),
      description: description.trim(),
      recordedBy: role === 'owner' ? settings.ownerName : 'Sales Staff',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-slate-100">{t('exp_add_new')}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs text-slate-200">
          
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">{t('exp_category')}</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Expense['category'])}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="transport">{t('exp_cat_transport')}</option>
              <option value="rent">{t('exp_cat_rent')}</option>
              <option value="electricity">{t('exp_cat_electricity')}</option>
              <option value="salary">{t('exp_cat_salary')}</option>
              <option value="repairs">{t('exp_cat_repairs')}</option>
              <option value="marketing">{t('exp_cat_marketing')}</option>
              <option value="other">{t('exp_cat_other')}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">{t('exp_amount')}</label>
            <input
              type="number"
              min="1"
              required
              value={amount || ''}
              onChange={e => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="e.g. 1500"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">{t('exp_date')}</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">{t('exp_description')}</label>
            <input
              type="text"
              required
              placeholder="e.g. Generator diesel fuel for power outage"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={amount <= 0 || !description.trim()}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 active:scale-98 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Record Expense</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
