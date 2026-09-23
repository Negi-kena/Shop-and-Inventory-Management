import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  User, 
  Smartphone, 
  Banknote, 
  CreditCard, 
  Building2, 
  ShieldAlert,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQty, 
    clearCart, 
    cartDiscount, 
    setCartDiscount, 
    selectedCustomer, 
    setSelectedCustomer, 
    customers, 
    addCustomer,
    completeSale, 
    formatMoney, 
    t,
    role
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('telebirr');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [supervisorOverride, setSupervisorOverride] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const total = Math.max(0, subtotal - cartDiscount);

  const handleCheckout = () => {
    const sale = completeSale(paymentMethod, supervisorOverride);
    if (sale) {
      onClose();
    }
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim() || '+251 9...',
      location: 'Addis Ababa',
    });
    // Find newly added customer or set temporary
    setSelectedCustomer({
      id: `cust-${Date.now()}`,
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      location: 'Addis Ababa',
      totalSpent: 0,
      ordersCount: 0,
      createdAt: new Date().toISOString(),
    });
    setNewCustName('');
    setNewCustPhone('');
    setShowAddCustomer(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Background touch dismiss */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-up Sheet */}
      <div className="bg-slate-900 border-t border-slate-700/80 rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl max-w-lg mx-auto w-full animate-in slide-in-from-bottom-6 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-slate-100">{t('pos_cart')}</h2>
            <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)} {t('pos_items')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/50 border border-red-900/60"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          
          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <p>{t('pos_cart_empty')}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {cart.map(item => (
                <div 
                  key={item.productId}
                  className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs text-white truncate">{item.productName}</p>
                    <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                      {formatMoney(item.unitPrice)}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-800 text-slate-300 active:scale-95 transition-transform"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-slate-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                        className="p-1.5 hover:bg-slate-800 text-slate-300 active:scale-95 transition-transform"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Customer Selection */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('pos_customer_optional')}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAddCustomer(!showAddCustomer)}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" />
                <span>{showAddCustomer ? 'Cancel' : '+ New Customer'}</span>
              </button>
            </div>

            {showAddCustomer ? (
              <form onSubmit={handleCreateCustomer} className="space-y-2 pt-1 border-t border-slate-700/50">
                <input
                  type="text"
                  placeholder={t('pos_cust_name')}
                  value={newCustName}
                  onChange={e => setNewCustName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
                <input
                  type="text"
                  placeholder={t('pos_cust_phone')}
                  value={newCustPhone}
                  onChange={e => setNewCustPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg active:scale-98"
                >
                  Save Customer & Attach
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={selectedCustomer?.id || ''}
                  onChange={e => {
                    const found = customers.find(c => c.id === e.target.value);
                    setSelectedCustomer(found || null);
                  }}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="">{t('pos_walk_in')}</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
                {selectedCustomer && (
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-700 rounded-lg"
                    title="Clear customer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              {t('pos_payment_method')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              
              {/* Telebirr */}
              <button
                type="button"
                onClick={() => setPaymentMethod('telebirr')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                  paymentMethod === 'telebirr'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <p className="leading-tight">Telebirr</p>
                  <p className="text-[10px] text-slate-400 font-normal">ቴሌብር</p>
                </div>
              </button>

              {/* Cash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                  paymentMethod === 'cash'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <Banknote className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-left">
                  <p className="leading-tight">Cash</p>
                  <p className="text-[10px] text-slate-400 font-normal">ጥሬ ገንዘብ</p>
                </div>
              </button>

              {/* CBE Birr */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cbe_birr')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                  paymentMethod === 'cbe_birr'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                <div className="text-left">
                  <p className="leading-tight">CBE Birr</p>
                  <p className="text-[10px] text-slate-400 font-normal">ሲቢኢ ብር</p>
                </div>
              </button>

              {/* Bank Transfer / Other */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <CreditCard className="w-4 h-4 text-sky-400 shrink-0" />
                <div className="text-left">
                  <p className="leading-tight">Bank Transfer</p>
                  <p className="text-[10px] text-slate-400 font-normal">የባንክ ዝውውር</p>
                </div>
              </button>

            </div>
          </div>

          {/* Discount input */}
          <div className="flex items-center justify-between gap-3 bg-slate-800/50 border border-slate-700/60 rounded-xl p-2.5">
            <label className="text-xs text-slate-300 font-medium">
              {t('pos_discount')}:
            </label>
            <div className="flex items-center gap-1.5 w-32">
              <input
                type="number"
                min="0"
                max={subtotal}
                value={cartDiscount || ''}
                onChange={e => setCartDiscount(Math.max(0, Number(e.target.value) || 0))}
                placeholder="0"
                className="w-full text-right bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
              <span className="text-xs text-slate-400">ETB</span>
            </div>
          </div>

          {/* Supervisor override check if role === 'owner' */}
          {role === 'owner' && (
            <label className="flex items-center gap-2 p-2 bg-slate-950/60 rounded-lg border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={supervisorOverride}
                onChange={e => setSupervisorOverride(e.target.checked)}
                className="rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700 w-4 h-4"
              />
              <span className="text-[11px] text-slate-300 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('pos_supervisor_override')}</span>
              </span>
            </label>
          )}

        </div>

        {/* Footer & Checkout button */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-3 pb-safe">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>{t('pos_subtotal')}</span>
              <span className="font-mono">{formatMoney(subtotal)}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-red-400">
                <span>{t('receipt_discount')}</span>
                <span className="font-mono">-{formatMoney(cartDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-white pt-1 border-t border-slate-800">
              <span>{t('pos_total_payable')}</span>
              <span className="text-amber-400 font-mono">{formatMoney(total)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
              cart.length === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-amber-500/25 hover:from-amber-400 hover:to-yellow-400'
            }`}
          >
            <span>{t('pos_complete_sale')}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
