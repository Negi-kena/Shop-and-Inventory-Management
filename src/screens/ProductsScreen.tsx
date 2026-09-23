import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Archive, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  ArrowDownToLine, 
  Tag, 
  Building2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { ProductFormModal } from '../components/ProductFormModal';
import { ReceiveStockModal } from '../components/ReceiveStockModal';

export const ProductsScreen: React.FC = () => {
  const { 
    products, 
    role, 
    formatMoney, 
    archiveProduct, 
    t 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [receiveProdId, setReceiveProdId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: t('common_all') },
    { id: 'solar', label: t('cat_solar') },
    { id: 'sound', label: t('cat_sound') },
    { id: 'cables', label: t('cat_cables') },
    { id: 'accessories', label: t('cat_accessories') },
    { id: 'other', label: t('cat_other') },
  ];

  const filtered = products.filter(p => {
    if (p.archived) return false;
    if (selectedCat !== 'all' && p.category !== selectedCat) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q)
    );
  });

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  return (
    <div className="pb-24 pt-2 px-3.5 max-w-lg mx-auto space-y-3.5 animate-in fade-in">
      
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-base text-white">{t('prod_title')}</h2>
          <p className="text-[11px] text-slate-400">
            {filtered.length} products listed
          </p>
        </div>

        {role === 'owner' && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 active:scale-95 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('prod_add_new')}</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder={t('pos_search_placeholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700/80 rounded-2xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-inner"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs font-bold"
          >
            &times;
          </button>
        )}
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              selectedCat === c.id
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
            <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>{t('prod_no_products')}</p>
          </div>
        ) : (
          filtered.map(product => {
            const margin = product.sellingPrice - product.costPrice;
            const marginPct = product.costPrice > 0 ? ((margin / product.costPrice) * 100).toFixed(0) : '0';
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= product.minStockLevel;

            return (
              <div
                key={product.id}
                className="bg-slate-800/90 border border-slate-700/70 rounded-2xl p-3.5 space-y-2.5 shadow-sm"
              >
                {/* Top Row: Brand & Status & Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                        {product.brand || 'ELECTRONICS'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({product.sku})
                      </span>
                      {product.stockSource !== 'owned' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-purple-950 text-purple-300 border border-purple-800">
                          {product.stockSource === 'partner' ? 'Partner Borrowed' : 'Supplier Consignment'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-white leading-snug mt-0.5">
                      {product.name}
                    </h3>
                  </div>

                  {/* Stock Status Badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isOutOfStock
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : isLowStock
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {isOutOfStock ? t('prod_status_out') : isLowStock ? t('prod_status_low') : t('prod_status_in')}
                  </span>
                </div>

                {/* Description snippet if any */}
                {product.description && (
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {product.description}
                  </p>
                )}

                {/* Pricing & Stock Grid */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/50 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t('pos_unit_price')}</span>
                    <span className="font-black text-amber-400 font-mono text-xs">
                      {formatMoney(product.sellingPrice)}
                    </span>
                  </div>

                  {role === 'owner' ? (
                    <div>
                      <span className="text-[10px] text-slate-400 block">{t('pos_cost_price')}</span>
                      <span className="font-bold text-slate-300 font-mono text-xs">
                        {formatMoney(product.costPrice)}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] text-slate-400 block">Min Stock</span>
                      <span className="font-bold text-slate-300 font-mono text-xs">
                        {product.minStockLevel} units
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] text-slate-400 block">Available</span>
                    <span className={`font-black font-mono text-xs ${
                      isOutOfStock ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {product.stock} units
                    </span>
                  </div>
                </div>

                {/* Margin info for owner */}
                {role === 'owner' && (
                  <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span>{t('prod_margin')}:</span>
                      <strong className="text-emerald-400 font-mono">+{formatMoney(margin)} ({marginPct}%)</strong>
                    </span>

                    {product.supplierPartnerName && (
                      <span className="text-[10px] text-purple-300 truncate max-w-[140px]">
                        From: {product.supplierPartnerName}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-700/50">
                  <button
                    onClick={() => setReceiveProdId(product.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800 text-[11px] font-semibold active:scale-95"
                  >
                    <ArrowDownToLine className="w-3 h-3" />
                    <span>+ Receive Stock</span>
                  </button>

                  {role === 'owner' && (
                    <>
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold active:scale-95"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{t('common_edit')}</span>
                      </button>

                      <button
                        onClick={() => archiveProduct(product.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-700"
                        title="Archive product"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        productToEdit={editingProduct}
      />

      <ReceiveStockModal
        isOpen={!!receiveProdId}
        onClose={() => setReceiveProdId(null)}
        preselectedProductId={receiveProdId || undefined}
      />

    </div>
  );
};
