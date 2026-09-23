import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Check, 
  AlertCircle, 
  Tag, 
  ArrowRight,
  Sun,
  Volume2,
  Cable,
  Headphones,
  Cpu,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCategory, Product } from '../types';
import { CartDrawer } from '../components/CartDrawer';

export const PosScreen: React.FC = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    updateCartQty, 
    formatMoney, 
    language,
    t 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter products: active, not archived, matching category & search
  const filteredProducts = products.filter(p => {
    if (p.archived) return false;

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.model.toLowerCase().includes(query)
    );
  });

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.total, 0);

  const getCategoryDetails = (category: string) => {
    switch (category) {
      case 'solar':
        return {
          icon: <Sun className="w-5 h-5 text-amber-400" />,
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          label: language === 'am' ? 'ሶላር' : language === 'om' ? 'Soolaarii' : 'Solar',
        };
      case 'sound':
        return {
          icon: <Volume2 className="w-5 h-5 text-purple-400" />,
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
          label: language === 'am' ? 'ድምፅና ሙዚቃ' : language === 'om' ? 'Sagalee' : 'Sound & Audio',
        };
      case 'cables':
        return {
          icon: <Cable className="w-5 h-5 text-sky-400" />,
          bg: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
          label: language === 'am' ? 'ገመዶች' : language === 'om' ? 'Keebiloota' : 'Cables',
        };
      case 'accessories':
        return {
          icon: <Headphones className="w-5 h-5 text-emerald-400" />,
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          label: language === 'am' ? 'መለዋወጫ' : language === 'om' ? 'Meeshaalee' : 'Accessories',
        };
      default:
        return {
          icon: <Cpu className="w-5 h-5 text-indigo-400" />,
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
          label: language === 'am' ? 'ሌሎች' : language === 'om' ? 'Kan Biraa' : 'Other',
        };
    }
  };

  const categories = [
    { id: 'all', label: t('common_all') },
    { id: 'solar', label: t('cat_solar') },
    { id: 'sound', label: t('cat_sound') },
    { id: 'cables', label: t('cat_cables') },
    { id: 'accessories', label: t('cat_accessories') },
    { id: 'other', label: t('cat_other') },
  ];

  return (
    <div className="pb-32 pt-2 px-3.5 max-w-lg mx-auto space-y-3 animate-in fade-in">
      
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder={t('pos_search_placeholder')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800/95 border border-slate-700/80 rounded-2xl pl-10 pr-9 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3 text-slate-400 hover:text-white text-xs font-bold p-0.5 rounded-full"
          >
            &times;
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
              selectedCategory === cat.id
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 border border-slate-700/70 hover:border-slate-600'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="space-y-2.5">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs bg-slate-800/40 rounded-3xl border border-slate-700/40 p-6 space-y-2">
            <Tag className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-300">{t('prod_no_products')}</p>
            <p className="text-[11px] text-slate-400">Try changing your category filter or search query.</p>
          </div>
        ) : (
          filteredProducts.map(product => {
            const inCart = cart.find(item => item.productId === product.id);
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= product.minStockLevel;
            const catDetails = getCategoryDetails(product.category);

            return (
              <div
                key={product.id}
                className={`bg-slate-800/95 border rounded-3xl p-3.5 flex items-center justify-between gap-3 shadow-sm transition-all ${
                  inCart 
                    ? 'border-amber-500 ring-1 ring-amber-500/50 bg-slate-800' 
                    : isOutOfStock
                    ? 'border-red-950/60 opacity-60 bg-slate-900/60'
                    : 'border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {/* Category Icon Avatar */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${catDetails.bg}`}>
                  {catDetails.icon}
                </div>

                {/* Product Info */}
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => !isOutOfStock && addToCart(product)}
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {product.brand || product.sku}
                    </span>
                    {product.stockSource !== 'owned' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-purple-950/90 text-purple-300 border border-purple-800">
                        {product.stockSource === 'partner' ? 'Partner Stock' : 'Supplier Consignment'}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-white truncate mt-0.5 leading-snug">
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                    <span className="text-sm font-black text-amber-400 font-mono">
                      {formatMoney(product.sellingPrice)}
                    </span>
                    
                    {/* Stock status badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isOutOfStock
                        ? 'bg-red-950/80 text-red-300 border-red-800'
                        : isLowStock
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    }`}>
                      {isOutOfStock ? t('pos_out_of_stock') : `${product.stock} in shop`}
                    </span>
                  </div>
                </div>

                {/* Add / Stepper Button */}
                <div className="shrink-0 flex items-center">
                  {inCart ? (
                    <div className="flex items-center bg-slate-900 border border-amber-500 rounded-2xl overflow-hidden shadow-inner">
                      <button
                        onClick={() => updateCartQty(product.id, inCart.quantity - 1)}
                        className="p-2.5 hover:bg-slate-800 text-slate-200 active:scale-90"
                        title="Reduce"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-black text-xs text-amber-300 font-mono">
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(product.id, inCart.quantity + 1)}
                        disabled={inCart.quantity >= product.stock}
                        className="p-2.5 hover:bg-slate-800 text-slate-200 active:scale-90 disabled:opacity-30"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      disabled={isOutOfStock}
                      className={`py-2 px-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                        isOutOfStock
                          ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{language === 'am' ? 'ጨምር' : language === 'om' ? 'Ida\'i' : 'Add'}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 inset-x-0 z-30 px-3.5 max-w-lg mx-auto pointer-events-none">
          <div className="pointer-events-auto bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-500/80 rounded-3xl p-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4">
            
            <div 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 cursor-pointer pl-1"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/30">
                  <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[11px] font-black flex items-center justify-center ring-2 ring-slate-900">
                  {cartTotalItems}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide block">
                  {cartTotalItems} {cartTotalItems === 1 ? 'item' : 'items'} in cart
                </span>
                <span className="font-mono text-base font-black text-amber-400 leading-none">
                  {formatMoney(cartSubtotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>{language === 'am' ? 'ክፈል (Checkout)' : language === 'om' ? 'Kaffali' : 'Pay & Receipt'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

    </div>
  );
};
