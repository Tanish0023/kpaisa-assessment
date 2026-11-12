import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Header } from './components/Header';
import { SeatMap } from './components/SeatMap/SeatMap';
import { PassengerSelector } from './components/PassengerManager/PassengerSelector';
import { PriceSummary } from './components/Summary/PriceSummary';
import { ToastContainer } from './components/ui/ToastContainer';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { grandTotal, passengers, activePassenger } = useBooking();
  const seatedCount = passengers.filter((p) => p.assignedSeatId !== null).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Navigation Header */}
      <Header />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Top Info Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-slate-900/40 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <span className="font-bold text-white text-sm block">
                Flight Seat Selection Step
              </span>
              <span className="text-slate-400">
                Click any passenger on the right to select them, then click an available seat on the cabin map to assign it.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-300 self-end sm:self-auto shrink-0">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Pricing</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Free & Paid Tiers</span>
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Airplane Cabin Map & Layout Switcher */}
          <section
            aria-label="Aircraft Cabin Seating"
            className="lg:col-span-7 xl:col-span-7 space-y-6"
          >
            <SeatMap />
          </section>

          {/* Right Column: Sticky Passenger Manager & Cost Breakdown */}
          <aside
            aria-label="Passenger Selection and Summary"
            className="lg:col-span-5 xl:col-span-5 space-y-6 lg:sticky lg:top-24"
          >
            <PassengerSelector />
            <PriceSummary />
          </aside>
        </div>
      </main>

      {/* Mobile Sticky Quick-Bar */}
      <div className="lg:hidden sticky bottom-0 z-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
            Active: {activePassenger?.name}
          </span>
          <div className="text-xs font-semibold text-slate-200">
            {seatedCount}/{passengers.length} Assigned • <span className="text-emerald-400 font-bold">Total: ₹{grandTotal}</span>
          </div>
        </div>
        <button
          onClick={() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
        >
          View Summary
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Frontend Assessment</span>
            <span>•</span>
            <span>Flight Seat Selection & Passenger Management</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>React.js</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Formik + Zod</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BookingProvider>
      <MainAppContent />
    </BookingProvider>
  );
}
