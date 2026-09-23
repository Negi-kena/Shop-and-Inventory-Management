import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Receipt, 
  PlusCircle, 
  ArrowDownToLine, 
  Sparkles,
  Building2,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Banknote,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReceiveStockModal } from '../components/ReceiveStockModal';
import { ExpenseModal } from '../components/ExpenseModal';
import { QuickGuideModal } from '../components/QuickGuideModal';
import { Sale } from '../types';

export const HomeScreen: React.FC = () => {
  const { 
    settings, 
    role, 
    sales, 
    products, 
    supplierObligations, 
    inventoryMovements, 
    setActiveTab, 
    setMoreSubPage,
    setCurrentReceipt, 
    formatMoney, 
    language,
    t 
  } = useApp();

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Today's date ISO prefix (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  const todaySales = sales.filter(s => s.createdAt.startsWith(todayStr));
  const todaySalesTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
  const todayGrossProfit = todaySales.reduce((sum, s) => sum + s.grossProfit, 0);
  const todaySalesCount = todaySales.length;

  // Inventory stats
  const totalInventoryValue = products.reduce((sum, p) => sum + p.stock * p.costPrice, 0);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.minStockLevel);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Supplier obligations due
  const pendingObligationsList = supplierObligations.filter(
    ob => ob.status === 'active' || ob.status === 'partially_settled'
  );
  const totalPendingObligations = pendingObligationsList.reduce((sum, ob) => sum + ob.remainingBalance, 0);

  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-lg mx-auto animate-in fade-in">
      
      {/* Friendly Shop Greeting Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-4 shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {role === 'owner' ? '👑 Owner Mode' : '👤 Sales Staff'}
            </span>
            <span className="text-[11px] text-slate-400">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h2 className="text-base font-extrabold text-white leading-snug">
            {t('dash_greeting')}, {role === 'owner' ? settings.ownerName : 'Sales Staff'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {role === 'owner' 
              ? 'Here is your shop cashflow & inventory overview.' 
              : 'Ready to serve customers and record sales.'}
          </p>
        </div>

        <button
          onClick={() => setIsGuideOpen(true)}
          className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-all text-center flex flex-col items-center shrink-0 ml-2"
          title="Quick 1-minute guide"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Help</span>
        </button>
      </div>

      {/* Primary KPI Cards (Sales & Profit) */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Today's Sales */}
        <div 
          onClick={() => setActiveTab('sell')}
          className="bg-slate-800/95 border border-slate-700/90 hover:border-amber-500/40 rounded-3xl p-3.5 shadow-md flex flex-col justify-between cursor-pointer active:scale-98 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              {language === 'am' ? 'የዛሬ ሽያጭ' : language === 'om' ? 'Gurgurtaa Har\'aa' : "Today's Sales"}
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg font-black text-white font-mono leading-none tracking-tight">
              {formatMoney(todaySalesTotal)}
            </h3>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <span>{todaySalesCount} {todaySalesCount === 1 ? 'sale' : 'sales'}</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-slate-400 font-normal">Tap to Sell</span>
            </p>
          </div>
        </div>

        {/* Today's Profit or Sales Count */}
        {role === 'owner' ? (
          <div 
            onClick={() => { setActiveTab('more'); setMoreSubPage('reports'); }}
            className="bg-slate-800/95 border border-slate-700/90 hover:border-amber-500/40 rounded-3xl p-3.5 shadow-md flex flex-col justify-between cursor-pointer active:scale-98 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">
                {language === 'am' ? 'የተጣራ ትርፍ' : language === 'om' ? 'Bu\'aa Har\'aa' : "Today's Profit"}
              </span>
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-lg font-black text-amber-400 font-mono leading-none tracking-tight">
                {formatMoney(todayGrossProfit)}
              </h3>
              <p className="text-[11px] text-slate-300 font-medium mt-1 truncate">
                {todaySalesTotal > 0 
                  ? `${((todayGrossProfit / todaySalesTotal) * 100).toFixed(0)}% profit margin` 
                  : 'In pocket after cost'}
              </p>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setActiveTab('sell')}
            className="bg-slate-800/95 border border-slate-700/90 rounded-3xl p-3.5 shadow-md flex flex-col justify-between cursor-pointer active:scale-98 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400">Transactions</span>
              <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-lg font-black text-white font-mono leading-none">
                {todaySalesCount}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Receipts completed</p>
            </div>
          </div>
        )}

      </div>

      {/* Secondary Information Cards (Inventory & Supplier Balances) */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Shop Inventory */}
        <div 
          onClick={() => setActiveTab('stock')}
          className="bg-slate-800/80 border border-slate-700/70 hover:border-slate-600 rounded-2xl p-3 shadow-sm flex flex-col justify-between cursor-pointer active:scale-98 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300">
              {language === 'am' ? 'የሱቅ ዕቃዎች' : language === 'om' ? 'Qabeenya Suuqii' : 'Shop Inventory'}
            </span>
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-black text-white font-mono leading-none truncate">
              {role === 'owner' ? formatMoney(totalInventoryValue) : `${products.reduce((s, p) => s + p.stock, 0)} units`}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              {products.length} catalog items &bull; {products.reduce((s, p) => s + p.stock, 0)} in stock
            </p>
          </div>
        </div>

        {/* Supplier Balances (Consignment) */}
        <div 
          onClick={() => { setActiveTab('stock'); }}
          className="bg-slate-800/80 border border-slate-700/70 hover:border-slate-600 rounded-2xl p-3 shadow-sm flex flex-col justify-between cursor-pointer active:scale-98 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-400">
              {language === 'am' ? 'የአቅራቢ እዳ (ክፍያ)' : language === 'om' ? 'Liqii Dhiyeessitootaa' : 'Supplier Balances'}
            </span>
            <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-black text-purple-300 font-mono leading-none truncate">
              {formatMoney(totalPendingObligations)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              {pendingObligationsList.length} suppliers to settle
            </p>
          </div>
        </div>

      </div>

      {/* 4 Big, Friendly Action Tiles */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
            {language === 'am' ? 'ፈጣን ተግባራት' : language === 'om' ? 'Tarkaanfiiwwan Saffisaa' : 'Quick Actions'}
          </span>
          <span className="text-[11px] text-slate-400">1-Tap Shortcuts</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          
          {/* Action 1: Make a Sale */}
          <button
            onClick={() => setActiveTab('sell')}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold text-left shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex flex-col justify-between min-h-[85px]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-slate-950/20 flex items-center justify-center text-slate-950">
                <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-[10px] uppercase font-black tracking-wider bg-slate-950/10 px-1.5 py-0.5 rounded-md">
                POS
              </span>
            </div>
            <div>
              <h4 className="text-sm font-black leading-tight">
                {language === 'am' ? 'አዲስ ሽያጭ' : language === 'om' ? 'Gurgurtaa Haaraa' : 'Make a Sale'}
              </h4>
              <p className="text-[10px] opacity-80 font-medium">
                Telebirr, Cash, CBE Birr
              </p>
            </div>
          </button>

          {/* Action 2: Receive New Stock */}
          <button
            onClick={() => setIsReceiveModalOpen(true)}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left active:scale-98 transition-all flex flex-col justify-between min-h-[85px] shadow-sm"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                + Inflow
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">
                {language === 'am' ? 'ዕቃ ማስገባት' : language === 'om' ? 'Meeshaa Galchuu' : 'Receive Stock'}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                Bought or Consignment
              </p>
            </div>
          </button>

          {/* Action 3: Pay Supplier */}
          <button
            onClick={() => { setActiveTab('stock'); }}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left active:scale-98 transition-all flex flex-col justify-between min-h-[85px] shadow-sm"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Building2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-[10px] text-purple-300 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded-md border border-purple-500/20">
                Pay Debt
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">
                {language === 'am' ? 'ለአቅራቢ መክፈል' : language === 'om' ? 'Dhiyeessaa Kaffaluu' : 'Pay a Supplier'}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                Settle consignment stock
              </p>
            </div>
          </button>

          {/* Action 4: Record Expense */}
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left active:scale-98 transition-all flex flex-col justify-between min-h-[85px] shadow-sm"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Receipt className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-[10px] text-rose-300 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded-md border border-rose-500/20">
                Shop Outlay
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">
                {language === 'am' ? 'ወጪ መመዝገብ' : language === 'om' ? 'Baasii Galmeessuu' : 'Record Expense'}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">
                Rent, fuel, transport, wage
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* Stock Alerts Notice (If any) */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div 
          onClick={() => setActiveTab('stock')}
          className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between gap-3 cursor-pointer active:scale-98 transition-all shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-amber-300 leading-tight">
                {lowStockProducts.length + outOfStockProducts.length} items need attention
              </h4>
              <p className="text-[11px] text-amber-200/80 truncate mt-0.5">
                {outOfStockProducts.length > 0 
                  ? `${outOfStockProducts.length} completely out of stock` 
                  : `${lowStockProducts.length} low on inventory`}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
        </div>
      )}

      {/* Recent Sales Activity List */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-xs text-white uppercase tracking-wide">
              {t('dash_recent_sales')}
            </h3>
          </div>
          <button
            onClick={() => { setActiveTab('more'); setMoreSubPage('reports'); }}
            className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-0.5"
          >
            <span>All Sales</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {sales.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            <Receipt className="w-8 h-8 mx-auto mb-1.5 text-slate-600" />
            <p>{t('dash_no_sales_today')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {sales.slice(0, 4).map(sale => (
              <div
                key={sale.id}
                onClick={() => setCurrentReceipt(sale)}
                className="py-2.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-750 active:scale-98 transition-all"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white truncate">
                      {sale.invoiceNumber}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                      {sale.paymentMethod}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {sale.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-black text-amber-400 block">
                    {formatMoney(sale.total)}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Helpful Policy Note */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-[11px] text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Shop Credit Policy:</strong> All customer sales are direct payment (Telebirr, Cash, CBE). Supplier balances tracked above are for stock we received to sell.
        </p>
      </div>

      {/* Modals */}
      <ReceiveStockModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />

      <QuickGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
};
