import React from 'react';
import { 
  Bell, 
  ArrowLeft, 
  Check, 
  Trash2, 
  AlertTriangle, 
  Package, 
  Building2, 
  Info 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsScreen: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications, 
    setMoreSubPage, 
    setActiveTab,
    t 
  } = useApp();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return <Package className="w-4 h-4 text-amber-400" />;
      case 'out_of_stock': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'obligation_due': return <Building2 className="w-4 h-4 text-purple-400" />;
      default: return <Info className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="pb-24 pt-2 px-3.5 max-w-lg mx-auto space-y-3.5 animate-in fade-in">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMoreSubPage(null)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to More</span>
        </button>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div>
        <h2 className="font-bold text-base text-white">{t('notif_title')}</h2>
        <p className="text-[11px] text-slate-400">
          Stock level warnings & supplier obligation reminders
        </p>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs bg-slate-800/40 rounded-2xl border border-slate-700/40 p-6">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>{t('notif_empty')}</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.type === 'obligation_due') {
                  setActiveTab('stock');
                } else if (notif.type === 'low_stock' || notif.type === 'out_of_stock') {
                  setActiveTab('stock');
                }
              }}
              className={`border rounded-2xl p-3.5 flex items-start justify-between gap-3 shadow-sm cursor-pointer transition-all active:scale-98 ${
                notif.read
                  ? 'bg-slate-800/60 border-slate-700/50 opacity-80'
                  : 'bg-slate-800 border-amber-500/50 ring-1 ring-amber-500/20'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 shrink-0 mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-white truncate">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{notif.message}</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {new Date(notif.date || notif.createdAt || new Date().toISOString()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    markNotificationAsRead(notif.id);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-emerald-400 shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
