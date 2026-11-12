# AeroSelect – Flight Seat Selection & Passenger Management

A modern, responsive, and robust flight seat selection and passenger management system built for the Frontend Developer Assessment. The application allows users to configure travelers, explore cabin seating configurations, assign and modify seats with real-time pricing updates, and select in-flight meals.

---

## 🚀 Live Demo & Repository

- **GitHub Repository**: [kpaisa-assessment](https://github.com/Tanish0023/kpaisa-assessment)
- **Deployment Ready**: [kpaisa.tanishportfolio.in](http://kpaisa.tanishportfolio.in/)

---

## 🛠️ Technology Stack

- **React.js (v18)** – Component-driven user interface.
- **TypeScript** – Strict type safety across models, layouts, seats, and pricing tiers.
- **Tailwind CSS** – High-performance responsive styling with custom aviation theme.
- **Formik** – Form state management for passenger details and traveler count.
- **Zod** – Schema validation guaranteeing name validity and passenger count limits.
- **Lucide React** – Crisp, modern iconography.
- **Local React State (Context API)** – Deterministic, predictable application state management without external backend dependencies.

---

## 📐 Architecture & Features

### 1. Passenger Selection & Profile Management
- Dynamically adjust traveler count (from 1 to 9 passengers).
- Edit traveler titles (`Mr`, `Ms`, `Mrs`, `Dr`), full names, and categories (`Adult`, `Child`) through a dedicated modal powered by **Formik** and validated in real time with **Zod**.
- Active passenger switching: Click any passenger card to make them active.
- Seamlessly retains all previous seat and meal assignments when switching travelers.

### 2. Dual Aircraft Cabin Layouts
Switch effortlessly between two standard commercial aviation layouts:
- **Configuration 1 (3–2 Layout)**: Single aisle with 3 seats on the left (`A`, `B`, `C`) and 2 seats on the right (`D`, `E`) across 10 rows.
- **Configuration 2 (2–3–2 Layout)**: Twin aisle with 2 seats on the left (`A`, `B`), 3 center seats (`C`, `D`, `E`), and 2 seats on the right (`F`, `G`) across 10 rows.
- Realistic fuselage visualization including flight deck/cockpit, emergency exit doors (Row 5), wing indicators, galleys, and lavatories.

### 3. Dynamic Seat States & Pricing Tiers
- **Available Free (₹0)**: Standard seating with zero fee.
- **Extra Legroom (₹350 / ₹400)**: Highlighted in indigo, with emergency exit rows clearly marked.
- **Premium (₹250 / ₹300)**: Front rows and premium window/aisle seating.
- **Active Passenger Selected**: Vibrant blue with glowing halo and checkmark.
- **Assigned to Another Traveler**: Distinct outline displaying the assigned passenger's name.
- **Occupied / Booked**: Disabled, locked, and non-selectable with strike-through styling.
- **Sample Pricing Verification**: Incorporates all assessment sample seats (`1A=₹0`, `1B=₹0`, `1C=₹350`, `1D=₹0`, `1E=₹250`, `2A=₹350`, `2B=₹0`).

### 4. Passenger-to-Seat Assignment Logic
- **Selection Rule**: Clicking an available seat assigns it directly to the active passenger.
- **Reassignment / Change**: Clicking another available seat cleanly frees the previously held seat and reassigns the new one.
- **Unassign / Removal**: Clicking the active passenger's own assigned seat unassigns it. Additionally, a dedicated `(X)` quick-remove button is provided on each passenger card.
- **Mutual Exclusivity**: Each passenger can hold at most one seat; a seat can never be double-booked by multiple passengers.
- **Occupied Seat Protection**: Occupied seats are unclickable and trigger feedback alerts if clicked.

### 5. Bonus Feature: In-Flight Meal Selection
- Filterable meal catalog:
  - **Complimentary Options (₹0)**: Standard Vegetarian Platter, Standard Non-Vegetarian Platter, Seasonal Fruit Bowl.
  - **Gourmet Paid Options**: Royal Awadhi Dum Biryani (₹400), Chettinad Thali (₹350), Continental Herb Chicken (₹450), Artisan Cheese Sourdough Deli Box (₹250), Mediterranean Quinoa Bowl (₹300).
- Itemized in the passenger summary and dynamically added to the total cost.

### 6. Real-Time Pricing & Cost Breakdown
- Dynamic subtotal for seats and meals updated instantaneously.
- Itemized passenger-by-passenger receipt card.
- Interactive "Confirm Selection" modal presenting a full booking itinerary summary.

---

## 🧠 State Management & Seat Assignment Explanation

Application state is centralized in `src/context/BookingContext.tsx` using React's Context API with immutable state transitions:

```text
[BookingProvider]
  ├── passengers: Passenger[]
  │     ├── id, name, title, type
  │     ├── assignedSeatId: string | null
  │     └── selectedMealId: string | null
  ├── activePassengerId: string
  ├── activeConfig: '3-2' | '2-3-2'
  ├── toasts: ToastMessage[]
  └── calculated totals (totalSeatCost, totalMealCost, grandTotal)
```

### Seat Assignment Workflow:
1. **Passenger Context**: State tracks `activePassengerId`. Seat interactions always target this active passenger.
2. **Availability Check**: When a seat `S` is clicked:
   - If `S.isOccupied === true`: Operation is rejected; error toast alert is displayed.
   - If `activePassenger.assignedSeatId === S.id`: Toggle behavior removes the seat assignment.
   - If `passengers.some(p => p.assignedSeatId === S.id && p.id !== activePassenger.id)`: Duplicate assignment is prevented; warning toast alert informs the user that the seat belongs to another traveler.
   - Otherwise: The seat is assigned to the active passenger, freeing any seat previously held by that passenger.
3. **Configuration Switching**:
   - When switching between 3–2 and 2–3–2 configurations, valid seat assignments that exist in both layouts are retained. If an assigned seat does not exist or is occupied in the new configuration, it is cleanly cleared and a notification is displayed.
4. **Immediate Cost Computation**:
   - `totalSeatCost` and `totalMealCost` are memoized (`useMemo`) and computed directly from `passengers`, `currentLayout.seats`, and `MOCK_MEALS`. Any seat click or meal change recalculates the total instantaneously without race conditions.

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Tanish0023/kpaisa-assessment.git

# Navigate into the project directory
cd kpaisa-assessment

# Install dependencies
npm install

# Start the local development server
npm run dev
```

---

## 📁 Project Structure

```text
kpaisa-assessment/
├── src/
│   ├── components/
│   │   ├── Header.tsx                          # Flight details & brand bar
│   │   ├── MealSelector/
│   │   │   └── MealSelectorModal.tsx          # In-flight dining selection (Bonus)
│   │   ├── PassengerManager/
│   │   │   ├── PassengerFormModal.tsx         # Formik + Zod traveler config modal
│   │   │   └── PassengerSelector.tsx          # Passenger cards & seat assignment controls
│   │   ├── SeatMap/
│   │   │   ├── SeatItem.tsx                   # Interactive seat with states & tooltips
│   │   │   ├── SeatLegend.tsx                 # Pricing tier & status legend
│   │   │   └── SeatMap.tsx                    # Aircraft fuselage & layout switcher
│   │   ├── Summary/
│   │   │   └── PriceSummary.tsx               # Itemized cost breakdown & confirmation
│   │   └── ui/
│   │       ├── Modal.tsx                      # Accessible modal dialog
│   │       └── ToastContainer.tsx             # Interactive toast notification system
│   ├── context/
│   │   └── BookingContext.tsx                 # Core application state & assignment logic
│   ├── data/
│   │   └── mockData.ts                        # 3-2 & 2-3-2 mock layouts, seats, meals
│   ├── types/
│   │   └── index.ts                           # TypeScript interfaces and types
│   ├── App.tsx                                # Main application workspace
│   ├── index.css                              # Tailwind base & animations
│   └── main.tsx                               # React root entrypoint
├── index.html                                 # HTML template with Google Fonts
├── package.json                               # Dependencies & scripts
├── tailwind.config.js                         # Tailwind configuration
├── tsconfig.json                              # TypeScript configuration
└── vite.config.ts                             # Vite configuration
```