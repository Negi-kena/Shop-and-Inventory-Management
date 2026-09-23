import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300">
      <div className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-xl border text-xs sm:text-sm font-medium backdrop-blur-md max-w-sm w-full animate-in slide-in-from-top-4 ${
        toast.type === 'error'
          ? 'bg-red-950/95 text-red-200 border-red-800'
          : toast.type === 'info'
          ? 'bg-sky-950/95 text-sky-200 border-sky-800'
          : 'bg-emerald-950/95 text-emerald-200 border-emerald-800'
      }`}>
        {toast.type === 'error' ? (
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <span className="flex-1 leading-snug">{toast.message}</span>
      </div>
    </div>
  );
};
