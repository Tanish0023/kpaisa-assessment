import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { Modal } from '../ui/Modal';
import {
  CreditCard,
  RotateCcw,
  CheckCircle2,
  Armchair,
  Utensils,
  Receipt
} from 'lucide-react';

export const PriceSummary: React.FC = () => {
  const {
    passengers,
    totalSeatCost,
    totalMealCost,
    grandTotal,
    getSeatById,
    getMealById,
    resetAll,
    currentLayout
  } = useBooking();

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  // Check how many passengers have assigned seats
  const seatedCount = passengers.filter((p) => p.assignedSeatId !== null).length;
  const isFullyAssigned = seatedCount === passengers.length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            Booking & Cost Summary
          </h2>
        </div>

        <button
          type="button"
          onClick={resetAll}
          className="text-xs font-semibold text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
          title="Clear all seat and meal selections"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Itemized Passenger Breakdown */}
      <div className="space-y-3">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Passenger-Wise Breakdown
        </div>

        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {passengers.map((passenger, index) => {
            const seat = passenger.assignedSeatId ? getSeatById(passenger.assignedSeatId) : undefined;
            const meal = passenger.selectedMealId ? getMealById(passenger.selectedMealId) : undefined;
            const passengerTotal = (seat?.price || 0) + (meal?.price || 0);

            return (
              <div
                key={passenger.id}
                className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1.5"
              >
                {/* Passenger header */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">
                    {index + 1}. {passenger.title}. {passenger.name}
                  </span>
                  <span className="font-bold text-slate-200">
                    {passengerTotal === 0 ? '₹0' : `₹${passengerTotal}`}
                  </span>
                </div>

                {/* Seat line */}
                <div className="flex items-center justify-between text-slate-400 pl-2 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Armchair className="w-3 h-3 text-blue-400" />
                    {seat ? (
                      <span>
                        Seat <strong>{seat.id}</strong> ({seat.category})
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">No seat selected</span>
                    )}
                  </span>
                  <span className={seat?.price === 0 ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                    {seat ? (seat.price === 0 ? 'FREE' : `₹${seat.price}`) : '—'}
                  </span>
                </div>

                {/* Meal line */}
                <div className="flex items-center justify-between text-slate-400 pl-2 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-3 h-3 text-emerald-400" />
                    {meal ? (
                      <span className="truncate max-w-[170px]">{meal.name}</span>
                    ) : (
                      <span className="text-slate-500 italic">No meal selected</span>
                    )}
                  </span>
                  <span className={meal?.price === 0 ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                    {meal ? (meal.price === 0 ? 'FREE' : `₹${meal.price}`) : '—'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totals Calculation Card */}
      <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
        <div className="flex justify-between text-slate-300">
          <span>Seat Selection Total:</span>
          <span className="font-semibold text-white">
            {totalSeatCost === 0 ? '₹0' : `₹${totalSeatCost}`}
          </span>
        </div>

        <div className="flex justify-between text-slate-300">
          <span>In-Flight Dining (Bonus):</span>
          <span className="font-semibold text-white">
            {totalMealCost === 0 ? '₹0' : `₹${totalMealCost}`}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
          <div>
            <span className="text-sm font-bold text-white block">Grand Total</span>
            <span className="text-[10px] text-slate-400">All applicable taxes included</span>
          </div>
          <span className="text-xl font-extrabold text-emerald-400">
            ₹{grandTotal}
          </span>
        </div>
      </div>

      {/* Completion Status & Confirmation */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Seat Assignment Status:</span>
          <span className={`font-semibold ${isFullyAssigned ? 'text-emerald-400' : 'text-amber-400'}`}>
            {seatedCount} of {passengers.length} assigned
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsConfirmationModalOpen(true)}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all active:scale-[0.99]"
        >
          <CreditCard className="w-4 h-4" />
          <span>Confirm Selection (₹{grandTotal})</span>
        </button>

        <p className="text-[11px] text-center text-slate-500">
          Instant cancellation & modification available up to 2 hours before flight.
        </p>
      </div>

      {/* Success Confirmation Modal */}
      <Modal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        title="Flight Seating Confirmation"
        subtitle="Review your completed flight reservation & seat assignments"
      >
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-emerald-200">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-sm">
                Seat & Meal Selection Confirmed!
              </h4>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                All selected seats have been reserved for your flight.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-300">
              <span>Aircraft Configuration:</span>
              <strong className="text-white">{currentLayout.name}</strong>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-300">
              <span>Total Passengers:</span>
              <strong className="text-white">{passengers.length} Travelers</strong>
            </div>

            <div className="space-y-2 pt-1">
              {passengers.map((p, idx) => {
                const s = p.assignedSeatId ? getSeatById(p.assignedSeatId) : null;
                const m = p.selectedMealId ? getMealById(p.selectedMealId) : null;

                return (
                  <div key={p.id} className="flex justify-between text-slate-300">
                    <span>
                      {idx + 1}. {p.title}. {p.name}:
                    </span>
                    <span className="text-right">
                      <strong className="text-blue-400">
                        {s ? `Seat ${s.id} (${s.category})` : 'Unassigned'}
                      </strong>
                      {m && (
                        <span className="block text-[11px] text-slate-400">
                          Meal: {m.name}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
              <span className="font-bold text-white text-sm">Final Amount Paid:</span>
              <span className="text-xl font-bold text-emerald-400">₹{grandTotal}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsConfirmationModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
