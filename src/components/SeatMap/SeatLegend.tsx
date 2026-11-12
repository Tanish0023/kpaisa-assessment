import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-3 sm:p-4 text-xs">
      <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mb-2.5">
        Seat Legend & Pricing Tiers
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {/* Free Seat */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded border-2 border-emerald-500 bg-emerald-950/40 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
            ₹0
          </div>
          <span className="text-slate-300">Free / Standard</span>
        </div>

        {/* Extra Legroom */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded border-2 border-indigo-500 bg-indigo-950/40 flex items-center justify-center text-[10px] text-indigo-300 font-bold">
            +L
          </div>
          <span className="text-slate-300">Extra Legroom</span>
        </div>

        {/* Premium Seat */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded border-2 border-amber-500 bg-amber-950/40 flex items-center justify-center text-[10px] text-amber-300 font-bold">
            ★
          </div>
          <span className="text-slate-300">Premium</span>
        </div>

        {/* Selected by Active */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-blue-500/30">
            ✓
          </div>
          <span className="text-slate-300 font-medium">Selected</span>
        </div>

        {/* Taken by Other Passenger */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded border-2 border-purple-400 bg-purple-950/40 flex items-center justify-center text-[10px] text-purple-300 font-bold">
            P
          </div>
          <span className="text-slate-300">Other Passenger</span>
        </div>

        {/* Occupied */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700/80 flex items-center justify-center text-[10px] text-slate-500 font-bold">
            ✕
          </div>
          <span className="text-slate-500">Occupied</span>
        </div>
      </div>
    </div>
  );
};
