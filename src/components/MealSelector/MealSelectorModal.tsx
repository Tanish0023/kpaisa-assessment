import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useBooking } from '../../context/BookingContext';
import { MealCategory } from '../../types';
import { Check, Sparkles, Leaf, Drumstick, Apple, X } from 'lucide-react';

interface MealSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPassengerId?: string;
}

export const MealSelectorModal: React.FC<MealSelectorModalProps> = ({
  isOpen,
  onClose,
  targetPassengerId
}) => {
  const {
    passengers,
    activePassenger,
    meals,
    assignMeal
  } = useBooking();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | MealCategory>('All');

  // Passenger to assign meal to
  const passenger = targetPassengerId
    ? passengers.find((p) => p.id === targetPassengerId) || activePassenger
    : activePassenger;

  if (!passenger) return null;

  const currentMealId = passenger.selectedMealId;

  const filteredMeals = meals.filter((m) => {
    if (activeCategoryFilter === 'All') return true;
    return m.category === activeCategoryFilter;
  });

  const handleSelectMeal = (mealId: string | null) => {
    assignMeal(passenger.id, mealId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="In-Flight Dining & Meal Selection"
      subtitle={`Choose a meal preference for ${passenger.title}. ${passenger.name}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        {/* Active traveler info & Filter tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['All', 'Veg', 'Non-Veg', 'Special'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategoryFilter === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat === 'Veg' ? '🥬 Vegetarian' : cat === 'Non-Veg' ? '🍗 Non-Veg' : cat === 'Special' ? '🥗 Special' : 'All Options'}
              </button>
            ))}
          </div>

          {currentMealId && (
            <button
              type="button"
              onClick={() => handleSelectMeal(null)}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 transition-colors self-start sm:self-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove Meal Selection</span>
            </button>
          )}
        </div>

        {/* Meal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[50vh] overflow-y-auto pr-1">
          {filteredMeals.map((meal) => {
            const isSelected = currentMealId === meal.id;

            return (
              <div
                key={meal.id}
                onClick={() => handleSelectMeal(meal.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/60 shadow-lg shadow-blue-600/20'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-700">
                        {meal.category === 'Veg' && <Leaf className="w-4 h-4 text-emerald-400" />}
                        {meal.category === 'Non-Veg' && <Drumstick className="w-4 h-4 text-amber-400" />}
                        {meal.category === 'Special' && <Apple className="w-4 h-4 text-rose-400" />}
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                          {meal.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">{meal.category} Cuisine</span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        meal.price === 0
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {meal.price === 0 ? 'FREE' : `₹${meal.price}`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {meal.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {meal.dietaryTags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800"
                      >
                        {tag}
                      </span>
                    ))}
                    {meal.calories && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {meal.calories}
                      </span>
                    )}
                  </div>

                  <div className="shrink-0 ml-2">
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/30">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        Selected
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800">
                        Choose
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & Done button */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Complimentary meals are ₹0; gourmet upgrades add directly to the total.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/20 self-end sm:self-auto"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
