import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  ArrowLeft, 
  Calendar, 
  User, 
  Truck, 
  Building, 
  Zap, 
  Users, 
  Wrench, 
  Megaphone, 
  Tag 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExpenseModal } from '../components/ExpenseModal';
import { Expense } from '../types';

export const ExpensesScreen: React.FC = () => {
  const { expenses, setMoreSubPage, formatMoney, t } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('all');

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const getCatIcon = (cat: Expense['category']) => {
    switch (cat) {
      case 'transport': return <Truck className="w-3.5 h-3.5 text-sky-400" />;
      case 'rent': return <Building className="w-3.5 h-3.5 text-amber-400" />;
      case 'electricity': return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
      case 'salary': return <Users className="w-3.5 h-3.5 text-emerald-400" />;
      case 'repairs': return <Wrench className="w-3.5 h-3.5 text-orange-400" />;
      case 'marketing': return <Megaphone className="w-3.5 h-3.5 text-purple-400" />;
      default: return <Tag className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const filtered = expenses.filter(e => filterCat === 'all' || e.category === filterCat);

  return (
    <div className="pb-24 pt-2 px-3.5 max-w-lg mx-auto space-y-3.5 animate-in fade-in">
      
      {/* Back button & Add button */}
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
          <span>{t('exp_add_new')}</span>
        </button>
      </div>

      {/* Title & Total */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">
            {t('exp_title')}
          </span>
          <h2 className="text-xl font-black text-white font-mono mt-0.5">
            {formatMoney(totalExpense)}
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {expenses.length} operating expense entries recorded
          </p>
        </div>
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
          <Receipt className="w-6 h-6" />
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {['all', 'rent', 'transport', 'electricity', 'salary', 'repairs', 'other'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold capitalize active:scale-95 ${
              filterCat === cat
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expenses List */}
      <div className="space-y-2.5">
        {filtered.map(exp => (
          <div
            key={exp.id}
            className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-start justify-between gap-3 shadow-sm"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 shrink-0 mt-0.5">
                {getCatIcon(exp.category)}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  {exp.category}
                </span>
                <h4 className="font-semibold text-xs text-white leading-tight mt-0.5">
                  {exp.description}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span className="flex items-center gap-0.5">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{new Date(exp.date).toLocaleDateString()}</span>
                  </span>
                  <span>&bull;</span>
                  <span>By {exp.recordedBy}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-mono text-xs font-black text-red-400 block">
                -{formatMoney(exp.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <ExpenseModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

    </div>
  );
};
