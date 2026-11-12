import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { AircraftConfigType, AircraftLayoutInfo, Meal, Passenger, Seat } from '../types';
import { AIRCRAFT_CONFIGS, INITIAL_PASSENGERS, MOCK_MEALS } from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

interface BookingContextType {
  // Config
  activeConfig: AircraftConfigType;
  currentLayout: AircraftLayoutInfo;
  switchConfig: (config: AircraftConfigType) => void;

  // Passengers
  passengers: Passenger[];
  activePassengerId: string;
  activePassenger: Passenger | undefined;
  setActivePassengerId: (id: string) => void;
  setPassengerCount: (count: number) => void;
  updatePassengers: (updated: Passenger[]) => void;
  updateSinglePassenger: (id: string, updates: Partial<Passenger>) => void;

  // Seat Assignment
  assignSeatToActivePassenger: (seatId: string) => void;
  removeSeat: (passengerId: string) => void;
  getSeatById: (seatId: string) => Seat | undefined;
  getPassengerBySeatId: (seatId: string) => Passenger | undefined;

  // Meals
  meals: Meal[];
  assignMeal: (passengerId: string, mealId: string | null) => void;
  getMealById: (mealId: string) => Meal | undefined;

  // Pricing
  totalSeatCost: number;
  totalMealCost: number;
  grandTotal: number;

  // Feedback / Toasts
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;

  // Reset
  resetAll: () => void;
  autoAssignAvailableSeats: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeConfig, setActiveConfig] = useState<AircraftConfigType>('3-2');
  const [passengers, setPassengers] = useState<Passenger[]>(INITIAL_PASSENGERS);
  const [activePassengerId, setActivePassengerId] = useState<string>(INITIAL_PASSENGERS[0].id);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const currentLayout = useMemo(() => AIRCRAFT_CONFIGS[activeConfig], [activeConfig]);

  // Toast Helper
  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Passenger Lookup
  const activePassenger = useMemo(
    () => passengers.find((p) => p.id === activePassengerId) || passengers[0],
    [passengers, activePassengerId]
  );

  // Seat Helpers
  const getSeatById = useCallback(
    (seatId: string): Seat | undefined => {
      return currentLayout.seats.find((s) => s.id === seatId);
    },
    [currentLayout]
  );

  const getPassengerBySeatId = useCallback(
    (seatId: string): Passenger | undefined => {
      return passengers.find((p) => p.assignedSeatId === seatId);
    },
    [passengers]
  );

  // Meal Helpers
  const meals = MOCK_MEALS;
  const getMealById = useCallback((mealId: string): Meal | undefined => {
    return MOCK_MEALS.find((m) => m.id === mealId);
  }, []);

  // Change Passenger Count
  const setPassengerCount = useCallback(
    (count: number) => {
      const clamped = Math.max(1, Math.min(9, count));
      setPassengers((prev) => {
        if (clamped === prev.length) return prev;
        if (clamped > prev.length) {
          const added: Passenger[] = [];
          for (let i = prev.length + 1; i <= clamped; i++) {
            added.push({
              id: `p-${i}-${Date.now().toString().slice(-4)}`,
              name: `Passenger ${i}`,
              title: 'Mr',
              type: 'Adult',
              assignedSeatId: null,
              selectedMealId: null
            });
          }
          showToast(`Updated to ${clamped} passengers.`, 'info');
          return [...prev, ...added];
        } else {
          // Truncating: check if active passenger is removed
          const sliced = prev.slice(0, clamped);
          if (!sliced.some((p) => p.id === activePassengerId)) {
            setActivePassengerId(sliced[0].id);
          }
          showToast(`Passenger count reduced to ${clamped}.`, 'info');
          return sliced;
        }
      });
    },
    [activePassengerId, showToast]
  );

  // Bulk update from Formik
  const updatePassengers = useCallback(
    (updated: Passenger[]) => {
      setPassengers(updated);
      if (!updated.some((p) => p.id === activePassengerId) && updated.length > 0) {
        setActivePassengerId(updated[0].id);
      }
      showToast('Passenger details successfully updated.', 'success');
    },
    [activePassengerId, showToast]
  );

  // Single passenger update
  const updateSinglePassenger = useCallback((id: string, updates: Partial<Passenger>) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  // Seat Assignment to Active Passenger
  const assignSeatToActivePassenger = useCallback(
    (seatId: string) => {
      if (!activePassenger) {
        showToast('Please select a passenger first before choosing a seat.', 'warning');
        return;
      }

      const seat = currentLayout.seats.find((s) => s.id === seatId);
      if (!seat) {
        showToast(`Seat ${seatId} does not exist in this layout.`, 'error');
        return;
      }

      // Check if seat is occupied (unselectable)
      if (seat.isOccupied) {
        showToast(`Seat ${seatId} is occupied and cannot be selected.`, 'error');
        return;
      }

      // Check if seat is already assigned to the CURRENT passenger -> Toggle/Remove
      if (activePassenger.assignedSeatId === seatId) {
        setPassengers((prev) =>
          prev.map((p) => (p.id === activePassenger.id ? { ...p, assignedSeatId: null } : p))
        );
        showToast(`Removed seat ${seatId} from ${activePassenger.name}.`, 'info');
        return;
      }

      // Check if seat is already assigned to ANOTHER passenger
      const existingHolder = passengers.find(
        (p) => p.assignedSeatId === seatId && p.id !== activePassenger.id
      );

      if (existingHolder) {
        showToast(
          `Seat ${seatId} is already assigned to ${existingHolder.name}. Each seat can only be assigned to one passenger.`,
          'warning'
        );
        return;
      }

      // Assign seat to active passenger (replaces previous seat if any)
      const previousSeat = activePassenger.assignedSeatId;
      setPassengers((prev) =>
        prev.map((p) => (p.id === activePassenger.id ? { ...p, assignedSeatId: seatId } : p))
      );

      if (previousSeat) {
        showToast(
          `Changed seat for ${activePassenger.name} from ${previousSeat} to ${seatId} (${seat.category} - ${seat.price === 0 ? 'FREE' : '₹' + seat.price}).`,
          'success'
        );
      } else {
        showToast(
          `Assigned seat ${seatId} (${seat.category} - ${seat.price === 0 ? 'FREE' : '₹' + seat.price}) to ${activePassenger.name}.`,
          'success'
        );
      }
    },
    [activePassenger, currentLayout, passengers, showToast]
  );

  // Remove Seat explicitly
  const removeSeat = useCallback(
    (passengerId: string) => {
      const target = passengers.find((p) => p.id === passengerId);
      if (!target || !target.assignedSeatId) return;

      const seatId = target.assignedSeatId;
      setPassengers((prev) =>
        prev.map((p) => (p.id === passengerId ? { ...p, assignedSeatId: null } : p))
      );
      showToast(`Seat ${seatId} removed from ${target.name}.`, 'info');
    },
    [passengers, showToast]
  );

  // Meal Assignment
  const assignMeal = useCallback(
    (passengerId: string, mealId: string | null) => {
      const target = passengers.find((p) => p.id === passengerId);
      if (!target) return;

      const meal = mealId ? MOCK_MEALS.find((m) => m.id === mealId) : null;
      setPassengers((prev) =>
        prev.map((p) => (p.id === passengerId ? { ...p, selectedMealId: mealId } : p))
      );

      if (meal) {
        showToast(
          `Selected ${meal.name} (${meal.price === 0 ? 'FREE' : '₹' + meal.price}) for ${target.name}.`,
          'success'
        );
      } else {
        showToast(`Meal option removed for ${target.name}.`, 'info');
      }
    },
    [passengers, showToast]
  );

  // Switch Configuration
  const switchConfig = useCallback(
    (newConfig: AircraftConfigType) => {
      if (newConfig === activeConfig) return;

      const newLayout = AIRCRAFT_CONFIGS[newConfig];
      const validSeats = new Map(newLayout.seats.map((s) => [s.id, s]));

      let reassignmentsCount = 0;
      let lostCount = 0;

      const updated = passengers.map((p) => {
        if (!p.assignedSeatId) return p;
        const targetSeat = validSeats.get(p.assignedSeatId);

        // If seat exists in new layout and is not occupied
        if (targetSeat && !targetSeat.isOccupied) {
          reassignmentsCount++;
          return p;
        } else {
          lostCount++;
          return { ...p, assignedSeatId: null };
        }
      });

      setActiveConfig(newConfig);
      setPassengers(updated);

      if (lostCount > 0) {
        showToast(
          `Switched to ${newLayout.name}. ${lostCount} seat assignment(s) were unavailable in this configuration and have been cleared.`,
          'warning'
        );
      } else {
        showToast(`Switched configuration to ${newLayout.name}.`, 'info');
      }
    },
    [activeConfig, passengers, showToast]
  );

  // Reset All
  const resetAll = useCallback(() => {
    setPassengers((prev) =>
      prev.map((p) => ({
        ...p,
        assignedSeatId: null,
        selectedMealId: null
      }))
    );
    showToast('All seat and meal selections have been cleared.', 'info');
  }, [showToast]);

  // Convenience helper: Auto assign available seats for all unseated passengers
  const autoAssignAvailableSeats = useCallback(() => {
    const unassigned = passengers.filter((p) => !p.assignedSeatId);
    if (unassigned.length === 0) {
      showToast('All passengers already have assigned seats.', 'info');
      return;
    }

    const occupiedSeatIds = new Set(
      currentLayout.seats.filter((s) => s.isOccupied).map((s) => s.id)
    );
    const assignedSeatIds = new Set(
      passengers.map((p) => p.assignedSeatId).filter(Boolean) as string[]
    );

    const availableSeats = currentLayout.seats.filter(
      (s) => !occupiedSeatIds.has(s.id) && !assignedSeatIds.has(s.id)
    );

    if (availableSeats.length < unassigned.length) {
      showToast('Not enough available seats left on this flight!', 'error');
      return;
    }

    let seatIdx = 0;
    const newPassengerList = passengers.map((p) => {
      if (p.assignedSeatId) return p;
      const nextSeat = availableSeats[seatIdx++];
      return { ...p, assignedSeatId: nextSeat.id };
    });

    setPassengers(newPassengerList);
    showToast(`Assigned seats to ${unassigned.length} passenger(s).`, 'success');
  }, [currentLayout, passengers, showToast]);

  // Pricing Calculations
  const { totalSeatCost, totalMealCost, grandTotal } = useMemo(() => {
    let seatTotal = 0;
    let mealTotal = 0;

    for (const p of passengers) {
      if (p.assignedSeatId) {
        const seat = currentLayout.seats.find((s) => s.id === p.assignedSeatId);
        if (seat) seatTotal += seat.price;
      }
      if (p.selectedMealId) {
        const meal = MOCK_MEALS.find((m) => m.id === p.selectedMealId);
        if (meal) mealTotal += meal.price;
      }
    }

    return {
      totalSeatCost: seatTotal,
      totalMealCost: mealTotal,
      grandTotal: seatTotal + mealTotal
    };
  }, [passengers, currentLayout]);

  const value: BookingContextType = {
    activeConfig,
    currentLayout,
    switchConfig,
    passengers,
    activePassengerId,
    activePassenger,
    setActivePassengerId,
    setPassengerCount,
    updatePassengers,
    updateSinglePassenger,
    assignSeatToActivePassenger,
    removeSeat,
    getSeatById,
    getPassengerBySeatId,
    meals,
    assignMeal,
    getMealById,
    totalSeatCost,
    totalMealCost,
    grandTotal,
    toasts,
    dismissToast,
    showToast,
    resetAll,
    autoAssignAvailableSeats
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
