import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { PassengerFormModal } from './PassengerFormModal';
import { MealSelectorModal } from '../MealSelector/MealSelectorModal';
import {
  Users,
  Armchair,
  Utensils,
  Plus,
  Minus,
  Edit3,
  X,
  ChevronRight
} from 'lucide-react';

export const PassengerSelector: React.FC = () => {
  const {
    passengers,
    activePassengerId,
    setActivePassengerId,
    setPassengerCount,
    removeSeat,
    getSeatById,
    getMealById
  } = useBooking();

  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [mealModalPassengerId, setMealModalPassengerId] = useState<string | null>(null);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur shadow-xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Passengers ({passengers.length})
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Switch active traveler or open dialog to edit names & meals.
          </p>
        </div>

        {/* Quick Count Stepper & Edit Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Quick Counter */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setPassengerCount(passengers.length - 1)}
              disabled={passengers.length <= 1}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Decrease passenger count"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center text-xs font-bold text-slate-200">
              {passengers.length}
            </span>
            <button
              type="button"
              onClick={() => setPassengerCount(passengers.length + 1)}
              disabled={passengers.length >= 9}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              aria-label="Increase passenger count"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Edit Details via Centered Formik Dialog */}
          <button
            type="button"
            onClick={() => setIsPassengerModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Names</span>
          </button>
        </div>
      </div>

      {/* Passenger Cards List */}
      <div className="space-y-2.5">
        {passengers.map((passenger, index) => {
          const isActive = passenger.id === activePassengerId;
          const assignedSeat = passenger.assignedSeatId
            ? getSeatById(passenger.assignedSeatId)
            : undefined;
          const selectedMeal = passenger.selectedMealId
            ? getMealById(passenger.selectedMealId)
            : undefined;

          return (
            <div
              key={passenger.id}
              onClick={() => setActivePassengerId(passenger.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              {/* Top Row: Name, Active Indicator, Edit Button */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                      <span>{passenger.title}. {passenger.name}</span>
                      {isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                          Active
                        </span>
                      )}
                    </h3>
                    <span className="text-[10px] text-slate-400">
                      {passenger.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePassengerId(passenger.id);
                      setIsPassengerModalOpen(true);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit passenger details in dialog"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-blue-400 translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </div>
              </div>

              {/* Assignments Row: Seat & Meal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/70 text-xs">
                {/* Seat Assignment Info */}
                <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5 truncate mr-1">
                    <Armchair className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    {assignedSeat ? (
                      <span className="truncate">
                        <strong className="text-white">Seat {assignedSeat.id}</strong>
                        <span className="text-[11px] text-slate-400 ml-1">
                          ({assignedSeat.category})
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">
                        No seat assigned
                      </span>
                    )}
                  </div>

                  {assignedSeat ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`font-bold text-[11px] ${assignedSeat.price === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {assignedSeat.price === 0 ? 'FREE' : `₹${assignedSeat.price}`}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSeat(passenger.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title="Remove assigned seat"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-blue-400 font-medium">Pick on map</span>
                  )}
                </div>

                {/* Meal Assignment Info */}
                <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5 truncate mr-1">
                    <Utensils className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {selectedMeal ? (
                      <span className="truncate text-slate-300 font-medium text-[11px]">
                        {selectedMeal.name}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">
                        No meal chosen
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {selectedMeal && (
                      <span className={`font-bold text-[11px] ${selectedMeal.price === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {selectedMeal.price === 0 ? 'FREE' : `₹${selectedMeal.price}`}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePassengerId(passenger.id);
                        setMealModalPassengerId(passenger.id);
                      }}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2 ml-1"
                    >
                      {selectedMeal ? 'Change' : '+ Meal'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Dialog Modals (Rendered via React Portal directly into body) */}
      <PassengerFormModal
        isOpen={isPassengerModalOpen}
        onClose={() => setIsPassengerModalOpen(false)}
      />

      <MealSelectorModal
        isOpen={mealModalPassengerId !== null}
        onClose={() => setMealModalPassengerId(null)}
        targetPassengerId={mealModalPassengerId || undefined}
      />
    </div>
  );
};
