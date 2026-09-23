import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  Sun, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Sale } from '../types';

interface ReceiptModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  const { settings, formatMoney, t, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!sale) return null;

  const dateFormatted = new Date(sale.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Cash (ጥሬ ገንዘብ)';
      case 'telebirr': return 'Telebirr (ቴሌብር)';
      case 'cbe_birr': return 'CBE Birr (ሲቢኢ)';
      case 'bank_transfer': return 'Bank Transfer (ዝውውር)';
      default: return 'Other (ሌላ)';
    }
  };

  const generateReceiptText = () => {
    let text = `=============================\n`;
    text += `${settings.businessName.toUpperCase()}\n`;
    text += `${settings.address}, ${settings.city}\n`;
    text += `Tel: ${settings.phone}\n`;
    if (settings.tinNumber) text += `TIN: ${settings.tinNumber}\n`;
    text += `=============================\n`;
    text += `Invoice: ${sale.invoiceNumber}\n`;
    text += `Date: ${dateFormatted}\n`;
    text += `Cashier: ${sale.cashierName}\n`;
    if (sale.customerName) {
      text += `Customer: ${sale.customerName} (${sale.customerPhone || ''})\n`;
    }
    text += `-----------------------------\n`;
    text += `ITEMS:\n`;
    sale.items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.productName}\n`;
      text += `   ${item.quantity} x ${formatMoney(item.unitPrice)} = ${formatMoney(item.total)}\n`;
    });
    text += `-----------------------------\n`;
    text += `Subtotal: ${formatMoney(sale.subtotal)}\n`;
    if (sale.discount > 0) {
      text += `Discount: -${formatMoney(sale.discount)}\n`;
    }
    text += `TOTAL PAID: ${formatMoney(sale.total)}\n`;
    text += `Method: ${getPaymentMethodLabel(sale.paymentMethod)}\n`;
    text += `=============================\n`;
    text += `${settings.receiptFooter || 'Thank you for your business!'}\n`;
    return text;
  };

  const handleCopyText = async () => {
    const text = generateReceiptText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast(t('receipt_copied'));
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  const handleShare = async () => {
    const text = generateReceiptText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt ${sale.invoiceNumber} - ${settings.businessName}`,
          text,
        });
      } catch {
        // user cancelled or share unsupported
      }
    } else {
      handleCopyText();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-sm text-slate-100">{t('receipt_title')}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Card */}
        <div className="p-4 overflow-y-auto flex-1 text-slate-900">
          <div 
            ref={receiptRef}
            className="bg-amber-50/95 rounded-xl p-4 shadow-inner border border-amber-200/60 font-mono text-xs leading-relaxed"
          >
            {/* Business Logo/Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-400">
              <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-amber-500/20 text-amber-800 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-sm text-slate-950 uppercase tracking-tight">
                {settings.businessName}
              </h2>
              <p className="text-[11px] text-slate-600 font-sans mt-0.5">{settings.address}</p>
              <p className="text-[11px] text-slate-600 font-sans">{settings.city}, Ethiopia</p>
              <p className="text-[11px] font-sans font-semibold text-slate-700 mt-0.5">Tel: {settings.phone}</p>
              {settings.tinNumber && (
                <p className="text-[10px] text-slate-500 font-sans">TIN: {settings.tinNumber}</p>
              )}
            </div>

            {/* Metadata */}
            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px] text-slate-700">
              <div className="flex justify-between">
                <span>{t('receipt_invoice_no')}:</span>
                <span className="font-bold text-slate-950">{sale.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('receipt_date')}:</span>
                <span>{dateFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('receipt_cashier')}:</span>
                <span>{sale.cashierName}</span>
              </div>
              {sale.customerName && (
                <div className="flex justify-between font-sans">
                  <span>{t('receipt_customer')}:</span>
                  <span className="font-semibold text-slate-900">{sale.customerName}</span>
                </div>
              )}
              {sale.isOfflineSyncPending && (
                <div className="mt-1 text-center py-0.5 bg-amber-200/80 text-amber-900 rounded text-[10px] font-bold">
                  [Saved Offline - Pending Cloud Sync]
                </div>
              )}
            </div>

            {/* Itemized List */}
            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-2">
              <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase">
                <span className="col-span-6">{t('receipt_item')}</span>
                <span className="col-span-2 text-center">{t('pos_qty')}</span>
                <span className="col-span-4 text-right">{t('receipt_total')}</span>
              </div>
              {sale.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 items-start text-[11px] pt-1 border-t border-slate-200">
                  <div className="col-span-6 pr-1 font-sans">
                    <p className="font-semibold text-slate-900 leading-tight">{item.productName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">@{formatMoney(item.unitPrice)}</p>
                  </div>
                  <div className="col-span-2 text-center font-bold text-slate-800">
                    {item.quantity}
                  </div>
                  <div className="col-span-4 text-right font-bold text-slate-950">
                    {formatMoney(item.total)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>{t('receipt_subtotal')}:</span>
                <span>{formatMoney(sale.subtotal)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>{t('receipt_discount')}:</span>
                  <span>-{formatMoney(sale.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-950 pt-1 border-t border-slate-300">
                <span>{t('receipt_grand_total')}:</span>
                <span>{formatMoney(sale.total)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-700 pt-1">
                <span>{t('receipt_payment_method')}:</span>
                <span className="font-bold text-slate-900">{getPaymentMethodLabel(sale.paymentMethod)}</span>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="pt-3 text-center text-[10px] text-slate-600 font-sans leading-relaxed">
              <p className="italic">{settings.receiptFooter}</p>
              <p className="mt-1 font-bold text-slate-700">*** THANK YOU - አመሰግናለሁ ***</p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('receipt_share')}</span>
            </button>
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('receipt_print')}</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            {t('receipt_close')}
          </button>
        </div>

      </div>
    </div>
  );
};
