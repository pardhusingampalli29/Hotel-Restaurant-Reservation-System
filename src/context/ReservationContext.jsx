import React, { createContext, useContext, useState, useEffect } from 'react';

const ReservationContext = createContext();

export const useReservations = () => useContext(ReservationContext);

// Initial static table definitions
const INITIAL_TABLES = [
  // Main Dining Room (Mid-screen)
  { id: 1, name: 'T1', seats: 2, zone: 'Main Dining', x: 25, y: 30, shape: 'circle' },
  { id: 2, name: 'T2', seats: 4, zone: 'Main Dining', x: 45, y: 30, shape: 'square' },
  { id: 3, name: 'T3', seats: 4, zone: 'Main Dining', x: 65, y: 30, shape: 'square' },
  { id: 4, name: 'T4', seats: 2, zone: 'Main Dining', x: 85, y: 30, shape: 'circle' },
  { id: 5, name: 'T5', seats: 6, zone: 'Main Dining', x: 35, y: 60, shape: 'rectangle' },
  { id: 6, name: 'T6', seats: 6, zone: 'Main Dining', x: 75, y: 60, shape: 'rectangle' },

  // Outdoor Patio (Top-screen)
  { id: 7, name: 'P1', seats: 2, zone: 'Outdoor Patio', x: 20, y: 20, shape: 'circle' },
  { id: 8, name: 'P2', seats: 4, zone: 'Outdoor Patio', x: 40, y: 20, shape: 'circle' },
  { id: 9, name: 'P3', seats: 4, zone: 'Outdoor Patio', x: 60, y: 20, shape: 'circle' },
  { id: 10, name: 'P4', seats: 2, zone: 'Outdoor Patio', x: 80, y: 20, shape: 'circle' },

  // VIP Booths (Left side)
  { id: 11, name: 'VIP 1', seats: 8, zone: 'VIP Lounge', x: 20, y: 40, shape: 'booth' },
  { id: 12, name: 'VIP 2', seats: 8, zone: 'VIP Lounge', x: 20, y: 75, shape: 'booth' },

  // Bar Counter (Right side)
  { id: 13, name: 'B1', seats: 1, zone: 'Bar Counter', x: 85, y: 20, shape: 'bar' },
  { id: 14, name: 'B2', seats: 1, zone: 'Bar Counter', x: 85, y: 35, shape: 'bar' },
  { id: 15, name: 'B3', seats: 1, zone: 'Bar Counter', x: 85, y: 50, shape: 'bar' },
  { id: 16, name: 'B4', seats: 1, zone: 'Bar Counter', x: 85, y: 65, shape: 'bar' },
  { id: 17, name: 'B5', seats: 1, zone: 'Bar Counter', x: 85, y: 80, shape: 'bar' },
];

export const MENU_ITEMS = [
  { id: 'm1', name: 'Caviar d\'Aquitaine', price: 120, category: 'Appetizers', desc: 'Oscietra caviar, crisp potato galette, crème fraîche & chives.', image: 'caviar' },
  { id: 'm2', name: 'Pan-Seared Foie Gras', price: 85, category: 'Appetizers', desc: 'Caramelized black mission figs, aged balsamic glaze & toasted brioche.', image: 'foie_gras' },
  { id: 'm3', name: 'Truffle Consommé', price: 45, category: 'Appetizers', desc: 'Clarified heirloom root vegetable broth with shaved black winter truffles.', image: 'consomme' },
  { id: 'm4', name: 'Wagyu Beef Tenderloin', price: 165, category: 'Mains', desc: 'A5 Miyazaki Wagyu, wood-fired baby carrots, truffle potato purée & red wine jus.', image: 'wagyu' },
  { id: 'm5', name: 'Maine Lobster Thermidor', price: 140, category: 'Mains', desc: 'Cognac cream sauce, gruyère cheese gratin, served in split lobster shell.', image: 'lobster' },
  { id: 'm6', name: 'Wild Mushroom Risotto', price: 75, category: 'Mains', desc: 'Acquerello rice, chanterelle & porcini mushrooms, parmigiano-reggiano emulsion.', image: 'risotto' },
  { id: 'm7', name: 'Grand Marnier Soufflé', price: 35, category: 'Desserts', desc: 'Traditional warm soufflé with blood orange reduction & house vanilla bean ice cream.', image: 'souffle' },
  { id: 'm8', name: 'Gold Leaf Opera Cake', price: 40, category: 'Desserts', desc: 'Layers of almond sponge, espresso buttercream, dark chocolate ganache & 24k gold leaf.', image: 'opera_cake' },
  { id: 'm9', name: 'Royal Tokaji (Glass)', price: 30, category: 'Cocktails', desc: 'Exquisite Hungarian dessert wine with notes of honey, apricot & ginger.', image: 'tokaji' },
  { id: 'm10', name: 'Smoked Amber Old Fashioned', price: 28, category: 'Cocktails', desc: 'Bourbon, gold leaf flakes, orange bitters, smoked under cherry wood.', image: 'old_fashioned' }
];

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('19:00');
  const [selectedZone, setSelectedZone] = useState('Main Dining');
  const [selectedTables, setSelectedTables] = useState([]); // Array of table IDs
  const [preOrderCart, setPreOrderCart] = useState([]); // Array of { menuItem, qty }

  // Load existing reservations
  useEffect(() => {
    const saved = localStorage.getItem('ambroisie_reservations');
    if (saved) {
      setReservations(JSON.parse(saved));
    } else {
      // Seed some mock reservations for the current day to make the UI look active
      const today = new Date().toISOString().split('T')[0];
      const mockBookings = [
        { id: 'mock-1', userEmail: 'vip@ambroisie.com', date: today, time: '19:00', tableIds: [2], zone: 'Main Dining', guestName: 'Elizabeth Windsor', items: [{ id: 'm1', name: "Caviar d'Aquitaine", price: 120, qty: 2 }] },
        { id: 'mock-2', userEmail: 'guest2@gmail.com', date: today, time: '18:00', tableIds: [8], zone: 'Outdoor Patio', guestName: 'Lord Byron', items: [] },
        { id: 'mock-3', userEmail: 'guest3@gmail.com', date: today, time: '20:00', tableIds: [11], zone: 'VIP Lounge', guestName: 'Alexander W.', items: [] },
      ];
      localStorage.setItem('ambroisie_reservations', JSON.stringify(mockBookings));
      setReservations(mockBookings);
    }
  }, []);

  // Real-time Event Simulator
  useEffect(() => {
    const firstNames = ['Maximilian', 'Sophia', 'François', 'Genevieve', 'Alessandro', 'Tatiana', 'Charles', 'Isabella', 'Henri'];
    const lastNames = ['Rothschild', 'Dupont', 'Laurent', 'Moretti', 'Kensington', 'Vanderbilt', 'Dumont', 'Grimaldi'];
    const zones = ['Main Dining', 'Outdoor Patio', 'VIP Lounge', 'Bar Counter'];

    const triggerEvent = () => {
      const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      const zone = zones[Math.floor(Math.random() * zones.length)];
      const randTable = Math.floor(Math.random() * 17) + 1;
      const hour = Math.floor(Math.random() * 4) + 18; // 18:00 to 21:00
      const minutes = Math.random() > 0.5 ? '00' : '30';
      
      const newEvent = {
        id: Date.now(),
        message: `${name} just reserved Table ${randTable} in the ${zone} for ${hour}:${minutes}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setLiveEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    };

    // Initial event
    triggerEvent();

    const interval = setInterval(triggerEvent, 12000); // Trigger every 12 seconds
    return () => clearInterval(interval);
  }, []);

  // Get occupied table IDs for currently selected date and time
  const getOccupiedTables = () => {
    return reservations
      .filter(r => r.date === selectedDate && r.time === selectedTime)
      .reduce((acc, r) => [...acc, ...r.tableIds], []);
  };

  // Toggle table selection
  const toggleTableSelection = (tableId) => {
    const occupied = getOccupiedTables();
    if (occupied.includes(tableId)) return; // Can't select occupied table

    setSelectedTables(prev => {
      if (prev.includes(tableId)) {
        return prev.filter(id => id !== tableId);
      } else {
        return [...prev, tableId];
      }
    });
  };

  // Add/remove items from pre-order
  const updatePreOrder = (item, qty) => {
    setPreOrderCart(prev => {
      const existing = prev.find(p => p.item.id === item.id);
      if (existing) {
        if (qty <= 0) {
          return prev.filter(p => p.item.id !== item.id);
        }
        return prev.map(p => p.item.id === item.id ? { ...p, qty } : p);
      } else {
        if (qty <= 0) return prev;
        return [...prev, { item, qty }];
      }
    });
  };

  // Create booking
  const createBooking = (userEmail, userName) => {
    if (selectedTables.length === 0) {
      return { success: false, error: 'Please select at least one table.' };
    }

    const occupied = getOccupiedTables();
    const isConflict = selectedTables.some(id => occupied.includes(id));
    if (isConflict) {
      return { success: false, error: 'One or more of the selected tables is already booked for this slot.' };
    }

    const newBooking = {
      id: 'res-' + Math.random().toString(36).substr(2, 9),
      userEmail,
      guestName: userName,
      date: selectedDate,
      time: selectedTime,
      tableIds: selectedTables,
      zone: selectedZone,
      items: preOrderCart.map(c => ({ id: c.item.id, name: c.item.name, price: c.item.price, qty: c.qty }))
    };

    const updated = [...reservations, newBooking];
    localStorage.setItem('ambroisie_reservations', JSON.stringify(updated));
    setReservations(updated);
    
    // Clear selection
    setSelectedTables([]);
    setPreOrderCart([]);
    
    return { success: true, booking: newBooking };
  };

  // Cancel booking
  const cancelBooking = (bookingId) => {
    const updated = reservations.filter(r => r.id !== bookingId);
    localStorage.setItem('ambroisie_reservations', JSON.stringify(updated));
    setReservations(updated);
  };

  return (
    <ReservationContext.Provider value={{
      tables: INITIAL_TABLES,
      reservations,
      liveEvents,
      selectedDate,
      setSelectedDate,
      selectedTime,
      setSelectedTime,
      selectedZone,
      setSelectedZone,
      selectedTables,
      toggleTableSelection,
      preOrderCart,
      updatePreOrder,
      createBooking,
      cancelBooking,
      occupiedTables: getOccupiedTables()
    }}>
      {children}
    </ReservationContext.Provider>
  );
};
