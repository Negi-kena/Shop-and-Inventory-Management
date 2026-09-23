import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Save, 
  TrendingUp, 
  Building2, 
  Tag, 
  Layers 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory, StockSource } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { 
    addProduct, 
    updateProduct, 
    supplierPartners, 
    formatMoney, 
    t 
  } = useApp();

  const [name, setName] = useState<string>(productToEdit?.name || '');
  const [sku, setSku] = useState<string>(productToEdit?.sku || '');
  const [category, setCategory] = useState<ProductCategory>(productToEdit?.category || 'solar');
  const [brand, setBrand] = useState<string>(productToEdit?.brand || '');
  const [model, setModel] = useState<string>(productToEdit?.model || '');
  const [description, setDescription] = useState<string>(productToEdit?.description || '');
  const [costPrice, setCostPrice] = useState<number>(productToEdit?.costPrice || 0);
  const [sellingPrice, setSellingPrice] = useState<number>(productToEdit?.sellingPrice || 0);
  const [stock, setStock] = useState<number>(productToEdit?.stock || 0);
  const [minStockLevel, setMinStockLevel] = useState<number>(productToEdit?.minStockLevel || 3);
  const [stockSource, setStockSource] = useState<StockSource>(productToEdit?.stockSource || 'owned');
  const [supplierPartnerId, setSupplierPartnerId] = useState<string>(
    productToEdit?.supplierPartnerId || (supplierPartners[0]?.id || '')
  );

  if (!isOpen) return null;

  const margin = sellingPrice - costPrice;
  const marginPercent = costPrice > 0 ? ((margin / costPrice) * 100).toFixed(1) : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const supplier = supplierPartners.find(s => s.id === supplierPartnerId);

    const productPayload = {
      name: name.trim(),
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      category,
      brand: brand.trim(),
      model: model.trim(),
      description: description.trim(),
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      stock: Number(stock) || 0,
      minStockLevel: Number(minStockLevel) || 1,
      stockSource,
      supplierPartnerId: stockSource !== 'owned' ? supplierPartnerId : undefined,
      supplierPartnerName: stockSource !== 'owned' ? supplier?.company : undefined,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-slate-100">
              {productToEdit ? t('prod_edit') : t('prod_add_new')}
            </h2>
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
          
          {/* Name & SKU */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">
              {t('prod_name')} <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 100W Solar Panel or 15-inch PA Speaker"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 block">{t('prod_sku')}</label>
              <input
                type="text"
                placeholder="Auto-generated if empty"
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 block">{t('prod_category')}</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="solar">{t('cat_solar')}</option>
                <option value="sound">{t('cat_sound')}</option>
                <option value="cables">{t('cat_cables')}</option>
                <option value="accessories">{t('cat_accessories')}</option>
                <option value="other">{t('cat_other')}</option>
              </select>
            </div>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 block">{t('prod_brand')}</label>
              <input
                type="text"
                placeholder="e.g. Felicity / Yamaha / Baseus"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 block">{t('prod_model')}</label>
              <input
                type="text"
                placeholder="e.g. 100M / MG08X"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Cost Price & Selling Price */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 block">{t('prod_cost_price')}</label>
              <input
                type="number"
                min="0"
                value={costPrice || ''}
                onChange={e => setCostPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 block">{t('prod_selling_price')}</label>
              <input
                type="number"
                min="0"
                value={sellingPrice || ''}
                onChange={e => setSellingPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Unit Margin Indicator */}
          <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('prod_margin')}:</span>
            </span>
            <div className="text-right">
              <span className={`font-bold font-mono ${margin >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatMoney(margin)}
              </span>
              <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({marginPercent}%)</span>
            </div>
          </div>

          {/* Current Stock & Min Stock Level */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 block">{t('prod_quantity')}</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={e => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 block">{t('prod_min_stock')}</label>
              <input
                type="number"
                min="0"
                value={minStockLevel}
                onChange={e => setMinStockLevel(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Stock Source / Ownership */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">{t('prod_stock_source')}</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setStockSource('owned')}
                className={`p-2 rounded-xl border text-[11px] font-semibold text-center ${
                  stockSource === 'owned'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {t('prod_source_owned')}
              </button>
              <button
                type="button"
                onClick={() => setStockSource('supplier')}
                className={`p-2 rounded-xl border text-[11px] font-semibold text-center ${
                  stockSource === 'supplier'
                    ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {t('prod_source_supplier')}
              </button>
              <button
                type="button"
                onClick={() => setStockSource('partner')}
                className={`p-2 rounded-xl border text-[11px] font-semibold text-center ${
                  stockSource === 'partner'
                    ? 'bg-sky-950/80 border-sky-500 text-sky-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {t('prod_source_partner')}
              </button>
            </div>
          </div>

          {/* Supplier Partner Picker if not owned */}
          {stockSource !== 'owned' && (
            <div className="space-y-1 animate-in fade-in">
              <label className="font-semibold text-slate-300 block">{t('stock_supplier_partner')}</label>
              <select
                value={supplierPartnerId}
                onChange={e => setSupplierPartnerId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {supplierPartners.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.company} ({s.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">{t('prod_description')}</label>
            <textarea
              rows={2}
              placeholder="e.g. 12V 100Ah Deep Cycle gel battery for solar systems..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 active:scale-98 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{productToEdit ? t('prod_update') : t('prod_save')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
