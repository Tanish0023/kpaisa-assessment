import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useBooking();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-slide-in ${
              isError
                ? 'bg-red-950/90 text-red-100 border-red-500/40'
                : isSuccess
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/40'
                : isWarning
                ? 'bg-amber-950/90 text-amber-100 border-amber-500/40'
                : 'bg-slate-900/90 text-slate-100 border-slate-700/60'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isError && !isSuccess && !isWarning && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 -mr-1 -mt-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
