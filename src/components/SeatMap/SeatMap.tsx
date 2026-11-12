import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { SeatItem } from './SeatItem';
import { SeatLegend } from './SeatLegend';
import { Plane, Compass, Sparkles } from 'lucide-react';

export const SeatMap: React.FC = () => {
  const {
    activeConfig,
    currentLayout,
    switchConfig,
    activePassenger,
    autoAssignAvailableSeats
  } = useBooking();

  // Group seats by row
  const rowsMap: { [row: number]: typeof currentLayout.seats } = {};
  for (let r = 1; r <= currentLayout.totalRows; r++) {
    rowsMap[r] = currentLayout.seats.filter((s) => s.row === r);
  }

  // Calculate statistics
  const totalSeatsCount = currentLayout.seats.length;
  const occupiedCount = currentLayout.seats.filter((s) => s.isOccupied).length;
  const freeCategoryCount = currentLayout.seats.filter((s) => s.price === 0 && !s.isOccupied).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Configuration Switcher Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Plane className="w-5 h-5 rotate-45" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Cabin Seating Configuration
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select an aircraft seating layout to view seat availability and assign seats.
            </p>
          </div>

          {/* Configuration Selector Tabs */}
          <div className="inline-flex p-1 bg-slate-950/80 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => switchConfig('3-2')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeConfig === '3-2'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>3–2 Layout</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20">Single Aisle</span>
            </button>
            <button
              type="button"
              onClick={() => switchConfig('2-3-2')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeConfig === '2-3-2'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>2–3–2 Layout</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20">Twin Aisle</span>
            </button>
          </div>
        </div>

        {/* Aircraft Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Aircraft Model</span>
            <span className="font-bold text-slate-200">{currentLayout.aircraftModel}</span>
          </div>
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Total Capacity</span>
            <span className="font-bold text-slate-200">{totalSeatsCount} Seats ({currentLayout.totalRows} Rows)</span>
          </div>
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">Occupied Seats</span>
            <span className="font-bold text-red-400">{occupiedCount} Booked</span>
          </div>
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">Free Seats Available</span>
              <span className="font-bold text-emerald-400">{freeCategoryCount} Free (₹0)</span>
            </div>
            <button
              onClick={autoAssignAvailableSeats}
              title="Automatically assign available seats for unassigned passengers"
              className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              Auto-Pick
            </button>
          </div>
        </div>
      </div>

      {/* Seat Legend */}
      <SeatLegend />

      {/* Fuselage / Airplane Cabin Container */}
      <div className="relative mx-auto w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-slate-800 rounded-[50px] p-4 sm:p-8 shadow-2xl overflow-hidden">
        {/* Cockpit Nose Shape */}
        <div className="relative mx-auto w-40 sm:w-56 h-20 bg-slate-800/60 border-t-2 border-x-2 border-slate-700/80 rounded-t-[70px] flex flex-col items-center justify-center mb-6">
          <div className="flex gap-2">
            <div className="w-8 sm:w-11 h-4 bg-sky-950 border border-sky-400/40 rounded-t-sm" />
            <div className="w-8 sm:w-11 h-4 bg-sky-950 border border-sky-400/40 rounded-t-sm" />
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Compass className="w-3 h-3 text-blue-400" />
            <span>Cockpit / Flight Deck</span>
          </div>
        </div>

        {/* Front Galley & Restroom Banner */}
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-2 mb-6">
          <span>🍽️ Front Galley Service</span>
          <span className="text-blue-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Selecting for: <strong className="text-white">{activePassenger?.name}</strong>
          </span>
          <span>🚻 Lavatory</span>
        </div>

        {/* Column Header Letters */}
        <div className="flex justify-center items-center gap-4 sm:gap-6 pb-3 mb-2 border-b border-slate-800/80 text-xs font-bold text-slate-400">
          {/* Row indicator placeholder */}
          <div className="w-6 text-center text-[10px] text-slate-600">ROW</div>

          {currentLayout.columnGroups.map((group, groupIdx) => (
            <React.Fragment key={groupIdx}>
              <div className="flex gap-1.5 sm:gap-2">
                {group.map((letter) => (
                  <div
                    key={letter}
                    className="w-10 sm:w-12 text-center text-slate-300 font-bold"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              {groupIdx < currentLayout.columnGroups.length - 1 && (
                <div className="w-4 sm:w-6 text-center text-[9px] font-semibold text-slate-600 uppercase tracking-tighter">
                  Aisle
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Airplane Wing Indicators on Sides (Rows 4-7) */}
        <div className="relative">
          {/* Cabin Rows */}
          <div className="space-y-2.5 sm:space-y-3">
            {Array.from({ length: currentLayout.totalRows }, (_, i) => i + 1).map((rowNum) => {
              const rowSeats = rowsMap[rowNum] || [];
              const isExitRow = rowNum === 5;

              return (
                <div key={rowNum} className="relative">
                  {/* Exit Row Banner for row 5 */}
                  {isExitRow && (
                    <div className="my-2 py-1 px-3 bg-amber-950/40 border border-amber-500/40 rounded-lg flex items-center justify-between text-[10px] font-semibold text-amber-300">
                      <span>🚪 EMERGENCY EXIT LEFT</span>
                      <span>EXTRA LEGROOM ROW</span>
                      <span>EMERGENCY EXIT RIGHT 🚪</span>
                    </div>
                  )}

                  <div className="flex justify-center items-center gap-4 sm:gap-6">
                    {/* Row Number Marker */}
                    <div className="w-6 text-center text-xs font-bold text-slate-400">
                      {rowNum}
                    </div>

                    {/* Column Groups */}
                    {currentLayout.columnGroups.map((group, groupIdx) => (
                      <React.Fragment key={groupIdx}>
                        <div className="flex gap-1.5 sm:gap-2">
                          {group.map((letter) => {
                            const seat = rowSeats.find((s) => s.letter === letter);
                            if (!seat) return null;
                            return <SeatItem key={seat.id} seat={seat} />;
                          })}
                        </div>

                        {/* Aisle Spacer */}
                        {groupIdx < currentLayout.columnGroups.length - 1 && (
                          <div className="w-4 sm:w-6 flex items-center justify-center text-[10px] text-slate-700 font-mono">
                            │
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rear Galley & Restrooms */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-400 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2">
          <span>🚻 Aft Lavatory (L)</span>
          <span className="text-slate-500 text-[10px] uppercase font-semibold">Rear Aircraft Bulkhead</span>
          <span>🚻 Aft Lavatory (R)</span>
        </div>
      </div>
    </div>
  );
};
