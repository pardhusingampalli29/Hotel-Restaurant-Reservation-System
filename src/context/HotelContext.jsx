import React, { createContext, useContext, useState, useEffect } from 'react';

const HotelContext = createContext();

export const useHotels = () => useContext(HotelContext);

// Indian states and cities data
const INDIA_LOCATIONS = {
  'Delhi': { latitude: 28.7041, longitude: 77.1025, region: 'North' },
  'Mumbai': { latitude: 19.0760, longitude: 72.8777, region: 'West' },
  'Bangalore': { latitude: 12.9716, longitude: 77.5946, region: 'South' },
  'Hyderabad': { latitude: 17.3850, longitude: 78.4867, region: 'South' },
  'Kolkata': { latitude: 22.5726, longitude: 88.3639, region: 'East' },
  'Chennai': { latitude: 13.0827, longitude: 80.2707, region: 'South' },
  'Pune': { latitude: 18.5204, longitude: 73.8567, region: 'West' },
  'Ahmedabad': { latitude: 23.0225, longitude: 72.5714, region: 'West' },
  'Jaipur': { latitude: 26.9124, longitude: 75.7873, region: 'North' },
  'Indore': { latitude: 22.7196, longitude: 75.8577, region: 'Central' },
  'Lucknow': { latitude: 26.8467, longitude: 80.9462, region: 'North' },
  'Kochi': { latitude: 9.9312, longitude: 76.2673, region: 'South' },
  'Goa': { latitude: 15.2993, longitude: 73.8243, region: 'West' },
  'Udaipur': { latitude: 24.5854, longitude: 73.7125, region: 'West' },
  'Manali': { latitude: 32.2432, longitude: 77.1892, region: 'North' },
};

// Mock real-time hotel database with REAL Indian Hotels
const INITIAL_HOTELS = [
  // Delhi Hotels
  { id: 'h1', name: 'The Oberoi New Delhi', city: 'Delhi', state: 'Delhi', rating: 4.8, reviews: 2843, price: 14500, image: 'oberoi', facilities: ['WiFi', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar', 'Business Center'], rooms: 280, availableRooms: 34, lat: 28.7041, lon: 77.1025, type: 'Luxury', description: 'Premium luxury hotel in central Delhi with world-class amenities and impeccable service' },
  { id: 'h2', name: 'Taj Palace Hotel Delhi', city: 'Delhi', state: 'Delhi', rating: 4.7, reviews: 2156, price: 13000, image: 'taj', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Bar', 'Spa'], rooms: 400, availableRooms: 42, lat: 28.7041, lon: 77.1025, type: 'Luxury', description: 'Iconic luxury hotel in Lutyens Delhi with elegant rooms and fine dining' },
  { id: 'h3', name: 'ITC Maurya Sheraton Delhi', city: 'Delhi', state: 'Delhi', rating: 4.6, reviews: 1954, price: 11500, image: 'itc', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Business Center'], rooms: 438, availableRooms: 38, lat: 28.7041, lon: 77.1025, type: 'Business', description: 'Premier business hotel with excellent conference facilities' },
  { id: 'h4', name: 'The Leela Palace New Delhi', city: 'Delhi', state: 'Delhi', rating: 4.9, reviews: 3124, price: 15500, image: 'leela', facilities: ['WiFi', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar', 'Concierge'], rooms: 440, availableRooms: 28, lat: 28.7041, lon: 77.1025, type: 'Luxury', description: 'Ultra-luxury palace-style hotel with personalized service' },

  // Mumbai Hotels
  { id: 'h5', name: 'Taj Mahal Palace Mumbai', city: 'Mumbai', state: 'Maharashtra', rating: 4.9, reviews: 3654, price: 17500, image: 'taj_mumbai', facilities: ['WiFi', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar', 'Beachfront'], rooms: 565, availableRooms: 45, lat: 19.0760, lon: 72.8777, type: 'Luxury', description: 'Iconic beachfront luxury hotel overlooking Gateway of India' },
  { id: 'h6', name: 'Oberoi Mumbai', city: 'Mumbai', state: 'Maharashtra', rating: 4.8, reviews: 2876, price: 15000, image: 'oberoi_mumbai', facilities: ['WiFi', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar'], rooms: 450, availableRooms: 32, lat: 19.0760, lon: 72.8777, type: 'Luxury', description: 'Luxury beachfront resort with premium amenities' },
  { id: 'h7', name: 'ITC Maratha Mumbai', city: 'Mumbai', state: 'Maharashtra', rating: 4.7, reviews: 2345, price: 13500, image: 'itc_mumbai', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Conference'], rooms: 350, availableRooms: 29, lat: 19.0760, lon: 72.8777, type: 'Business', description: 'Business hotel with excellent facilities in Mumbai' },

  // Bangalore Hotels
  { id: 'h8', name: 'Leela Palace Bangalore', city: 'Bangalore', state: 'Karnataka', rating: 4.8, reviews: 2654, price: 12500, image: 'leela_blr', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Spa', 'Business Center'], rooms: 320, availableRooms: 31, lat: 12.9716, lon: 77.5946, type: 'Luxury', description: 'Luxury palace-style hotel in Bangalore' },
  { id: 'h9', name: 'Taj West End Bangalore', city: 'Bangalore', state: 'Karnataka', rating: 4.7, reviews: 2187, price: 10500, image: 'taj_blr', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Spa'], rooms: 280, availableRooms: 26, lat: 12.9716, lon: 77.5946, type: 'Luxury', description: 'Heritage luxury hotel in heart of Bangalore' },
  { id: 'h10', name: 'JW Marriott Bangalore', city: 'Bangalore', state: 'Karnataka', rating: 4.6, reviews: 1876, price: 9500, image: 'jw_blr', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant'], rooms: 250, availableRooms: 23, lat: 12.9716, lon: 77.5946, type: 'Business', description: 'Business hotel in Bangalore with modern facilities' },

  // Hyderabad Hotels
  { id: 'h11', name: 'Taj Falaknuma Palace Hyderabad', city: 'Hyderabad', state: 'Telangana', rating: 4.9, reviews: 2543, price: 14500, image: 'taj_falaknuma', facilities: ['WiFi', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar', 'Heritage'], rooms: 150, availableRooms: 18, lat: 17.3850, lon: 78.4867, type: 'Heritage', description: 'Stunning palace hotel with royal heritage and modern luxury' },
  { id: 'h12', name: 'ITC Kohinoor Hyderabad', city: 'Hyderabad', state: 'Telangana', rating: 4.7, reviews: 2154, price: 12000, image: 'itc_hydra', facilities: ['WiFi', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar'], rooms: 210, availableRooms: 25, lat: 17.3850, lon: 78.4867, type: 'Luxury', description: 'Premium luxury hotel in Hyderabad' },
  { id: 'h13', name: 'Oberoi Hyderabad', city: 'Hyderabad', state: 'Telangana', rating: 4.6, reviews: 1876, price: 11000, image: 'oberoi_hydra', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant'], rooms: 190, availableRooms: 21, lat: 17.3850, lon: 78.4867, type: 'Business', description: 'Premium business hotel in tech hub Hyderabad' },

  // Kolkata Hotels
  { id: 'h14', name: 'Oberoi Grand Kolkata', city: 'Kolkata', state: 'West Bengal', rating: 4.8, reviews: 2345, price: 11500, image: 'oberoi_kol', facilities: ['WiFi', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar'], rooms: 220, availableRooms: 28, lat: 22.5726, lon: 88.3639, type: 'Luxury', description: 'Historic luxury hotel in Kolkata' },
  { id: 'h15', name: 'ITC Royal Bengal Kolkata', city: 'Kolkata', state: 'West Bengal', rating: 4.6, reviews: 1654, price: 9500, image: 'itc_kol', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Business Center'], rooms: 180, availableRooms: 19, lat: 22.5726, lon: 88.3639, type: 'Business', description: 'Business hotel in Kolkata' },

  // Chennai Hotels
  { id: 'h16', name: 'Taj Connemara Chennai', city: 'Chennai', state: 'Tamil Nadu', rating: 4.8, reviews: 2187, price: 10500, image: 'taj_chn', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Bar', 'Business Center'], rooms: 160, availableRooms: 19, lat: 13.0827, lon: 80.2707, type: 'Luxury', description: 'Heritage luxury hotel in Chennai' },
  { id: 'h17', name: 'ITC Grand Chola Chennai', city: 'Chennai', state: 'Tamil Nadu', rating: 4.7, reviews: 1876, price: 10000, image: 'itc_chola', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Spa'], rooms: 150, availableRooms: 18, lat: 13.0827, lon: 80.2707, type: 'Luxury', description: 'Premium luxury hotel in Chennai' },

  // Pune Hotels
  { id: 'h18', name: 'Taj Blue Pyramid Pune', city: 'Pune', state: 'Maharashtra', rating: 4.7, reviews: 1765, price: 10000, image: 'taj_pune', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Business Center'], rooms: 160, availableRooms: 20, lat: 18.5204, lon: 73.8567, type: 'Business', description: 'Modern business hotel in Pune' },
  { id: 'h19', name: 'JW Marriott Pune', city: 'Pune', state: 'Maharashtra', rating: 4.6, reviews: 1543, price: 9500, image: 'jw_pune', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Business Center'], rooms: 150, availableRooms: 18, lat: 18.5204, lon: 73.8567, type: 'Business', description: 'Business hotel with modern amenities' },

  // Jaipur Hotels
  { id: 'h20', name: 'Rambagh Palace Jaipur', city: 'Jaipur', state: 'Rajasthan', rating: 4.9, reviews: 2654, price: 14000, image: 'rambagh', facilities: ['WiFi', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Heritage', 'Bar'], rooms: 75, availableRooms: 12, lat: 26.9124, lon: 75.7873, type: 'Heritage', description: 'Iconic former royal palace hotel with heritage charm' },
  { id: 'h21', name: 'Taj Jai Mahal Palace Jaipur', city: 'Jaipur', state: 'Rajasthan', rating: 4.8, reviews: 1987, price: 12500, image: 'taj_jaipur', facilities: ['WiFi', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar'], rooms: 110, availableRooms: 15, lat: 26.9124, lon: 75.7873, type: 'Heritage', description: 'Palace hotel with royal architecture' },
  { id: 'h22', name: 'ITC Rajputana Jaipur', city: 'Jaipur', state: 'Rajasthan', rating: 4.6, reviews: 1654, price: 9500, image: 'itc_jaipur', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Business Center'], rooms: 140, availableRooms: 18, lat: 26.9124, lon: 75.7873, type: 'Business', description: 'Business hotel in Jaipur' },

  // Goa Hotels
  { id: 'h23', name: 'Taj Holiday Village Goa', city: 'Goa', state: 'Goa', rating: 4.7, reviews: 2345, price: 9500, image: 'taj_goa', facilities: ['WiFi', 'Beach Access', 'Pool', 'Restaurant', 'Bar', 'Water Sports', 'Spa'], rooms: 200, availableRooms: 25, lat: 15.2993, lon: 73.8243, type: 'Resort', description: 'Beachfront resort in Goa with water sports activities' },
  { id: 'h24', name: 'The Leela Goa', city: 'Goa', state: 'Goa', rating: 4.8, reviews: 2876, price: 12000, image: 'leela_goa', facilities: ['WiFi', 'Beach Access', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar'], rooms: 300, availableRooms: 32, lat: 15.2993, lon: 73.8243, type: 'Resort', description: 'Ultra-luxury beachfront resort in Goa' },
  { id: 'h25', name: 'Park Hyatt Goa Resort & Spa', city: 'Goa', state: 'Goa', rating: 4.7, reviews: 2154, price: 11000, image: 'hyatt_goa', facilities: ['WiFi', 'Beach Access', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Water Sports'], rooms: 250, availableRooms: 28, lat: 15.2993, lon: 73.8243, type: 'Resort', description: 'Premium beachfront resort with spa' },

  // Udaipur Hotels
  { id: 'h26', name: 'Taj Lake Palace Udaipur', city: 'Udaipur', state: 'Rajasthan', rating: 4.9, reviews: 2987, price: 15000, image: 'taj_lake', facilities: ['WiFi', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar', 'Lake Views'], rooms: 83, availableRooms: 10, lat: 24.5854, lon: 73.7125, type: 'Heritage', description: 'Iconic palace hotel on Lake Pichola' },
  { id: 'h27', name: 'Oberoi Udaipur', city: 'Udaipur', state: 'Rajasthan', rating: 4.8, reviews: 2345, price: 13000, image: 'oberoi_udaipur', facilities: ['WiFi', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar', 'Lake Views'], rooms: 94, availableRooms: 14, lat: 24.5854, lon: 73.7125, type: 'Heritage', description: 'Luxury palace hotel overlooking Lake Pichola' },
  { id: 'h28', name: 'The Leela Palace Udaipur', city: 'Udaipur', state: 'Rajasthan', rating: 4.8, reviews: 1876, price: 12500, image: 'leela_udaipur', facilities: ['WiFi', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar'], rooms: 72, availableRooms: 9, lat: 24.5854, lon: 73.7125, type: 'Heritage', description: 'Palace hotel with heritage architecture' },

  // Manali Hotels
  { id: 'h29', name: 'Span Resorts Manali', city: 'Manali', state: 'Himachal Pradesh', rating: 4.6, reviews: 1543, price: 7500, image: 'span', facilities: ['WiFi', 'Gym', 'Restaurant', 'Mountain View', 'Adventure Activities', 'Bonfire'], rooms: 80, availableRooms: 15, lat: 32.2432, lon: 77.1892, type: 'Resort', description: 'Adventure resort in Manali with outdoor activities' },
  { id: 'h30', name: 'Aleo Aroma Resort Manali', city: 'Manali', state: 'Himachal Pradesh', rating: 4.5, reviews: 1234, price: 6500, image: 'aleo', facilities: ['WiFi', 'Restaurant', 'Mountain View', 'Adventure', 'Spa'], rooms: 60, availableRooms: 12, lat: 32.2432, lon: 77.1892, type: 'Resort', description: 'Cozy mountain resort with adventure activities' },

  // Ahmedabad Hotels
  { id: 'h31', name: 'Hyatt Regency Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', rating: 4.6, reviews: 1654, price: 8500, image: 'hyatt_ahmedabad', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Business Center'], rooms: 180, availableRooms: 21, lat: 23.0225, lon: 72.5714, type: 'Business', description: 'Premium business hotel in Ahmedabad' },
  { id: 'h32', name: 'ITC Narmada Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', rating: 4.5, reviews: 1345, price: 8000, image: 'itc_narmada', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant'], rooms: 140, availableRooms: 18, lat: 23.0225, lon: 72.5714, type: 'Business', description: 'Business hotel with modern amenities' },

  // Lucknow Hotels
  { id: 'h33', name: 'Taj Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', rating: 4.6, reviews: 1345, price: 8500, image: 'taj_lucknow', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Business Center'], rooms: 150, availableRooms: 19, lat: 26.8467, lon: 80.9462, type: 'Business', description: 'Premium hotel in Lucknow' },
  { id: 'h34', name: 'Lebua Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', rating: 4.5, reviews: 987, price: 7500, image: 'lebua', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant'], rooms: 130, availableRooms: 16, lat: 26.8467, lon: 80.9462, type: 'Business', description: 'Modern business hotel' },

  // Kochi Hotels
  { id: 'h35', name: 'Bolgatty Palace & Island Resort', city: 'Kochi', state: 'Kerala', rating: 4.7, reviews: 1876, price: 9000, image: 'bolgatty', facilities: ['WiFi', 'Beach Access', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar'], rooms: 120, availableRooms: 15, lat: 9.9312, lon: 76.2673, type: 'Resort', description: 'Historic palace resort on island in Kochi' },
  { id: 'h36', name: 'Taj Malabar Resort & Spa Kochi', city: 'Kochi', state: 'Kerala', rating: 4.8, reviews: 2154, price: 10500, image: 'taj_kochi', facilities: ['WiFi', 'Beach Access', 'Spa', 'Gym', 'Pool', 'Restaurant', 'Bar'], rooms: 140, availableRooms: 18, lat: 9.9312, lon: 76.2673, type: 'Resort', description: 'Luxury resort with beachfront views' },

  // Indore Hotels
  { id: 'h37', name: 'JW Marriott Indore', city: 'Indore', state: 'Madhya Pradesh', rating: 4.6, reviews: 1234, price: 8000, image: 'jw_indore', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant', 'Business Center'], rooms: 130, availableRooms: 16, lat: 22.7196, lon: 75.8577, type: 'Business', description: 'Business hotel in Indore' },
  { id: 'h38', name: 'Radisson Blu Indore', city: 'Indore', state: 'Madhya Pradesh', rating: 4.5, reviews: 1043, price: 7500, image: 'radisson_indore', facilities: ['WiFi', 'Gym', 'Pool', 'Restaurant'], rooms: 120, availableRooms: 14, lat: 22.7196, lon: 75.8577, type: 'Business', description: 'Modern business hotel' },
];

export const HotelProvider = ({ children }) => {
  const [hotels, setHotels] = useState(() => {
    try {
      const saved = localStorage.getItem('ambroisie_hotels');
      return saved ? JSON.parse(saved) : INITIAL_HOTELS;
    } catch (e) {
      return INITIAL_HOTELS;
    }
  });
  const [hotelBookings, setHotelBookings] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [guests, setGuests] = useState(1);
  const [liveHotelEvents, setLiveHotelEvents] = useState([]);

  // Load bookings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hotel_bookings');
    if (saved) {
      setHotelBookings(JSON.parse(saved));
    }
  }, []);

  // Persist hotels whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ambroisie_hotels', JSON.stringify(hotels));
    } catch (e) {
      // ignore
    }
  }, [hotels]);

  // Real-time hotel activity simulator
  useEffect(() => {
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Neha', 'Arjun', 'Sneha', 'Vikram', 'Ananya'];
    const cities = Object.keys(INDIA_LOCATIONS);
    
    const triggerHotelEvent = () => {
      const name = firstNames[Math.floor(Math.random() * firstNames.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const hotelList = hotels.filter(h => h.city === city);
      if (hotelList.length === 0) return;
      
      const hotel = hotelList[Math.floor(Math.random() * hotelList.length)];
      const roomType = ['Deluxe', 'Premium', 'Standard'][Math.floor(Math.random() * 3)];
      
      const newEvent = {
        id: Date.now(),
        message: `${name} just booked a ${roomType} room at ${hotel.name}, ${city}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hotel: hotel.name,
        city: city
      };

      setLiveHotelEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    };

    triggerHotelEvent();
    const interval = setInterval(triggerHotelEvent, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, [hotels]);

  // Simulate real-time availability changes
  useEffect(() => {
    const interval = setInterval(() => {
      setHotels(prevHotels => 
        prevHotels.map(hotel => ({
          ...hotel,
          availableRooms: Math.max(1, hotel.availableRooms + Math.floor(Math.random() * 5) - 2)
        }))
      );
    }, 10000); // Update availability every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Get hotels by city with real-time filters
  const getHotelsByCity = (city) => {
    return hotels.filter(h => h.city === city).sort((a, b) => b.rating - a.rating);
  };

  // Search hotels by multiple criteria
  const searchHotels = (filters) => {
    return hotels.filter(hotel => {
      const cityMatch = !filters.city || hotel.city === filters.city;
      const priceMatch = !filters.maxPrice || hotel.price <= filters.maxPrice;
      const ratingMatch = !filters.minRating || hotel.rating >= filters.minRating;
      const typeMatch = !filters.type || hotel.type === filters.type;
      const facilityMatch = !filters.facilities || filters.facilities.every(f => hotel.facilities.includes(f));
      
      return cityMatch && priceMatch && ratingMatch && typeMatch && facilityMatch;
    });
  };

  // Create hotel booking
  const createHotelBooking = (userEmail, hotelId, checkIn, checkOut, roomCount, userName) => {
    const hotel = hotels.find(h => h.id === hotelId);
    if (!hotel) {
      return { success: false, error: 'Hotel not found' };
    }

    if (hotel.availableRooms < roomCount) {
      return { success: false, error: 'Not enough rooms available' };
    }

    const booking = {
      id: `booking-${Date.now()}`,
      userEmail,
      userName,
      hotelId,
      hotelImage: hotel.image || null,
      hotelName: hotel.name,
      city: hotel.city,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      roomCount,
      totalPrice: hotel.price * roomCount,
      status: 'Confirmed',
      bookingDate: new Date().toISOString(),
      confirmationNumber: `CONF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };

    const updatedBookings = [...hotelBookings, booking];
    setHotelBookings(updatedBookings);
    localStorage.setItem('hotel_bookings', JSON.stringify(updatedBookings));

    // Update available rooms
    setHotels(prevHotels =>
      prevHotels.map(h =>
        h.id === hotelId
          ? { ...h, availableRooms: h.availableRooms - roomCount }
          : h
      )
    );

    return { success: true, booking };
  };

  // Admin: add a new hotel
  const addHotel = (hotelData) => {
    const id = 'h' + Date.now();
    const newHotel = { id, ...hotelData };
    setHotels(prev => [newHotel, ...prev]);
    return { success: true, hotel: newHotel };
  };

  const updateHotel = (id, updates) => {
    setHotels(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    return { success: true };
  };

  const deleteHotel = (id) => {
    setHotels(prev => prev.filter(h => h.id !== id));
    // also remove any bookings for that hotel
    setHotelBookings(prev => {
      const remaining = prev.filter(b => b.hotelId !== id);
      localStorage.setItem('hotel_bookings', JSON.stringify(remaining));
      return remaining;
    });
    return { success: true };
  };

  // Cancel booking
  const cancelBooking = (bookingId) => {
    const booking = hotelBookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    const updatedBookings = hotelBookings.filter(b => b.id !== bookingId);
    setHotelBookings(updatedBookings);
    localStorage.setItem('hotel_bookings', JSON.stringify(updatedBookings));

    // Restore available rooms
    setHotels(prevHotels =>
      prevHotels.map(h =>
        h.id === booking.hotelId
          ? { ...h, availableRooms: h.availableRooms + booking.roomCount }
          : h
      )
    );

    return { success: true };
  };

  // Get user bookings
  const getUserBookings = (userEmail) => {
    return hotelBookings.filter(b => b.userEmail.toLowerCase() === userEmail.toLowerCase());
  };

  return (
    <HotelContext.Provider
      value={{
        hotels,
        hotelBookings,
        selectedCity,
        setSelectedCity,
        checkInDate,
        setCheckInDate,
        checkOutDate,
        setCheckOutDate,
        guests,
        setGuests,
        liveHotelEvents,
        getHotelsByCity,
        searchHotels,
        createHotelBooking,
        cancelBooking,
        getUserBookings,
        INDIA_LOCATIONS,
        getAvailableCities: () => Object.keys(INDIA_LOCATIONS)
        ,
        addHotel,
        updateHotel,
        deleteHotel
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};
