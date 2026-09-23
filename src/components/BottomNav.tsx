import React from 'react';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Layers, 
  Menu
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, moreSubPage, setMoreSubPage, cart, t } = useApp();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'more') {
      setMoreSubPage(null);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16 px-1">
        
        {/* 1. Home */}
        <button
          onClick={() => handleTabClick('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors active:scale-95 ${
            activeTab === 'home' && !moreSubPage
              ? 'text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('nav_home')}</span>
        </button>

        {/* 2. Products */}
        <button
          onClick={() => handleTabClick('products')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors active:scale-95 ${
            activeTab === 'products'
              ? 'text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('nav_products')}</span>
        </button>

        {/* 3. Sell / POS (Prominent Action Center Button) */}
        <button
          onClick={() => handleTabClick('sell')}
          className="relative -top-3 flex flex-col items-center justify-center active:scale-90 transition-transform"
        >
          <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
            activeTab === 'sell'
              ? 'bg-amber-400 text-slate-950 shadow-amber-500/40 ring-4 ring-slate-900 ring-offset-1 ring-offset-amber-500'
              : 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/25'
          }`}>
            <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1 text-amber-400 tracking-tight">
            {t('nav_sell')}
          </span>
        </button>

        {/* 4. Stock & Movements */}
        <button
          onClick={() => handleTabClick('stock')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors active:scale-95 ${
            activeTab === 'stock'
              ? 'text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('nav_stock')}</span>
        </button>

        {/* 5. More */}
        <button
          onClick={() => handleTabClick('more')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors active:scale-95 ${
            activeTab === 'more'
              ? 'text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t('nav_more')}</span>
        </button>

      </div>
    </nav>
  );
};
