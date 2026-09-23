import React, { useState } from 'react';
import { 
  X, 
  ArrowDownToLine, 
  Package, 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StockSource } from '../types';

interface ReceiveStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProductId?: string;
}

export const ReceiveStockModal: React.FC<ReceiveStockModalProps> = ({
  isOpen,
  onClose,
  preselectedProductId,
}) => {
  const { 
    products, 
    supplierPartners, 
    receiveStock, 
    formatMoney, 
    t 
  } = useApp();

  const [productId, setProductId] = useState<string>(preselectedProductId || (products[0]?.id || ''));
  const [stockSource, setStockSource] = useState<StockSource>('owned');
  const [supplierPartnerId, setSupplierPartnerId] = useState<string>(supplierPartners[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [costPrice, setCostPrice] = useState<number>(() => {
    const p = products.find(prod => prod.id === (preselectedProductId || products[0]?.id));
    return p ? p.costPrice : 1000;
  });
  const [expectedDueDate, setExpectedDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const selectedProduct = products.find(p => p.id === productId);

  const handleProductChange = (newId: string) => {
    setProductId(newId);
    const p = products.find(prod => prod.id === newId);
    if (p) {
      setCostPrice(p.costPrice);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity <= 0) return;

    receiveStock(
      productId,
      quantity,
      costPrice,
      stockSource,
      stockSource !== 'owned' ? supplierPartnerId : undefined,
      notes,
      stockSource !== 'owned' ? new Date(expectedDueDate).toISOString() : undefined
    );

    onClose();
  };

  const totalCost = quantity * costPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-sm text-slate-100">{t('stock_receive_title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-200">
          
          {/* Select Product */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">{t('prod_name')}</label>
            <select
              value={productId}
              onChange={e => handleProductChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — Current Stock: {p.stock}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Ownership / Source */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">
              {t('stock_source_type')} <span className="text-amber-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setStockSource('owned')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  stockSource === 'owned'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500 shadow-md'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <p className="text-xs font-bold">{t('prod_source_owned')}</p>
                <p className="text-[9px] opacity-75 mt-0.5">Shop Owned (የራሳችን)</p>
              </button>
              <button
                type="button"
                onClick={() => setStockSource('supplier')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  stockSource === 'supplier'
                    ? 'bg-purple-950/80 border-purple-500 text-purple-300 ring-1 ring-purple-500 shadow-md'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <p className="text-xs font-bold">{t('prod_source_supplier')}</p>
                <p className="text-[9px] opacity-75 mt-0.5">Pay Later (ከአቅራቢ)</p>
              </button>
              <button
                type="button"
                onClick={() => setStockSource('partner')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  stockSource === 'partner'
                    ? 'bg-sky-950/80 border-sky-500 text-sky-300 ring-1 ring-sky-500 shadow-md'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <p className="text-xs font-bold">{t('prod_source_partner')}</p>
                <p className="text-[9px] opacity-75 mt-0.5">Borrowed (ከተዋስነው)</p>
              </button>
            </div>
          </div>

          {/* If Supplier or Partner, select supplier */}
          {stockSource !== 'owned' && (
            <div className="p-3 bg-purple-950/30 border border-purple-800/50 rounded-xl space-y-2.5 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Consignment Obligation will be created</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium block">
                  {t('stock_supplier_partner')}
                </label>
                <select
                  value={supplierPartnerId}
                  onChange={e => setSupplierPartnerId(e.target.value)}
                  className="w-full bg-slate-900 border border-purple-700/60 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                  required
                >
                  {supplierPartners.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.company} ({s.type}) - {s.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium block">
                  {t('ob_due_date')}
                </label>
                <input
                  type="date"
                  value={expectedDueDate}
                  onChange={e => setExpectedDueDate(e.target.value)}
                  className="w-full bg-slate-900 border border-purple-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Quantity & Unit Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 block">
                {t('stock_qty_received')}
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 block">
                {t('stock_cost_unit')}
              </label>
              <input
                type="number"
                min="0"
                value={costPrice}
                onChange={e => setCostPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">
              {t('stock_reason')} / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Received from Merkato importer consignment"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Calculation summary */}
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex justify-between items-center text-xs">
            <span className="text-slate-400">Total Inflow Value:</span>
            <span className="font-bold text-amber-400 font-mono text-sm">{formatMoney(totalCost)}</span>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-98 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
            >
              <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
              <span>{t('stock_confirm_save')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
