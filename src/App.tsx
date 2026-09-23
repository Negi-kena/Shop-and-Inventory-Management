import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { ReceiptModal } from './components/ReceiptModal';
import { HomeScreen } from './screens/HomeScreen';
import { PosScreen } from './screens/PosScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { StockScreen } from './screens/StockScreen';
import { MoreScreen } from './screens/MoreScreen';

const MainLayout: React.FC = () => {
  const { activeTab, currentReceipt, setCurrentReceipt } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 antialiased">
      {/* Toast notifications */}
      <Toast />

      {/* Top Mobile App Bar */}
      <Header />

      {/* Screen Viewport */}
      <main className="flex-1 w-full max-w-lg mx-auto">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'sell' && <PosScreen />}
        {activeTab === 'products' && <ProductsScreen />}
        {activeTab === 'stock' && <StockScreen />}
        {activeTab === 'more' && <MoreScreen />}
      </main>

      {/* Bottom Smartphone Navigation */}
      <BottomNav />

      {/* Receipt Modal (Triggered on sale completion or receipt view) */}
      <ReceiptModal
        sale={currentReceipt}
        onClose={() => setCurrentReceipt(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
