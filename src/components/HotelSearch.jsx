import React, { useState } from 'react';
import { useHotels } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, DollarSign, Star, Users, Calendar, Wifi, Dumbbell, Waves, Wind, Home } from 'lucide-react';

export default function HotelSearch() {
  const { user } = useAuth();
  const {
    hotels,
    selectedCity,
    setSelectedCity,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    guests,
    setGuests,
    getAvailableCities,
    searchHotels,
    liveHotelEvents,
    createHotelBooking
  } = useHotels();

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [roomCount, setRoomCount] = useState(1);
  const [filterType, setFilterType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(20000);
  const [minRating, setMinRating] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [bookingMessage, setBookingMessage] = useState('');

  const handleSearch = () => {
    const filters = {
      city: selectedCity,
      type: filterType === 'All' ? null : filterType,
      maxPrice,
      minRating
    };
    const results = searchHotels(filters);
    setSearchResults(results);
    setSelectedHotel(null);
  };

  const handleBookHotel = () => {
    if (!user) {
      setBookingMessage('Please login to book a hotel');
      return;
    }

    if (!selectedHotel) {
      setBookingMessage('Please select a hotel');
      return;
    }

    const result = createHotelBooking(
      user.email,
      selectedHotel.id,
      checkInDate,
      checkOutDate,
      roomCount,
      user.name
    );

    if (result.success) {
      setBookingMessage(`✓ Booking confirmed! Confirmation: ${result.booking.confirmationNumber}`);
      setSelectedHotel(null);
      setSearchResults([]);
      setTimeout(() => setBookingMessage(''), 5000);
    } else {
      setBookingMessage(`✗ ${result.error}`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      animation: 'fade-in 0.4s ease-out',
      paddingBottom: '2rem'
    }}>
      {/* Header */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        backgroundImage: 'radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          🏨 Real-Time Hotel Availability
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Find and book premium hotels across India instantly
        </p>
      </div>

      {/* Live Events */}
      {liveHotelEvents.length > 0 && (
        <div className="glass-panel" style={{
          padding: '1.5rem',
          backgroundImage: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <h3 style={{ color: 'var(--gold-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wind size={18} /> LIVE BOOKINGS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {liveHotelEvents.map(event => (
              <div key={event.id} style={{
                padding: '0.8rem',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: 'var(--text-primary)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{event.message}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Search Panel */}
        <div className="glass-panel" style={{
          flex: '1 1 350px',
          padding: '2rem',
          backgroundImage: 'radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.05) 0%, transparent 60%)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          minWidth: '300px'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={20} /> Search Hotels
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* City Selection */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                textTransform: 'uppercase'
              }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Select City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                {getAvailableCities().map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Check-in & Check-out */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase'
                }}>
                  <Calendar size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase'
                }}>
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            {/* Guests & Rooms */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                textTransform: 'uppercase'
              }}>
                <Users size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Guests & Rooms
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  placeholder="Guests"
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={roomCount}
                  onChange={(e) => setRoomCount(parseInt(e.target.value))}
                  placeholder="Rooms"
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            {/* Filters */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                textTransform: 'uppercase'
              }}>
                <Home size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Hotel Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Types</option>
                <option value="Luxury">Luxury</option>
                <option value="Business">Business</option>
                <option value="Resort">Resort</option>
                <option value="Budget">Budget</option>
                <option value="Heritage">Heritage</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                textTransform: 'uppercase'
              }}>
                <DollarSign size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Max Price: ₹{maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="20000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Rating Filter */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                textTransform: 'uppercase'
              }}>
                <Star size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Min Rating: {minRating.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--gold-primary)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Search size={18} /> Search Hotels
            </button>

            {bookingMessage && (
              <div style={{
                padding: '1rem',
                backgroundColor: bookingMessage.includes('✓') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${bookingMessage.includes('✓') ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
                borderRadius: '8px',
                color: bookingMessage.includes('✓') ? '#22c55e' : '#ef4444',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                {bookingMessage}
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div style={{
          flex: '2 1 500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Hotel Cards */}
          <div style={{
            display: 'grid',
            gap: '1rem',
            maxHeight: '700px',
            overflowY: 'auto'
          }}>
            {searchResults.length > 0 ? (
              searchResults.map(hotel => (
                <div
                  key={hotel.id}
                  onClick={() => setSelectedHotel(hotel)}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    cursor: 'pointer',
                    backgroundImage: 'radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.05) 0%, transparent 60%)',
                    border: selectedHotel?.id === hotel.id 
                      ? '2px solid var(--gold-primary)' 
                      : '1px solid rgba(59, 130, 246, 0.2)',
                    transition: 'all 0.3s ease',
                    transform: selectedHotel?.id === hotel.id ? 'scale(1.01)' : 'scale(1)',
                    boxShadow: selectedHotel?.id === hotel.id 
                      ? '0 8px 24px rgba(212, 175, 55, 0.3)' 
                      : 'none'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                        {hotel.name}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <MapPin size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                        {hotel.city}, {hotel.state}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gold-primary)' }}>
                        ₹{hotel.price.toLocaleString()}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>per night</p>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Star size={16} style={{ color: 'var(--gold-primary)' }} />
                      <span style={{ color: 'var(--text-primary)' }}>{hotel.rating.toFixed(1)}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>({hotel.reviews} reviews)</span>
                    </div>
                    <div style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      color: '#22c55e',
                      fontWeight: '600'
                    }}>
                      {hotel.availableRooms} rooms available
                    </div>
                    <div style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      color: '#3b82f6',
                      fontWeight: '600'
                    }}>
                      {hotel.type}
                    </div>
                  </div>

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    marginBottom: '1rem'
                  }}>
                    {hotel.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '0.8rem',
                    flexWrap: 'wrap',
                    marginBottom: '1rem'
                  }}>
                    {hotel.facilities.slice(0, 5).map((facility, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.8rem',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        color: 'var(--gold-primary)',
                        border: '1px solid rgba(212, 175, 55, 0.3)'
                      }}>
                        {facility}
                      </span>
                    ))}
                    {hotel.facilities.length > 5 && (
                      <span style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                      }}>
                        +{hotel.facilities.length - 5} more
                      </span>
                    )}
                  </div>

                  {selectedHotel?.id === hotel.id && (
                    <button
                      onClick={handleBookHotel}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: 'var(--gold-primary)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      Book Now - ₹{(hotel.price * roomCount).toLocaleString()}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                borderRadius: '12px',
                border: '1px dashed rgba(59, 130, 246, 0.3)'
              }}>
                <Search size={32} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <p>Click "Search Hotels" to find available accommodations in {selectedCity}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
