export type Language = 'en' | 'am' | 'om';

export type UserRole = 'owner' | 'salesperson';

export type ProductCategory = 
  | 'solar' 
  | 'sound' 
  | 'cables' 
  | 'accessories' 
  | 'other';

export type StockSource = 'owned' | 'supplier' | 'partner';

export type ObligationStatus = 'active' | 'partially_settled' | 'settled' | 'returned';

export type PaymentMethod = 'cash' | 'telebirr' | 'cbe_birr' | 'bank_transfer' | 'other';

export type MovementType = 'received' | 'sold' | 'adjustment' | 'damaged' | 'returned';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  brand: string;
  model: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStockLevel: number;
  imageUrl?: string;
  stockSource: StockSource;
  supplierPartnerId?: string;
  supplierPartnerName?: string;
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: MovementType;
  quantityDelta: number; // e.g. +5 or -2
  previousStock: number;
  newStock: number;
  reason: string;
  referenceId?: string; // sale id or obligation id
  costPerUnit?: number;
  createdBy: string;
  createdAt: string;
}

export interface SupplierPartner {
  id: string;
  name: string;
  company: string;
  phone: string;
  location: string;
  type: 'supplier' | 'distributor' | 'partner' | 'other';
  notes?: string;
  createdAt: string;
}

export interface SettlementRecord {
  id: string;
  obligationId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  notes?: string;
  recordedBy: string;
}

export interface SupplierObligation {
  id: string;
  supplierPartnerId: string;
  supplierName: string;
  productId: string;
  productName: string;
  quantityReceived: number;
  quantityRemaining: number;
  costPerUnit: number;
  totalObligation: number; // quantityReceived * costPerUnit
  amountSettled: number;
  remainingBalance: number;
  status: ObligationStatus;
  dateReceived: string;
  expectedSettlementDate: string;
  notes?: string;
  settlements: SettlementRecord[];
}

export interface SaleItem {
  productId: string;
  productName: string;
  sku: string;
  category: ProductCategory;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  cogs: number;
  costOfGoodsSold?: number;
  grossProfit: number;
  paymentMethod: PaymentMethod;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  cashierName: string;
  isOfflineSyncPending?: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  location: string;
  notes?: string;
  totalSpent: number;
  ordersCount: number;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: 'transport' | 'rent' | 'electricity' | 'salary' | 'repairs' | 'marketing' | 'other';
  amount: number;
  date: string;
  description: string;
  recordedBy: string;
}

export interface BusinessSettings {
  businessName: string;
  logoUrl?: string;
  ownerName: string;
  phone: string;
  address: string;
  city: string;
  tinNumber?: string;
  preferredLanguage: Language;
  currencySymbol: string; // e.g. "ETB" or "ብር"
  receiptFooter: string;
  isSetupCompleted: boolean;
}

export interface AppNotification {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'obligation_due' | 'stock_movement';
  title: string;
  message: string;
  date: string;
  createdAt?: string;
  read: boolean;
  targetTab?: string;
}
