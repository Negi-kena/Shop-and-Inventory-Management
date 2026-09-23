import React, { useState } from 'react';
import { 
  Layers, 
  ArrowDownToLine, 
  Sliders, 
  AlertTriangle, 
  Building2, 
  Clock, 
  CheckCircle, 
  Undo2, 
  DollarSign, 
  History,
  TrendingDown,
  TrendingUp,
  Package,
  Calendar,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReceiveStockModal } from '../components/ReceiveStockModal';
import { SettlementModal } from '../components/SettlementModal';
import { ReturnStockModal } from '../components/ReturnStockModal';
import { SupplierObligation } from '../types';

export const StockScreen: React.FC = () => {
  const { 
    products, 
    supplierObligations, 
    inventoryMovements, 
    adjustStock, 
    formatMoney, 
    role, 
    language,
    t 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'levels' | 'obligations' | 'history'>('levels');
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [settlingObligation, setSettlingObligation] = useState<SupplierObligation | null>(null);
  const [returningObligation, setReturningObligation] = useState<SupplierObligation | null>(null);

  // Adjustment modal state
  const [adjustProdId, setAdjustProdId] = useState<string | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [adjustType, setAdjustType] = useState<'adjustment' | 'damaged'>('adjustment');

  // Stats
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalStockValue = products.reduce((sum, p) => sum + p.stock * p.costPrice, 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStockLevel).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const totalObligationsPending = supplierObligations
    .filter(o => o.status !== 'settled' && o.status !== 'returned')
    .reduce((sum, o) => sum + o.remainingBalance, 0);

  const openAdjust = (prodId: string) => {
    const p = products.find(prod => prod.id === prodId);
    if (!p) return;
    setAdjustProdId(prodId);
    setAdjustQty(p.stock);
    setAdjustReason('Physical store inventory count verification');
    setAdjustType('adjustment');
  };

  const submitAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustProdId) return;
    adjustStock(adjustProdId, adjustQty, adjustReason, adjustType);
    setAdjustProdId(null);
  };

  return (
    <div className="pb-24 pt-2 px-3.5 max-w-lg mx-auto space-y-3.5 animate-in fade-in">
      
      {/* Top Header & Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-base text-white">{t('stock_title')}</h2>
          <p className="text-[11px] text-slate-400">
            {totalUnits} units in warehouse &bull; {lowStockCount + outOfStockCount} items need attention
          </p>
        </div>

        <button
          onClick={() => setIsReceiveOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 active:scale-95 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-emerald-900/30 transition-all"
        >
          <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
          <span>{t('stock_receive_btn')}</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-800/90 rounded-2xl border border-slate-700/80">
        <button
          onClick={() => setActiveSubTab('levels')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'levels'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'am' ? 'የሱቅ ዕቃዎች' : language === 'om' ? 'Qabeenya' : 'Shop Inventory'}
        </button>
        <button
          onClick={() => setActiveSubTab('obligations')}
          className={`py-2 text-xs font-bold rounded-xl transition-all relative ${
            activeSubTab === 'obligations'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>{language === 'am' ? 'የአቅራቢ እዳ' : language === 'om' ? 'Liqii Dhiyeessaa' : 'Pay Suppliers'}</span>
          {supplierObligations.some(o => o.status === 'active' || o.status === 'partially_settled') && (
            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block ml-1" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'history'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'am' ? 'እንቅስቃሴ' : language === 'om' ? 'Seenaa' : 'Stock Activity'}
        </button>
      </div>

      {/* TAB 1: Stock Levels */}
      {activeSubTab === 'levels' && (
        <div className="space-y-3 animate-in fade-in">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-400 block">{t('stock_total_val')}</span>
              <span className="text-xs font-black text-white font-mono">{formatMoney(totalStockValue)}</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-2.5">
              <span className="text-[10px] text-amber-400 block">{t('stock_low_count')}</span>
              <span className="text-xs font-black text-amber-400 font-mono">{lowStockCount} items</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-2.5">
              <span className="text-[10px] text-red-400 block">{t('stock_out_count')}</span>
              <span className="text-xs font-black text-red-400 font-mono">{outOfStockCount} items</span>
            </div>
          </div>

          {/* Product Items Stock Status Cards */}
          <div className="space-y-2">
            {products.map(p => {
              const isOutOfStock = p.stock === 0;
              const isLowStock = p.stock > 0 && p.stock <= p.minStockLevel;

              return (
                <div
                  key={p.id}
                  className="bg-slate-800/90 border border-slate-700/70 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                        {p.sku}
                      </span>
                      {p.stockSource !== 'owned' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-purple-950 text-purple-300 border border-purple-800">
                          {p.stockSource === 'partner' ? 'Partner Borrowed' : 'Supplier Consignment'}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs text-white truncate mt-0.5">{p.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Min Alert Threshold: <strong className="text-slate-300">{p.minStockLevel}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <span className={`text-sm font-black font-mono block ${
                        isOutOfStock ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {p.stock} units
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block ${
                        isOutOfStock 
                          ? 'bg-red-950 text-red-300 border border-red-800' 
                          : isLowStock 
                          ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>

                    {/* Adjust button */}
                    <button
                      onClick={() => openAdjust(p.id)}
                      className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 active:scale-90 transition-transform"
                      title="Adjust / Loss"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: Supplier & Partner Consignment Obligations */}
      {activeSubTab === 'obligations' && (
        <div className="space-y-3 animate-in fade-in">
          
          {/* Important business notice banner */}
          <div className="bg-purple-950/40 border border-purple-800/60 rounded-2xl p-3 text-xs text-purple-200 flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">{t('ob_title')}</p>
              <p className="text-[11px] text-purple-300/80 mt-0.5">{t('ob_notice')}</p>
            </div>
          </div>

          {/* Total Pending Balance Card */}
          <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-700/60 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-purple-300 uppercase tracking-wide">
                Total Remaining Obligation
              </span>
              <h3 className="text-lg font-black text-white font-mono mt-0.5">
                {formatMoney(totalObligationsPending)}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Obligations List */}
          <div className="space-y-3">
            {supplierObligations.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p>No supplier or partner obligations pending.</p>
              </div>
            ) : (
              supplierObligations.map(ob => {
                const isFullySettled = ob.status === 'settled';
                const isReturned = ob.status === 'returned';

                return (
                  <div
                    key={ob.id}
                    className="bg-slate-800/90 border border-slate-700/70 rounded-2xl p-3.5 space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase font-bold text-purple-400">
                            {ob.supplierName}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            isFullySettled
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : isReturned
                              ? 'bg-slate-900 text-slate-400 border border-slate-700'
                              : ob.status === 'partially_settled'
                              ? 'bg-sky-950 text-sky-300 border border-sky-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {ob.status === 'active' ? t('ob_active') : ob.status === 'partially_settled' ? t('ob_partial') : isFullySettled ? t('ob_settled') : t('ob_returned')}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-white mt-0.5">{ob.productName}</h4>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">{t('ob_remaining')}</span>
                        <span className={`font-mono text-sm font-black ${isFullySettled ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {formatMoney(ob.remainingBalance)}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/50 text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Received</span>
                        <span className="font-bold text-white">{ob.quantityReceived} units</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Cost/Unit</span>
                        <span className="font-mono text-slate-300">{formatMoney(ob.costPerUnit)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Total Due</span>
                        <span className="font-mono text-slate-300">{formatMoney(ob.totalObligation)}</span>
                      </div>
                    </div>

                    {/* Dates & Notes */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Due: {new Date(ob.expectedSettlementDate).toLocaleDateString()}</span>
                      </span>
                      {ob.notes && <span className="italic truncate max-w-[160px]">{ob.notes}</span>}
                    </div>

                    {/* Action buttons if not settled */}
                    {!isFullySettled && !isReturned && (
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-700/50">
                        <button
                          onClick={() => setReturningObligation(ob)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-[11px] font-semibold active:scale-95"
                        >
                          <Undo2 className="w-3 h-3" />
                          <span>{t('ob_return_stock')}</span>
                        </button>

                        <button
                          onClick={() => setSettlingObligation(ob)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold active:scale-95 shadow-md shadow-amber-500/20"
                        >
                          <DollarSign className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{t('ob_record_settlement')}</span>
                        </button>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* TAB 3: Inventory Movements / Audit Trail */}
      {activeSubTab === 'history' && (
        <div className="space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <History className="w-4 h-4 text-sky-400" />
              <span>Full Inventory Audit Trail</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {inventoryMovements.length} logged events
            </span>
          </div>

          <div className="space-y-2">
            {inventoryMovements.map(mov => {
              const isPositive = mov.quantityDelta > 0;
              const dateStr = new Date(mov.createdAt).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={mov.id}
                  className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-start justify-between gap-3 text-xs shadow-sm"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                      isPositive 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white truncate text-xs">{mov.productName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({mov.sku})</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{mov.reason}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Stock: {mov.previousStock} &rarr; <strong className="text-slate-300">{mov.newStock}</strong> &bull; By {mov.createdBy}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`font-mono font-black text-xs block ${
                      isPositive ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {isPositive ? `+${mov.quantityDelta}` : mov.quantityDelta}
                    </span>
                    <span className="text-[10px] text-slate-500">{dateStr}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Receive Stock Modal */}
      <ReceiveStockModal
        isOpen={isReceiveOpen}
        onClose={() => setIsReceiveOpen(false)}
      />

      {/* Settle Obligation Modal */}
      <SettlementModal
        obligation={settlingObligation}
        onClose={() => setSettlingObligation(null)}
      />

      {/* Return Stock Modal */}
      <ReturnStockModal
        obligation={returningObligation}
        onClose={() => setReturningObligation(null)}
      />

      {/* Quick Adjust Modal */}
      {adjustProdId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-white">{t('stock_adjust_title')}</h3>
              <button onClick={() => setAdjustProdId(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitAdjust} className="space-y-3 text-xs">
              <p className="text-slate-300 font-semibold">
                {products.find(p => p.id === adjustProdId)?.name}
              </p>

              <div>
                <label className="text-slate-400 block mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('adjustment')}
                    className={`py-1.5 rounded-lg border text-xs font-semibold ${
                      adjustType === 'adjustment' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Inventory Count
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('damaged')}
                    className={`py-1.5 rounded-lg border text-xs font-semibold ${
                      adjustType === 'damaged' ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Damaged / Lost
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">New Total In-Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjustQty}
                  onChange={e => setAdjustQty(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t('stock_reason')}</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 rounded-xl text-xs"
              >
                Confirm Stock Adjustment
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
