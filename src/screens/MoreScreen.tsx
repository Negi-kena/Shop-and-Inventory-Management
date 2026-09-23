import React from 'react';
import { 
  Users, 
  Building2, 
  Receipt, 
  BarChart3, 
  Settings, 
  Bell, 
  ShieldCheck, 
  ChevronRight, 
  Wifi, 
  WifiOff, 
  Sparkles,
  HelpCircle,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SuppliersScreen } from './SuppliersScreen';
import { CustomersScreen } from './CustomersScreen';
import { ExpensesScreen } from './ExpensesScreen';
import { ReportsScreen } from './ReportsScreen';
import { SettingsScreen } from './SettingsScreen';
import { NotificationsScreen } from './NotificationsScreen';

export const MoreScreen: React.FC = () => {
  const { 
    moreSubPage, 
    setMoreSubPage, 
    role, 
    notifications, 
    isOnline, 
    offlineQueueCount,
    settings,
    t 
  } = useApp();

  // If a subpage is active, render that subpage component
  if (moreSubPage === 'suppliers') return <SuppliersScreen />;
  if (moreSubPage === 'customers') return <CustomersScreen />;
  if (moreSubPage === 'expenses') return <ExpensesScreen />;
  if (moreSubPage === 'reports') return <ReportsScreen />;
  if (moreSubPage === 'settings') return <SettingsScreen />;
  if (moreSubPage === 'notifications') return <NotificationsScreen />;

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const menuItems = [
    {
      id: 'suppliers',
      title: t('more_suppliers'),
      desc: 'Track suppliers, distributors & consignment partners',
      icon: <Building2 className="w-5 h-5 text-purple-400" />,
      badge: null,
    },
    {
      id: 'customers',
      title: t('more_customers'),
      desc: 'Customer directory & purchase history (No customer credit)',
      icon: <Users className="w-5 h-5 text-sky-400" />,
      badge: null,
    },
    {
      id: 'expenses',
      title: t('more_expenses'),
      desc: 'Track shop rent, fuel/electricity, transport & wages',
      icon: <Receipt className="w-5 h-5 text-amber-400" />,
      badge: null,
    },
    {
      id: 'reports',
      title: t('more_reports'),
      desc: 'Accurate profit & loss, COGS & sales analytics',
      icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
      badge: role === 'owner' ? 'Owner' : null,
    },
    {
      id: 'notifications',
      title: t('more_notifications'),
      desc: 'Low stock alerts and settlement reminders',
      icon: <Bell className="w-5 h-5 text-red-400" />,
      badge: unreadNotifs > 0 ? `${unreadNotifs} new` : null,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'settings',
      title: t('more_settings'),
      desc: 'Business profile, TIN, language (EN, አማ, Oro), & user role',
      icon: <Settings className="w-5 h-5 text-slate-300" />,
      badge: null,
    },
  ];

  return (
    <div className="pb-24 pt-2 px-3.5 max-w-lg mx-auto space-y-3.5 animate-in fade-in">
      
      {/* Business Header Card */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-lg">
            {settings.businessName.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">{settings.businessName}</h2>
            <p className="text-[11px] text-slate-400">{settings.address}, {settings.city}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {role === 'owner' ? '👑 Owner Mode' : '👤 Sales Staff'}
              </span>
              <span className="text-[10px] text-slate-400">
                Tel: {settings.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Navigation List */}
      <div className="space-y-2">
        {menuItems.map(item => (
          <div
            key={item.id}
            onClick={() => setMoreSubPage(item.id as any)}
            className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 rounded-2xl p-3.5 flex items-center justify-between gap-3 cursor-pointer active:scale-98 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-white truncate">{item.title}</h3>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      item.badgeColor || 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
          </div>
        ))}
      </div>

      {/* System / Offline Status Footer */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center space-y-1">
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Connected &bull; Local Storage Offline-Ready</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Offline Mode &bull; {offlineQueueCount} actions stored locally</span>
            </>
          )}
        </p>
        <p className="text-[10px] text-slate-600 font-mono">
          Addis Retail Mobile POS v1.0.0 &bull; Ethiopian Electronics & Solar Retail
        </p>
      </div>

    </div>
  );
};
