import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useHotels } from '../context/HotelContext';
import { Calendar, MapPin, Users, DollarSign, Trash2, Phone, Mail, MapPinIcon } from 'lucide-react';

export default function HotelBookings() {
  const { user } = useAuth();
  const { getUserBookings, cancelBooking, hotels } = useHotels();

  if (!user) {
    return (
      <div className="glass-panel" style={{
        padding: '3rem',
        textAlign: 'center',
        backgroundImage: 'radial-gradient(ellipse at top right, rgba(212, 175, 55, 0.1) 0%, transparent 60%)',
        border: '1px solid var(--border-gold-glow)'
      }}>
        <h2 style={{ color: 'var(--gold-primary)', marginBottom: '1rem' }}>Hotel Bookings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Please login to view your hotel bookings</p>
      </div>
    );
  }

  const bookings = getUserBookings(user.email);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
    }
  };

  const getHotelDetails = (hotelId) => {
    return hotels.find(h => h.id === hotelId);
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      animation: 'fade-in 0.4s ease-out'
    }}>
      {/* Header */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        backgroundImage: 'radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            🏨 My Hotel Bookings
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage your active reservations across India
          </p>
        </div>
        <div style={{
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          padding: '1rem 2rem',
          borderRadius: '12px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Total Bookings
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold-primary)' }}>
            {bookings.length}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {bookings.map(booking => {
            const hotel = getHotelDetails(booking.hotelId);
            const nights = calculateNights(booking.checkInDate, booking.checkOutDate);

            return (
              <div
                key={booking.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  backgroundImage: 'radial-gradient(ellipse at top right, rgba(34, 197, 94, 0.05) 0%, transparent 60%)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                {/* Confirmation & Status */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      {booking.hotelName}
                    </h3>
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--gold-primary)',
                      fontWeight: '600',
                      fontFamily: 'monospace'
                    }}>
                      {booking.confirmationNumber}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: '#22c55e'
                  }}>
                    ✓ {booking.status}
                  </div>
                </div>

                {/* Hotel Location */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <MapPin size={16} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {booking.city}
                  </span>
                </div>

                {/* Dates */}
                <div style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Calendar size={16} style={{ color: 'var(--gold-primary)' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Check-in: <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} style={{ color: 'var(--gold-primary)' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Check-out: <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--gold-primary)',
                    fontWeight: '600'
                  }}>
                    {nights} Night{nights > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Rooms & Guests */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rooms</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      {booking.roomCount}
                    </div>
                  </div>
                  <div style={{
                    height: '1px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    flex: 1,
                    alignSelf: 'center'
                  }}></div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Price</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--gold-primary)' }}>
                      ₹{booking.totalPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span>Price per room/night:</span>
                    <span>₹{hotel ? hotel.price.toLocaleString() : 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Rooms × Nights × Price:</span>
                    <span>{booking.roomCount} × {nights} × ₹{hotel ? hotel.price : 'N/A'}</span>
                  </div>
                </div>

                {/* Booking Info */}
                <div style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  borderLeft: '3px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <div>Booked on: {new Date(booking.bookingDate).toLocaleDateString()}</div>
                  <div>Guest: {booking.userName}</div>
                </div>

                {/* Cancel Button */}
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                  }}
                >
                  <Trash2 size={16} /> Cancel Booking
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{
          padding: '3rem',
          textAlign: 'center',
          backgroundImage: 'radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.05) 0%, transparent 60%)',
          border: '1px dashed rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏨</div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Hotel Bookings Yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Start exploring hotels across India to make your first booking!
          </p>
        </div>
      )}
    </div>
  );
}
