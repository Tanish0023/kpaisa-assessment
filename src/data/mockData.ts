import { AircraftLayoutInfo, Meal, Seat, SeatCategory, SeatPosition } from '../types';

// Helper to generate 3-2 layout seats
const generate32Seats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = 10;
  const letters = ['A', 'B', 'C', 'D', 'E'];

  // Explicit occupied seats for 3-2 to demonstrate non-selectable state
  const occupiedSet = new Set(['1D', '3B', '4E', '6A', '7C', '8B', '9E']);

  for (let r = 1; r <= rows; r++) {
    const isExit = r === 5;

    for (const l of letters) {
      const id = `${r}${l}`;
      let position: SeatPosition = 'middle';
      if (l === 'A' || l === 'E') position = 'window';
      else if (l === 'C' || l === 'D') position = 'aisle';

      let category: SeatCategory = 'Standard';
      let price = 0;

      // Exact matches from PDF specification
      if (id === '1A') { category = 'Standard'; price = 0; }
      else if (id === '1B') { category = 'Standard'; price = 0; }
      else if (id === '1C') { category = 'Extra Legroom'; price = 350; }
      else if (id === '1D') { category = 'Standard'; price = 0; }
      else if (id === '1E') { category = 'Premium'; price = 250; }
      else if (id === '2A') { category = 'Extra Legroom'; price = 350; }
      else if (id === '2B') { category = 'Standard'; price = 0; }
      // Additional rows pattern
      else if (r === 1 || r === 2) {
        if (l === 'C' || l === 'D') { category = 'Extra Legroom'; price = 350; }
        else { category = 'Premium'; price = 250; }
      } else if (isExit) {
        category = 'Extra Legroom';
        price = 400;
      } else if (r <= 4) {
        if (l === 'A' || l === 'E') { category = 'Premium'; price = 250; }
        else if (l === 'C' || l === 'D') { category = 'Extra Legroom'; price = 350; }
        else { category = 'Standard'; price = 0; }
      } else {
        // Rows 6-10: mostly standard with some paid window/aisle
        if ((r === 6 || r === 8) && (l === 'A' || l === 'E')) {
          category = 'Premium';
          price = 200;
        } else {
          category = 'Standard';
          price = 0;
        }
      }

      seats.push({
        id,
        row: r,
        letter: l,
        category,
        price,
        isOccupied: occupiedSet.has(id),
        position,
        isExitRow: isExit,
        features: [
          position === 'window' ? 'Window view' : position === 'aisle' ? 'Easy aisle access' : 'Standard comfort',
          category === 'Extra Legroom' ? '+4 inches extra legroom' : category === 'Premium' ? 'Priority boarding & drink' : 'Standard recline'
        ]
      });
    }
  }

  return seats;
};

// Helper to generate 2-3-2 layout seats
const generate232Seats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = 10;
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  // Explicit occupied seats for 2-3-2
  const occupiedSet = new Set(['1C', '2E', '3A', '4G', '5D', '6B', '7F', '8C', '9A', '10E']);

  for (let r = 1; r <= rows; r++) {
    const isExit = r === 5;

    for (const l of letters) {
      const id = `${r}${l}`;
      let position: SeatPosition = 'middle';
      if (l === 'A' || l === 'G') position = 'window';
      else if (l === 'B' || l === 'C' || l === 'E' || l === 'F') position = 'aisle';

      let category: SeatCategory = 'Standard';
      let price = 0;

      // Pricing logic for wide-body 2-3-2
      if (r === 1) {
        category = 'Extra Legroom';
        price = 450;
      } else if (isExit) {
        category = 'Extra Legroom';
        price = 400;
      } else if (r <= 3) {
        if (l === 'A' || l === 'G') { category = 'Premium'; price = 300; }
        else if (l === 'B' || l === 'C' || l === 'E' || l === 'F') { category = 'Extra Legroom'; price = 350; }
        else { category = 'Standard'; price = 0; }
      } else {
        // Rows 4, 6-10
        if (l === 'D') {
          // Center seat is free
          category = 'Standard';
          price = 0;
        } else if ((r === 6 || r === 8) && (l === 'A' || l === 'G')) {
          category = 'Premium';
          price = 250;
        } else {
          category = 'Standard';
          price = 0;
        }
      }

      seats.push({
        id,
        row: r,
        letter: l,
        category,
        price,
        isOccupied: occupiedSet.has(id),
        position,
        isExitRow: isExit,
        features: [
          position === 'window' ? 'Window view' : position === 'aisle' ? 'Aisle convenience' : 'Center comfort',
          category === 'Extra Legroom' ? '+4 inches legroom' : category === 'Premium' ? 'Priority cabin service' : 'Ergonomic seat'
        ]
      });
    }
  }

  return seats;
};

export const AIRCRAFT_CONFIGS: Record<string, AircraftLayoutInfo> = {
  '3-2': {
    config: '3-2',
    name: 'Airbus A220-300 (Regional Express)',
    aircraftModel: 'A220-300',
    columnGroups: [['A', 'B', 'C'], ['D', 'E']],
    totalRows: 10,
    seats: generate32Seats()
  },
  '2-3-2': {
    config: '2-3-2',
    name: 'Boeing 767-300ER (Wide-Body Transcon)',
    aircraftModel: 'B767-300ER',
    columnGroups: [['A', 'B'], ['C', 'D', 'E'], ['F', 'G']],
    totalRows: 10,
    seats: generate232Seats()
  }
};

export const MOCK_MEALS: Meal[] = [
  {
    id: 'meal-comp-veg',
    name: 'Standard Vegetarian Platter',
    category: 'Veg',
    price: 0,
    description: 'Fresh paneer butter masala, jeera basmati rice, yellow dal tadka, warm soft roti, and dessert.',
    isComplimentary: true,
    dietaryTags: ['Vegetarian', 'Nut-Free'],
    calories: '520 kcal'
  },
  {
    id: 'meal-comp-nonveg',
    name: 'Standard Non-Vegetarian Platter',
    category: 'Non-Veg',
    price: 0,
    description: 'Tender chicken curry cooked with aromatic spices, steamed basmati rice, dal, and whole wheat paratha.',
    isComplimentary: true,
    dietaryTags: ['Halal', 'Non-Vegetarian'],
    calories: '610 kcal'
  },
  {
    id: 'meal-comp-fruit',
    name: 'Seasonal Fresh Fruit Bowl',
    category: 'Special',
    price: 0,
    description: 'Refreshing medley of seasonal sliced fruits, dragonfruit, fresh kiwi, grapes, and mint garnish.',
    isComplimentary: true,
    dietaryTags: ['Vegan', 'Gluten-Free', 'Low Calorie'],
    calories: '180 kcal'
  },
  {
    id: 'meal-biryani',
    name: 'Royal Awadhi Dum Biryani',
    category: 'Non-Veg',
    price: 400,
    description: 'Chef\'s signature slow-cooked saffron basmati rice with succulent boneless chicken, served with burani raita and salan.',
    isComplimentary: false,
    dietaryTags: ['Chef Special', 'Non-Veg'],
    calories: '740 kcal'
  },
  {
    id: 'meal-south-thali',
    name: 'Grand Chettinad Veg Thali',
    category: 'Veg',
    price: 350,
    description: 'Traditional South Indian feast: Paneer Chettinad, poriyal, tempered curd rice, rasam shot, appalam & payasam.',
    isComplimentary: false,
    dietaryTags: ['Authentic Regional', 'Vegetarian'],
    calories: '650 kcal'
  },
  {
    id: 'meal-continental',
    name: 'Continental Grilled Herb Chicken',
    category: 'Non-Veg',
    price: 450,
    description: 'Herb-crusted grilled chicken breast with rosemary jus, thyme roasted baby potatoes, and sauteed greens.',
    isComplimentary: false,
    dietaryTags: ['Gourmet', 'High Protein'],
    calories: '580 kcal'
  },
  {
    id: 'meal-deli-box',
    name: 'Artisan Cheese & Sourdough Deli Box',
    category: 'Veg',
    price: 250,
    description: 'Smoked gouda & vintage cheddar on grilled artisan sourdough, served with truffle chips and Belgian brownie.',
    isComplimentary: false,
    dietaryTags: ['Vegetarian', 'Snack Box'],
    calories: '490 kcal'
  },
  {
    id: 'meal-vegan-bowl',
    name: 'Mediterranean Spiced Quinoa Bowl',
    category: 'Special',
    price: 300,
    description: 'Crisp herbed falafel, avocado, pomegranate pearls, kalamata olives, creamy hummus, and ancient grains.',
    isComplimentary: false,
    dietaryTags: ['Vegan', 'Gluten-Free', 'High Fiber'],
    calories: '430 kcal'
  }
];

export const INITIAL_PASSENGERS = [
  {
    id: 'p-1',
    name: 'John Doe',
    title: 'Mr' as const,
    type: 'Adult' as const,
    assignedSeatId: null,
    selectedMealId: null
  },
  {
    id: 'p-2',
    name: 'Sarah Smith',
    title: 'Ms' as const,
    type: 'Adult' as const,
    assignedSeatId: null,
    selectedMealId: null
  }
];
