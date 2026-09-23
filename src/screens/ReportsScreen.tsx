import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote,
  Package,
  Calendar,
  PieChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsScreen: React.FC = () => {
  const { 
    sales, 
    expenses, 
    products, 
    supplierObligations, 
    setMoreSubPage, 
    formatMoney, 
    t 
  } = useApp();

  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'all'>('month');

  // Filter sales & expenses based on timeframe
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const filteredSales = sales.filter(s => {
    if (timeframe === 'all') return true;
    if (timeframe === 'today') return s.createdAt.startsWith(todayStr);

    const saleDate = new Date(s.createdAt);
    const diffDays = (now.getTime() - saleDate.getTime()) / (1000 * 3600 * 24);

    if (timeframe === 'week') return diffDays <= 7;
    if (timeframe === 'month') return diffDays <= 30;
    return true;
  });

  const filteredExpenses = expenses.filter(e => {
    if (timeframe === 'all') return true;
    if (timeframe === 'today') return e.date.startsWith(todayStr);

    const expDate = new Date(e.date);
    const diffDays = (now.getTime() - expDate.getTime()) / (1000 * 3600 * 24);

    if (timeframe === 'week') return diffDays <= 7;
    if (timeframe === 'month') return diffDays <= 30;
    return true;
  });

  // Accurate Financial Metrics
  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const totalCOGS = filteredSales.reduce((sum, s) => sum + (s.cogs ?? s.costOfGoodsSold ?? 0), 0);
  const totalGrossProfit = filteredSales.reduce((sum, s) => sum + s.grossProfit, 0);
  const totalOperatingExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalGrossProfit - totalOperatingExpenses;

  const grossMarginPct = totalRevenue > 0 ? ((totalGrossProfit / totalRevenue) * 100).toFixed(1) : '0';
  const netMarginPct = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  // Payment Breakdown
  const paymentBreakdown = {
    telebirr: filteredSales.filter(s => s.paymentMethod === 'telebirr').reduce((s, i) => s + i.total, 0),
    cash: filteredSales.filter(s => s.paymentMethod === 'cash').reduce((s, i) => s + i.total, 0),
    cbe_birr: filteredSales.filter(s => s.paymentMethod === 'cbe_birr').reduce((s, i) => s + i.total, 0),
    bank_transfer: filteredSales.filter(s => s.paymentMethod === 'bank_transfer').reduce((s, i) => s + i.total, 0),
  };

  // Best Selling Products Aggregation
  const productSalesMap: { [id: string]: { name: string; qty: number; revenue: number } } = {};
  filteredSales.forEach(s => {
    s.items.forEach(item => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.productName, qty: 0, revenue: 0 };
      }
      productSalesMap[item.productId].qty += item.quantity;
      productSalesMap[item.productId].revenue += item.total;
    });
  });

  const bestSelling = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="pb-24 pt-2 px-3.5 max-w-lg mx-auto space-y-3.5 animate-in fade-in">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMoreSubPage(null)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to More</span>
        </button>

        <span className="text-xs font-bold text-amber-400">
          Financial & Performance
        </span>
      </div>

      <div>
        <h2 className="font-bold text-base text-white">{t('rep_title')}</h2>
        <p className="text-[11px] text-slate-400">
          Accurate revenue, COGS, gross margin, and net profit
        </p>
      </div>

      {/* Timeframe Selector Chips */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-800 rounded-2xl border border-slate-700/80">
        {[
          { id: 'today', label: 'Today' },
          { id: 'week', label: '7 Days' },
          { id: 'month', label: '30 Days' },
          { id: 'all', label: 'All Time' },
        ].map(tf => (
          <button
            key={tf.id}
            onClick={() => setTimeframe(tf.id as any)}
            className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
              timeframe === tf.id
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Primary Financial P&L Card */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-md">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
          <span>Profit & Loss Statement</span>
          <span className="text-amber-400 font-mono text-[11px]">{filteredSales.length} sales</span>
        </h3>

        <div className="space-y-2 text-xs divide-y divide-slate-700/50">
          {/* Revenue */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-300">{t('rep_revenue')} (Gross Sales)</span>
            <span className="font-bold font-mono text-white text-sm">
              {formatMoney(totalRevenue)}
            </span>
          </div>

          {/* COGS */}
          <div className="flex justify-between items-center pt-2 text-slate-400">
            <span>Cost of Goods Sold (COGS)</span>
            <span className="font-mono text-slate-300">
              -{formatMoney(totalCOGS)}
            </span>
          </div>

          {/* Gross Profit */}
          <div className="flex justify-between items-center pt-2">
            <div>
              <span className="font-bold text-amber-300">{t('rep_gross_profit')}</span>
              <span className="text-[10px] text-slate-400 block">Gross Margin: {grossMarginPct}%</span>
            </div>
            <span className="font-black font-mono text-amber-400 text-sm">
              {formatMoney(totalGrossProfit)}
            </span>
          </div>

          {/* Expenses */}
          <div className="flex justify-between items-center pt-2 text-red-400">
            <span>{t('rep_expenses')} (Operating)</span>
            <span className="font-mono">
              -{formatMoney(totalOperatingExpenses)}
            </span>
          </div>

          {/* Net Profit */}
          <div className="flex justify-between items-center pt-2.5">
            <div>
              <span className="font-black text-white text-sm">{t('rep_net_profit')}</span>
              <span className="text-[10px] text-slate-400 block">Net Margin: {netMarginPct}%</span>
            </div>
            <span className={`font-black font-mono text-base ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatMoney(netProfit)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Channel Distribution */}
      <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 space-y-3 shadow-sm">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-emerald-400" />
          <span>Payment Channel Breakdown</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Telebirr</span>
            </div>
            <p className="font-black text-white font-mono mt-1 text-xs">{formatMoney(paymentBreakdown.telebirr)}</p>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Banknote className="w-3.5 h-3.5 text-amber-400" />
              <span>Cash</span>
            </div>
            <p className="font-black text-white font-mono mt-1 text-xs">{formatMoney(paymentBreakdown.cash)}</p>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>CBE Birr</span>
            </div>
            <p className="font-black text-white font-mono mt-1 text-xs">{formatMoney(paymentBreakdown.cbe_birr)}</p>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <CreditCard className="w-3.5 h-3.5 text-sky-400" />
              <span>Bank Transfer</span>
            </div>
            <p className="font-black text-white font-mono mt-1 text-xs">{formatMoney(paymentBreakdown.bank_transfer)}</p>
          </div>
        </div>
      </div>

      {/* Top Performing Products */}
      <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 space-y-3 shadow-sm">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>{t('rep_best_selling')}</span>
        </h3>

        <div className="space-y-2">
          {bestSelling.slice(0, 5).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1.5 border-b border-slate-700/40 last:border-none"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-slate-900 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate text-xs">{item.name}</p>
                  <p className="text-[10px] text-slate-400">{item.qty} units sold</p>
                </div>
              </div>

              <span className="font-mono font-bold text-amber-400 shrink-0 text-xs">
                {formatMoney(item.revenue)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
