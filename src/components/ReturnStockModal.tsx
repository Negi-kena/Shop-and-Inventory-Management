import React, { useState } from 'react';
import { X, Undo2, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SupplierObligation } from '../types';

interface ReturnStockModalProps {
  obligation: SupplierObligation | null;
  onClose: () => void;
}

export const ReturnStockModal: React.FC<ReturnStockModalProps> = ({ obligation, onClose }) => {
  const { returnObligationStock, t, formatMoney } = useApp();
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('Unsold inventory returned at end of consignment agreement');

  if (!obligation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    returnObligationStock(obligation.id, quantity, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col my-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Undo2 className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-slate-100">{t('ob_return_stock')}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs text-slate-200">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 space-y-1">
            <p className="text-slate-400">Supplier: <span className="font-bold text-white">{obligation.supplierName}</span></p>
            <p className="text-slate-400">Product: <span className="font-semibold text-slate-200">{obligation.productName}</span></p>
            <p className="text-slate-400">Consigned Units Left: <span className="font-bold text-amber-400">{obligation.quantityRemaining}</span></p>
            <p className="text-slate-400">Cost/Unit: <span className="font-mono text-slate-300">{formatMoney(obligation.costPerUnit)}</span></p>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">Quantity to Return</label>
            <input
              type="number"
              min="1"
              max={obligation.quantityRemaining}
              value={quantity}
              onChange={e => setQuantity(Math.min(obligation.quantityRemaining, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">Reason for Return</label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="p-2.5 bg-amber-950/40 border border-amber-800/50 rounded-xl text-[11px] text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span>Returning stock will deduct {quantity} units from store inventory and reduce remaining obligation by {formatMoney(quantity * obligation.costPerUnit)}.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-500 active:scale-98 text-white font-bold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Undo2 className="w-4 h-4 stroke-[2.5]" />
            <span>Confirm Return to Supplier</span>
          </button>
        </form>
      </div>
    </div>
  );
};
