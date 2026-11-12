import React from 'react';
import { Plane, Calendar, Clock, Users } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const Header: React.FC = () => {
  const { passengers, activePassenger } = useBooking();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Plane className="w-6 h-6 rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-white tracking-tight">
                  AeroSelect
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  Flight Seat & Passenger Manager
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive Cabin Seat Selection & In-Flight Dining System
              </p>
            </div>
          </div>

          {/* Flight Details Pill */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2 text-xs">
            {/* Route */}
            <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
              <span className="font-extrabold text-white text-sm">DEL</span>
              <Plane className="w-3.5 h-3.5 text-blue-400 rotate-90" />
              <span className="font-extrabold text-white text-sm">BOM</span>
              <span className="text-[11px] text-slate-400">AI-887</span>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-3 text-slate-300 pr-3 border-r border-slate-800">
              <span className="flex items-center gap-1 text-[11px]">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Tomorrow</span>
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>08:45 AM</span>
              </span>
            </div>

            {/* Active Passenger Indicator */}
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px]">
              <Users className="w-3.5 h-3.5" />
              <span>{passengers.length} Passenger{passengers.length > 1 ? 's' : ''}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">Active: <strong className="text-white">{activePassenger?.name}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
