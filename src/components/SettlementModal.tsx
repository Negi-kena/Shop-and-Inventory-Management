import React, { useState } from 'react';
import { 
  X, 
  DollarSign, 
  CheckCircle, 
  Building2, 
  Smartphone, 
  Banknote, 
  CreditCard 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SupplierObligation, PaymentMethod } from '../types';

interface SettlementModalProps {
  obligation: SupplierObligation | null;
  onClose: () => void;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({ obligation, onClose }) => {
  const { settleObligation, formatMoney, t } = useApp();

  const [amount, setAmount] = useState<number>(() => obligation?.remainingBalance || 0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('telebirr');
  const [notes, setNotes] = useState<string>('');

  if (!obligation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    settleObligation(obligation.id, amount, paymentMethod, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-slate-100">{t('ob_settlement_title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs text-slate-200">
          
          {/* Obligation Summary Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Supplier/Partner:</span>
              <span className="font-bold text-white text-right">{obligation.supplierName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Product:</span>
              <span className="font-semibold text-slate-200">{obligation.productName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Obligation:</span>
              <span className="font-mono text-slate-300">{formatMoney(obligation.totalObligation)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Already Settled:</span>
              <span className="font-mono text-emerald-400">{formatMoney(obligation.amountSettled)}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-700/60 font-bold">
              <span className="text-amber-300">Remaining Balance:</span>
              <span className="font-mono text-amber-400 text-sm">{formatMoney(obligation.remainingBalance)}</span>
            </div>
          </div>

          {/* Amount to pay */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-300 block">{t('ob_amount_to_pay')}</label>
              <button
                type="button"
                onClick={() => setAmount(obligation.remainingBalance)}
                className="text-[10px] text-amber-400 underline font-semibold"
              >
                Pay Full Balance
              </button>
            </div>
            <input
              type="number"
              min="1"
              max={obligation.remainingBalance}
              value={amount || ''}
              onChange={e => setAmount(Math.min(obligation.remainingBalance, Math.max(0, parseFloat(e.target.value) || 0)))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">{t('ob_payment_method')}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('telebirr')}
                className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 ${
                  paymentMethod === 'telebirr'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Telebirr</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cbe_birr')}
                className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 ${
                  paymentMethod === 'cbe_birr'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>CBE Birr</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 ${
                  paymentMethod === 'cash'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <Banknote className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Cash</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Bank Transfer</span>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">Notes / Reference</label>
            <input
              type="text"
              placeholder="e.g. Telebirr Txn #FT9429188"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Confirm Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={amount <= 0}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-400 active:scale-98 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 stroke-[2.5]" />
              <span>{t('ob_settle_confirm')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
