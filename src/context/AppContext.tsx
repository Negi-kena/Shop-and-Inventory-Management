import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Language, 
  UserRole, 
  Product, 
  SupplierPartner, 
  SupplierObligation, 
  Sale, 
  SaleItem, 
  Customer, 
  Expense, 
  InventoryMovement, 
  BusinessSettings, 
  AppNotification, 
  StockSource, 
  PaymentMethod,
  MovementType
} from '../types';
import { 
  initialSettings, 
  initialProducts, 
  initialSuppliers, 
  initialObligations, 
  initialCustomers, 
  initialSales, 
  initialExpenses, 
  initialMovements, 
  initialNotifications 
} from '../data/mockData';
import { translations, TranslationKey } from '../locales/translations';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
  toggleOnline: () => void;
  offlineQueueCount: number;
  syncOfflineQueue: () => void;
  
  settings: BusinessSettings;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  archiveProduct: (id: string) => void;
  
  supplierPartners: SupplierPartner[];
  addSupplierPartner: (supplier: Omit<SupplierPartner, 'id' | 'createdAt'>) => void;
  
  supplierObligations: SupplierObligation[];
  receiveStock: (
    productId: string, 
    quantity: number, 
    costPrice: number, 
    stockSource: StockSource, 
    supplierPartnerId?: string, 
    settlementNotes?: string,
    expectedDueDate?: string
  ) => void;
  adjustStock: (productId: string, newStock: number, reason: string, type?: MovementType) => void;
  settleObligation: (obligationId: string, amount: number, paymentMethod: PaymentMethod, notes?: string) => void;
  returnObligationStock: (obligationId: string, quantity: number, reason: string) => void;
  
  inventoryMovements: InventoryMovement[];
  
  cart: SaleItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => boolean;
  clearCart: () => void;
  cartDiscount: number;
  setCartDiscount: (discount: number) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  completeSale: (paymentMethod: PaymentMethod, overrideStock?: boolean) => Sale | null;
  
  sales: Sale[];
  currentReceipt: Sale | null;
  setCurrentReceipt: (sale: Sale | null) => void;
  
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'totalSpent' | 'ordersCount' | 'createdAt'>) => void;
  
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  
  notifications: AppNotification[];
  markNotificationRead: (id?: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  activeTab: string;
  setActiveTab: (tab: string) => void;
  moreSubPage: string | null;
  setMoreSubPage: (subPage: string | null) => void;
  
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  formatMoney: (amount: number) => string;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'addis_retail_settings',
  PRODUCTS: 'addis_retail_products',
  SUPPLIERS: 'addis_retail_suppliers',
  OBLIGATIONS: 'addis_retail_obligations',
  CUSTOMERS: 'addis_retail_customers',
  SALES: 'addis_retail_sales',
  EXPENSES: 'addis_retail_expenses',
  MOVEMENTS: 'addis_retail_movements',
  NOTIFICATIONS: 'addis_retail_notifications',
  ROLE: 'addis_retail_role',
  LANG: 'addis_retail_lang',
  OFFLINE_QUEUE: 'addis_retail_offline_queue',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Localization & Role
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved as Language) || 'en';
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'owner';
  });

  // Connectivity
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueue, setOfflineQueue] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Business Data
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [supplierPartners, setSupplierPartners] = useState<SupplierPartner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      return saved ? JSON.parse(saved) : initialSuppliers;
    } catch {
      return initialSuppliers;
    }
  });

  const [supplierObligations, setSupplierObligations] = useState<SupplierObligation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OBLIGATIONS);
      return saved ? JSON.parse(saved) : initialObligations;
    } catch {
      return initialObligations;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return saved ? JSON.parse(saved) : initialCustomers;
    } catch {
      return initialCustomers;
    }
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALES);
      return saved ? JSON.parse(saved) : initialSales;
    } catch {
      return initialSales;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : initialExpenses;
    } catch {
      return initialExpenses;
    }
  });

  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      return saved ? JSON.parse(saved) : initialMovements;
    } catch {
      return initialMovements;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [moreSubPage, setMoreSubPage] = useState<string | null>(null);

  // POS State
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [cartDiscount, setCartDiscount] = useState<number>(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [currentReceipt, setCurrentReceipt] = useState<Sale | null>(null);

  // Toast
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Persist State
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(supplierPartners));
  }, [supplierPartners]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OBLIGATIONS, JSON.stringify(supplierObligations));
  }, [supplierObligations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(inventoryMovements));
  }, [inventoryMovements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Network listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(curr => (curr?.id === id ? null : curr));
    }, 3200);
  };

  const t = (key: TranslationKey, fallback?: string): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || fallback || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setSettings(prev => ({ ...prev, preferredLanguage: lang }));
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    showToast(
      newRole === 'owner' 
        ? 'Switched to Owner Mode (Full Access)' 
        : 'Switched to Salesperson Mode (Restricted Financials)',
      'info'
    );
  };

  const toggleOnline = () => {
    setIsOnline(prev => {
      const next = !prev;
      showToast(next ? 'Connected: Online Mode' : 'Disconnected: Offline Mode Active', next ? 'success' : 'info');
      return next;
    });
  };

  const formatMoney = (amount: number): string => {
    const symbol = settings.currencySymbol || 'ETB';
    const formatted = Math.round(amount).toLocaleString('en-US');
    return language === 'am' ? `${formatted} ብር` : `${symbol} ${formatted}`;
  };

  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast(t('common_success'));
  };

  // Check low stock & out of stock to generate notifications
  const checkStockAlerts = (updatedProduct: Product) => {
    if (updatedProduct.stock === 0) {
      const exists = notifications.some(n => n.title.includes(updatedProduct.name) && n.type === 'out_of_stock' && !n.read);
      if (!exists) {
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            type: 'out_of_stock',
            title: `Out of Stock: ${updatedProduct.name}`,
            message: `${updatedProduct.sku} has reached 0 units. Stock needs replenishment.`,
            date: new Date().toISOString(),
            read: false,
            targetTab: 'stock',
          },
          ...prev,
        ]);
      }
    } else if (updatedProduct.stock <= updatedProduct.minStockLevel) {
      const exists = notifications.some(n => n.title.includes(updatedProduct.name) && n.type === 'low_stock' && !n.read);
      if (!exists) {
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            type: 'low_stock',
            title: `Low Stock: ${updatedProduct.name}`,
            message: `Only ${updatedProduct.stock} units remaining (min level: ${updatedProduct.minStockLevel}).`,
            date: new Date().toISOString(),
            read: false,
            targetTab: 'stock',
          },
          ...prev,
        ]);
      }
    }
  };

  // Product Operations
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);

    // Record initial movement if stock > 0
    if (newProduct.stock > 0) {
      const mov: InventoryMovement = {
        id: `mov-${Date.now()}`,
        productId: newProduct.id,
        productName: newProduct.name,
        sku: newProduct.sku,
        type: 'received',
        quantityDelta: newProduct.stock,
        previousStock: 0,
        newStock: newProduct.stock,
        reason: 'Initial product stock creation',
        costPerUnit: newProduct.costPrice,
        createdBy: role === 'owner' ? settings.ownerName : 'Sales Staff',
        createdAt: new Date().toISOString(),
      };
      setInventoryMovements(prev => [mov, ...prev]);
    }

    checkStockAlerts(newProduct);
    showToast(t('common_success'));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
          checkStockAlerts(updated);
          return updated;
        }
        return p;
      })
    );
    showToast(t('common_success'));
  };

  const archiveProduct = (id: string) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, archived: true } : p)));
    showToast('Product archived');
  };

  // Supplier Operations
  const addSupplierPartner = (supData: Omit<SupplierPartner, 'id' | 'createdAt'>) => {
    const newSupplier: SupplierPartner = {
      ...supData,
      id: `sup-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSupplierPartners(prev => [newSupplier, ...prev]);
    showToast(t('common_success'));
  };

  // Stock Operations: Receive, Adjust, Settle
  const receiveStock = (
    productId: string,
    quantity: number,
    costPrice: number,
    stockSource: StockSource,
    supplierPartnerId?: string,
    settlementNotes?: string,
    expectedDueDate?: string
  ) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const previousStock = prod.stock;
    const newStock = previousStock + quantity;

    // Update Product
    const sup = supplierPartnerId ? supplierPartners.find(s => s.id === supplierPartnerId) : undefined;
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? {
              ...p,
              stock: newStock,
              costPrice: costPrice > 0 ? costPrice : p.costPrice,
              stockSource: stockSource,
              supplierPartnerId: supplierPartnerId || p.supplierPartnerId,
              supplierPartnerName: sup ? sup.company : p.supplierPartnerName,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );

    // If stock source is supplier or partner, create a Supplier Obligation!
    let obligationId: string | undefined = undefined;
    if (stockSource !== 'owned' && supplierPartnerId && sup) {
      obligationId = `ob-${Date.now()}`;
      const totalObligation = quantity * costPrice;
      const newObligation: SupplierObligation = {
        id: obligationId,
        supplierPartnerId,
        supplierName: sup.company,
        productId,
        productName: prod.name,
        quantityReceived: quantity,
        quantityRemaining: quantity,
        costPerUnit: costPrice,
        totalObligation,
        amountSettled: 0,
        remainingBalance: totalObligation,
        status: 'active',
        dateReceived: new Date().toISOString(),
        expectedSettlementDate: expectedDueDate || new Date(Date.now() + 14 * 86400000).toISOString(),
        notes: settlementNotes || (stockSource === 'partner' ? 'Borrowed partner stock' : 'Consignment pending payment'),
        settlements: [],
      };
      setSupplierObligations(prev => [newObligation, ...prev]);
    }

    // Record Inventory Movement
    const mov: InventoryMovement = {
      id: `mov-${Date.now()}`,
      productId,
      productName: prod.name,
      sku: prod.sku,
      type: 'received',
      quantityDelta: quantity,
      previousStock,
      newStock,
      reason: stockSource === 'owned' 
        ? 'Direct owned inventory purchase' 
        : `Consignment from ${sup?.company || 'Partner'}`,
      referenceId: obligationId,
      costPerUnit: costPrice,
      createdBy: role === 'owner' ? settings.ownerName : 'Sales Staff',
      createdAt: new Date().toISOString(),
    };
    setInventoryMovements(prev => [mov, ...prev]);

    showToast(`Received ${quantity} units into inventory`);
  };

  const adjustStock = (productId: string, newStock: number, reason: string, type: MovementType = 'adjustment') => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const previousStock = prod.stock;
    const delta = newStock - previousStock;

    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } : p))
    );

    const mov: InventoryMovement = {
      id: `mov-${Date.now()}`,
      productId,
      productName: prod.name,
      sku: prod.sku,
      type,
      quantityDelta: delta,
      previousStock,
      newStock,
      reason: reason || 'Inventory count adjustment',
      costPerUnit: prod.costPrice,
      createdBy: role === 'owner' ? settings.ownerName : 'Sales Staff',
      createdAt: new Date().toISOString(),
    };
    setInventoryMovements(prev => [mov, ...prev]);

    checkStockAlerts({ ...prod, stock: newStock });
    showToast(t('common_success'));
  };

  const settleObligation = (
    obligationId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    notes?: string
  ) => {
    setSupplierObligations(prev =>
      prev.map(ob => {
        if (ob.id === obligationId) {
          const newAmountSettled = ob.amountSettled + amount;
          const newRemaining = Math.max(0, ob.totalObligation - newAmountSettled);
          const newStatus = newRemaining === 0 ? 'settled' : 'partially_settled';

          const settlementRec = {
            id: `settle-${Date.now()}`,
            obligationId,
            amount,
            paymentMethod,
            date: new Date().toISOString(),
            notes: notes || 'Settlement payment',
            recordedBy: role === 'owner' ? settings.ownerName : 'Sales Staff',
          };

          return {
            ...ob,
            amountSettled: newAmountSettled,
            remainingBalance: newRemaining,
            status: newStatus,
            settlements: [settlementRec, ...ob.settlements],
          };
        }
        return ob;
      })
    );

    showToast(`Recorded settlement payment of ${formatMoney(amount)}`);
  };

  const returnObligationStock = (obligationId: string, quantity: number, reason: string) => {
    const ob = supplierObligations.find(o => o.id === obligationId);
    if (!ob) return;

    const prod = products.find(p => p.id === ob.productId);
    if (!prod) return;

    const qtyToReturn = Math.min(quantity, prod.stock, ob.quantityRemaining);
    if (qtyToReturn <= 0) {
      showToast('Cannot return 0 items or more than current stock', 'error');
      return;
    }

    const valueReturned = qtyToReturn * ob.costPerUnit;
    const newStock = Math.max(0, prod.stock - qtyToReturn);

    // Update Product Stock
    setProducts(prev =>
      prev.map(p => (p.id === prod.id ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } : p))
    );

    // Update Obligation
    setSupplierObligations(prev =>
      prev.map(o => {
        if (o.id === obligationId) {
          const newRemainingQty = Math.max(0, o.quantityRemaining - qtyToReturn);
          const newTotalObligation = Math.max(0, o.totalObligation - valueReturned);
          const newRemainingBalance = Math.max(0, newTotalObligation - o.amountSettled);
          const newStatus = newRemainingBalance === 0 ? 'returned' : o.status;

          return {
            ...o,
            quantityRemaining: newRemainingQty,
            totalObligation: newTotalObligation,
            remainingBalance: newRemainingBalance,
            status: newStatus,
            notes: `${o.notes || ''} [Returned ${qtyToReturn} units on ${new Date().toLocaleDateString()}]`,
          };
        }
        return o;
      })
    );

    // Record Inventory Movement
    const mov: InventoryMovement = {
      id: `mov-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      type: 'returned',
      quantityDelta: -qtyToReturn,
      previousStock: prod.stock,
      newStock,
      reason: `Returned to ${ob.supplierName}: ${reason}`,
      referenceId: obligationId,
      costPerUnit: ob.costPerUnit,
      createdBy: role === 'owner' ? settings.ownerName : 'Sales Staff',
      createdAt: new Date().toISOString(),
    };
    setInventoryMovements(prev => [mov, ...prev]);

    showToast(`Returned ${qtyToReturn} units to ${ob.supplierName}`);
  };

  // Cart & POS Operations
  const addToCart = (product: Product, quantity = 1): boolean => {
    const existing = cart.find(item => item.productId === product.id);
    const currentQtyInCart = existing ? existing.quantity : 0;
    const desiredQty = currentQtyInCart + quantity;

    if (desiredQty > product.stock) {
      showToast(`${t('pos_insufficient_stock')} (Only ${product.stock} available)`, 'error');
      return false;
    }

    if (existing) {
      setCart(prev =>
        prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: desiredQty, total: desiredQty * item.unitPrice }
            : item
        )
      );
    } else {
      setCart(prev => [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          category: product.category,
          quantity,
          unitPrice: product.sellingPrice,
          costPrice: product.costPrice,
          total: quantity * product.sellingPrice,
        },
      ]);
    }
    return true;
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQty = (productId: string, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return true;
    }

    const prod = products.find(p => p.id === productId);
    if (!prod) return false;

    if (quantity > prod.stock) {
      showToast(`${t('pos_insufficient_stock')} (Only ${prod.stock} available)`, 'error');
      return false;
    }

    setCart(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity, total: quantity * item.unitPrice }
          : item
      )
    );
    return true;
  };

  const clearCart = () => {
    setCart([]);
    setCartDiscount(0);
    setSelectedCustomer(null);
  };

  // POS Complete Sale
  const completeSale = (paymentMethod: PaymentMethod, overrideStock = false): Sale | null => {
    if (cart.length === 0) {
      showToast(t('pos_cart_empty'), 'error');
      return null;
    }

    // Stock verification
    for (const item of cart) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) continue;
      if (!overrideStock && item.quantity > prod.stock) {
        showToast(`Stock shortage for ${item.productName}. Available: ${prod.stock}`, 'error');
        return null;
      }
    }

    const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
    const discount = Math.min(cartDiscount, subtotal);
    const total = Math.max(0, subtotal - discount);
    const cogs = cart.reduce((acc, item) => acc + item.costPrice * item.quantity, 0);
    const grossProfit = total - cogs;

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const saleId = `sale-${Date.now()}`;

    const newSale: Sale = {
      id: saleId,
      invoiceNumber,
      items: [...cart],
      subtotal,
      discount,
      total,
      cogs,
      costOfGoodsSold: cogs,
      grossProfit,
      paymentMethod,
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : undefined,
      customerPhone: selectedCustomer ? selectedCustomer.phone : undefined,
      cashierName: role === 'owner' ? settings.ownerName : 'Sales Staff',
      isOfflineSyncPending: !isOnline,
      createdAt: new Date().toISOString(),
    };

    // Deduct stock & create inventory movements
    setProducts(prev =>
      prev.map(p => {
        const itemSold = cart.find(item => item.productId === p.id);
        if (itemSold) {
          const newStock = Math.max(0, p.stock - itemSold.quantity);
          const updated = { ...p, stock: newStock, updatedAt: new Date().toISOString() };
          checkStockAlerts(updated);
          return updated;
        }
        return p;
      })
    );

    // Create movements
    const newMovements: InventoryMovement[] = cart.map(item => {
      const prod = products.find(p => p.id === item.productId);
      const prevStock = prod ? prod.stock : 0;
      return {
        id: `mov-${Date.now()}-${item.productId}`,
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        type: 'sold',
        quantityDelta: -item.quantity,
        previousStock: prevStock,
        newStock: Math.max(0, prevStock - item.quantity),
        reason: `POS Sale ${invoiceNumber}`,
        referenceId: saleId,
        costPerUnit: item.costPrice,
        createdBy: role === 'owner' ? settings.ownerName : 'Sales Staff',
        createdAt: new Date().toISOString(),
      };
    });

    setInventoryMovements(prev => [...newMovements, ...prev]);

    // Update Customer stats if selected
    if (selectedCustomer) {
      setCustomers(prev =>
        prev.map(c =>
          c.id === selectedCustomer.id
            ? {
                ...c,
                totalSpent: c.totalSpent + total,
                ordersCount: c.ordersCount + 1,
              }
            : c
        )
      );
    }

    // Save Sale
    setSales(prev => [newSale, ...prev]);

    if (!isOnline) {
      setOfflineQueue(prev => [newSale, ...prev]);
      showToast('Sale saved locally (Offline). Will sync when online.', 'info');
    } else {
      showToast(t('pos_sale_success'), 'success');
    }

    // Reset Cart & Set Current Receipt
    clearCart();
    setCurrentReceipt(newSale);
    return newSale;
  };

  // Sync Offline Queue
  const syncOfflineQueue = () => {
    if (offlineQueue.length === 0) {
      showToast('Offline queue is already empty.');
      return;
    }
    // Mark sales as synced
    setSales(prev =>
      prev.map(s => (s.isOfflineSyncPending ? { ...s, isOfflineSyncPending: false } : s))
    );
    setOfflineQueue([]);
    showToast(`Successfully synced ${offlineQueue.length} offline transactions!`);
  };

  // Customers
  const addCustomer = (custData: Omit<Customer, 'id' | 'totalSpent' | 'ordersCount' | 'createdAt'>) => {
    const newCust: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      totalSpent: 0,
      ordersCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [newCust, ...prev]);
    showToast(t('common_success'));
  };

  // Expenses
  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expData,
      id: `exp-${Date.now()}`,
    };
    setExpenses(prev => [newExp, ...prev]);
    showToast(t('common_success'));
  };

  // Notifications
  const markNotificationRead = (id?: string) => {
    if (id) {
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Reset to realistic demo data
  const resetToDemoData = () => {
    setSettings(initialSettings);
    setProducts(initialProducts);
    setSupplierPartners(initialSuppliers);
    setSupplierObligations(initialObligations);
    setCustomers(initialCustomers);
    setSales(initialSales);
    setExpenses(initialExpenses);
    setInventoryMovements(initialMovements);
    setNotifications(initialNotifications);
    setCart([]);
    setOfflineQueue([]);
    showToast('Reset all data to realistic Ethiopian retail demo state!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        role,
        setRole,
        isOnline,
        setIsOnline,
        toggleOnline,
        offlineQueueCount: offlineQueue.length,
        syncOfflineQueue,
        settings,
        updateSettings,
        products,
        addProduct,
        updateProduct,
        archiveProduct,
        supplierPartners,
        addSupplierPartner,
        supplierObligations,
        receiveStock,
        adjustStock,
        settleObligation,
        returnObligationStock,
        inventoryMovements,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartDiscount,
        setCartDiscount,
        selectedCustomer,
        setSelectedCustomer,
        completeSale,
        sales,
        currentReceipt,
        setCurrentReceipt,
        customers,
        addCustomer,
        expenses,
        addExpense,
        notifications,
        markNotificationRead,
        markNotificationAsRead,
        clearAllNotifications,
        activeTab,
        setActiveTab,
        moreSubPage,
        setMoreSubPage,
        toast,
        showToast,
        formatMoney,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
