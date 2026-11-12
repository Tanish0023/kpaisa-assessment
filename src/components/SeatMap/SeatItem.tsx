import React, { useState } from 'react';
import { Seat } from '../../types';
import { useBooking } from '../../context/BookingContext';
import { Check, Lock, Sparkles, User } from 'lucide-react';

interface SeatItemProps {
  seat: Seat;
}

export const SeatItem: React.FC<SeatItemProps> = ({ seat }) => {
  const {
    activePassenger,
    getPassengerBySeatId,
    assignSeatToActivePassenger
  } = useBooking();

  const [showTooltip, setShowTooltip] = useState(false);

  // Status checks
  const assignedPassenger = getPassengerBySeatId(seat.id);
  const isSelectedByActive = assignedPassenger?.id === activePassenger?.id;
  const isAssignedToOther = assignedPassenger && !isSelectedByActive;
  const isOccupied = seat.isOccupied;

  // Determine styling
  let containerStyles = 'border cursor-pointer transition-all duration-200 ';
  let badgeColor = '';

  if (isOccupied) {
    containerStyles = 'bg-slate-800/60 border-slate-700/60 text-slate-500 cursor-not-allowed opacity-60 ';
  } else if (isSelectedByActive) {
    containerStyles = 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/80 shadow-lg shadow-blue-600/30 scale-105 z-10 ';
  } else if (isAssignedToOther) {
    containerStyles = 'bg-purple-950/50 border-purple-400/80 text-purple-200 hover:border-purple-300 hover:bg-purple-900/60 ';
  } else {
    // Available
    if (seat.category === 'Extra Legroom') {
      containerStyles = 'bg-slate-900/90 border-indigo-500/70 text-indigo-200 hover:border-indigo-400 hover:bg-indigo-950/40 hover:scale-105 ';
      badgeColor = 'text-indigo-400';
    } else if (seat.category === 'Premium') {
      containerStyles = 'bg-slate-900/90 border-amber-500/70 text-amber-200 hover:border-amber-400 hover:bg-amber-950/40 hover:scale-105 ';
      badgeColor = 'text-amber-400';
    } else {
      // Standard Free
      containerStyles = 'bg-slate-900/90 border-emerald-500/60 text-emerald-200 hover:border-emerald-400 hover:bg-emerald-950/40 hover:scale-105 ';
      badgeColor = 'text-emerald-400';
    }
  }

  const handleClick = () => {
    assignSeatToActivePassenger(seat.id);
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        disabled={isOccupied}
        onClick={handleClick}
        aria-label={`Seat ${seat.id}, ${seat.category}, ${seat.price === 0 ? 'Free' : '₹' + seat.price}${
          isOccupied ? ', Occupied' : isSelectedByActive ? ', Selected by active passenger' : ''
        }`}
        className={`w-10 h-11 sm:w-12 sm:h-13 rounded-lg flex flex-col items-center justify-between p-1 select-none font-medium text-xs ${containerStyles}`}
      >
        {/* Top bar / Headrest indicator */}
        <div
          className={`w-5 sm:w-6 h-1 rounded-full ${
            isSelectedByActive
              ? 'bg-blue-200'
              : isOccupied
              ? 'bg-slate-600'
              : isAssignedToOther
              ? 'bg-purple-400'
              : seat.category === 'Extra Legroom'
              ? 'bg-indigo-400'
              : seat.category === 'Premium'
              ? 'bg-amber-400'
              : 'bg-emerald-400'
          }`}
        />

        {/* Seat ID or Status icon */}
        <div className="flex items-center justify-center font-bold text-xs tracking-tight">
          {isOccupied ? (
            <Lock className="w-3.5 h-3.5 text-slate-500" />
          ) : isSelectedByActive ? (
            <div className="flex items-center gap-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{seat.id}</span>
            </div>
          ) : isAssignedToOther ? (
            <div className="flex items-center gap-0.5 text-[11px]">
              <User className="w-3 h-3 text-purple-300" />
              <span>{seat.id}</span>
            </div>
          ) : (
            <span>{seat.id}</span>
          )}
        </div>

        {/* Price or Category Tag */}
        <div className="text-[9px] sm:text-[10px] font-semibold leading-none">
          {isOccupied ? (
            <span className="text-slate-500">BUSY</span>
          ) : isSelectedByActive ? (
            <span className="text-blue-100">{seat.price === 0 ? 'FREE' : `₹${seat.price}`}</span>
          ) : isAssignedToOther ? (
            <span className="text-purple-300 truncate max-w-[38px]">{assignedPassenger?.name.split(' ')[0]}</span>
          ) : (
            <span className={badgeColor}>{seat.price === 0 ? 'FREE' : `₹${seat.price}`}</span>
          )}
        </div>
      </button>

      {/* Hover Tooltip Card */}
      {showTooltip && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-40 w-44 p-2.5 rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl text-[11px] text-slate-200 pointer-events-none backdrop-blur-md animate-fade-in">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="font-bold text-white text-xs">Seat {seat.id}</span>
            <span className={`font-semibold ${seat.price === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {seat.price === 0 ? 'FREE' : `₹${seat.price}`}
            </span>
          </div>

          <div className="mt-1.5 space-y-0.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Class:</span>
              <span className="font-medium text-slate-200">{seat.category}</span>
            </div>
            <div className="flex justify-between capitalize">
              <span className="text-slate-400">Position:</span>
              <span>{seat.position} seat</span>
            </div>
            {seat.isExitRow && (
              <div className="text-amber-400 font-semibold flex items-center gap-1 mt-1">
                <Sparkles className="w-3 h-3" /> Emergency Exit Row
              </div>
            )}
            <div className="pt-1 mt-1 border-t border-slate-800/80">
              {isOccupied && <span className="text-red-400 font-medium">Occupied by another passenger</span>}
              {isSelectedByActive && (
                <span className="text-blue-400 font-medium">Assigned to {activePassenger?.name}</span>
              )}
              {isAssignedToOther && (
                <span className="text-purple-300 font-medium">Assigned to {assignedPassenger?.name}</span>
              )}
              {!isOccupied && !assignedPassenger && (
                <span className="text-emerald-400 font-medium">Click to assign to {activePassenger?.name}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
