export type SeatCategory = 'Standard' | 'Extra Legroom' | 'Premium';

export type SeatPosition = 'window' | 'middle' | 'aisle';

export type AircraftConfigType = '3-2' | '2-3-2';

export interface Seat {
  id: string;               // e.g., "1A"
  row: number;              // 1 to 10
  letter: string;           // "A", "B", etc.
  category: SeatCategory;   // "Standard", "Extra Legroom", "Premium"
  price: number;            // in INR (₹)
  isOccupied: boolean;      // true if already booked by another traveler on flight
  position: SeatPosition;   // "window" | "middle" | "aisle"
  isExitRow?: boolean;      // Exit row flag
  features?: string[];      // e.g. ["Extra 4 inches legroom", "Power outlet"]
}

export type PassengerTitle = 'Mr' | 'Ms' | 'Mrs' | 'Dr';
export type PassengerType = 'Adult' | 'Child';

export interface Passenger {
  id: string;
  name: string;
  title: PassengerTitle;
  type: PassengerType;
  assignedSeatId: string | null;
  selectedMealId: string | null;
}

export type MealCategory = 'Veg' | 'Non-Veg' | 'Special';

export interface Meal {
  id: string;
  name: string;
  category: MealCategory;
  price: number;
  description: string;
  isComplimentary: boolean;
  dietaryTags?: string[];
  calories?: string;
}

export interface AircraftLayoutInfo {
  config: AircraftConfigType;
  name: string;
  aircraftModel: string;
  columnGroups: string[][]; // e.g. [["A","B","C"], ["D","E"]] for 3-2
  totalRows: number;
  seats: Seat[];
}
