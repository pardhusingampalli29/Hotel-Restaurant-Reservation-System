import React, { useState } from 'react';
import { useHotels } from '../context/HotelContext';
import { MapPin, Building2, Zap, TrendingUp } from 'lucide-react';

export default function HotelsMap() {
  const { hotels, INDIA_LOCATIONS, getAvailableCities } = useHotels();
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [hoveredHotel, setHoveredHotel] = useState(null);

  // Calculate city positions on India map (normalized coordinates)
  const cityPositions = {
    'Delhi': { x: 38, y: 18 },
    'Mumbai': { x: 18, y: 42 },
    'Bangalore': { x: 45, y: 65 },
    'Hyderabad': { x: 48, y: 55 },
    'Kolkata': { x: 65, y: 25 },
    'Chennai': { x: 60, y: 75 },
    'Pune': { x: 30, y: 55 },
    'Ahmedabad': { x: 22, y: 35 },
    'Jaipur': { x: 32, y: 22 },
    'Indore': { x: 35, y: 48 },
    'Lucknow': { x: 48, y: 18 },
    'Kochi': { x: 58, y: 85 },
    'Goa': { x: 12, y: 58 },
    'Udaipur': { x: 28, y: 38 },
    'Manali': { x: 35, y: 5 }
  };

  const hotelsByCity = Object.keys(INDIA_LOCATIONS).map(city => ({
    city,
    count: hotels.filter(h => h.city === city).length,
    hotels: hotels.filter(h => h.city === city),
    position: cityPositions[city] || { x: 50, y: 50 }
  }));

  const getRegionColor = (city) => {
    const location = INDIA_LOCATIONS[city];
    const colors = {
      'North': 'rgba(59, 130, 246, 0.7)',
      'South': 'rgba(239, 68, 68, 0.7)',
      'East': 'rgba(34, 197, 94, 0.7)',
      'West': 'rgba(168, 85, 247, 0.7)',
      'Central': 'rgba(245, 158, 11, 0.7)'
    };
    return colors[location?.region] || 'rgba(139, 92, 246, 0.7)';
  };

  const selectedCityData = hotelsByCity.find(c => c.city === selectedCity);
  const selectedHotels = selectedCityData?.hotels || [];

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
        backgroundImage: 'radial-gradient(ellipse at top right, rgba(168, 85, 247, 0.1) 0%, transparent 60%)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          🗺️ Hotels Across India
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Explore {hotels.length} premium hotels spread across {Object.keys(INDIA_LOCATIONS).length} major cities
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Map Section */}
        <div className="glass-panel" style={{
          flex: '2 1 500px',
          padding: '2rem',
          backgroundImage: 'radial-gradient(ellipse at top right, rgba(168, 85, 247, 0.05) 0%, transparent 60%)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* SVG Map */}
          <svg
            width="100%"
            height="500"
            viewBox="0 0 100 100"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.02)',
              border: '2px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}
          >
            {/* India background shape (simplified) */}
            <defs>
              <linearGradient id="indiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'rgba(168, 85, 247, 0.05)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgba(59, 130, 246, 0.05)', stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            {/* India outline box */}
            <rect x="10" y="5" width="80" height="90" fill="url(#indiaGradient)" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="0.5" rx="2" />

            {/* City markers */}
            {hotelsByCity.map(cityData => (
              <g key={cityData.city}>
                {/* City circle */}
                <circle
                  cx={cityData.position.x}
                  cy={cityData.position.y}
                  r={cityData.count > 0 ? 1.5 + (cityData.count / 4) : 1.5}
                  fill={getRegionColor(cityData.city)}
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="0.3"
                  opacity={selectedCity === cityData.city ? 1 : 0.6}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => setSelectedCity(cityData.city)}
                />

                {/* Hotel count label */}
                {cityData.count > 0 && (
                  <text
                    x={cityData.position.x}
                    y={cityData.position.y + 4}
                    textAnchor="middle"
                    fontSize="1.5"
                    fontWeight="bold"
                    fill="white"
                    pointerEvents="none"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                  >
                    {cityData.count}
                  </text>
                )}

                {/* City name label */}
                <text
                  x={cityData.position.x}
                  y={cityData.position.y - 2.5}
                  textAnchor="middle"
                  fontSize="1"
                  fill={selectedCity === cityData.city ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.7)'}
                  fontWeight={selectedCity === cityData.city ? 'bold' : 'normal'}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => setSelectedCity(cityData.city)}
                >
                  {cityData.city}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
            width: '100%'
          }}>
            {['North', 'South', 'East', 'West', 'Central'].map(region => {
              const color = {
                'North': 'rgba(59, 130, 246, 0.7)',
                'South': 'rgba(239, 68, 68, 0.7)',
                'East': 'rgba(34, 197, 94, 0.7)',
                'West': 'rgba(168, 85, 247, 0.7)',
                'Central': 'rgba(245, 158, 11, 0.7)'
              }[region];
              const count = hotelsByCity.filter(c => INDIA_LOCATIONS[c.city]?.region === region).reduce((sum, c) => sum + c.count, 0);

              return (
                <div key={region} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: color,
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}></div>
                  <span>{region}: {count} hotels</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div style={{
          flex: '1 1 300px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Selected City Stats */}
          <div className="glass-panel" style={{
            padding: '1.5rem',
            backgroundImage: 'radial-gradient(ellipse at top right, rgba(168, 85, 247, 0.1) 0%, transparent 60%)',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <MapPin size={20} /> {selectedCity}
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Hotels</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold-primary)' }}>
                  {selectedHotels.length}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Available Rooms</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>
                  {selectedHotels.reduce((sum, h) => sum + h.availableRooms, 0)}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid rgba(168, 85, 247, 0.2)'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Avg Rating</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {selectedHotels.length > 0
                    ? (selectedHotels.reduce((sum, h) => sum + h.rating, 0) / selectedHotels.length).toFixed(1)
                    : 'N/A'}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Avg Price</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {selectedHotels.length > 0
                    ? `₹${Math.round(selectedHotels.reduce((sum, h) => sum + h.price, 0) / selectedHotels.length).toLocaleString()}`
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="glass-panel" style={{
            padding: '1.5rem',
            backgroundImage: 'radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <h4 style={{
              fontSize: '1rem',
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Zap size={18} /> All India Stats
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Hotels</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--gold-primary)' }}>
                  {hotels.length}
                </span>
              </div>
              <div style={{
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Rooms Available</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#22c55e' }}>
                  {hotels.reduce((sum, h) => sum + h.availableRooms, 0)}
                </span>
              </div>
              <div style={{
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Major Cities</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {getAvailableCities().length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="glass-panel" style={{
            padding: '1.5rem',
            backgroundImage: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <h4 style={{
              fontSize: '1rem',
              color: 'var(--text-primary)',
              marginBottom: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <TrendingUp size={18} /> Real-Time Insights
            </h4>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}>
              <p>✓ Live availability updates every 10 seconds</p>
              <p>✓ Real-time booking notifications</p>
              <p>✓ Dynamic pricing based on demand</p>
              <p>✓ 24/7 customer support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hotels List for Selected City */}
      {selectedHotels.length > 0 && (
        <div className="glass-panel" style={{
          padding: '2rem',
          backgroundImage: 'radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.05) 0%, transparent 60%)',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Building2 size={20} /> Hotels in {selectedCity}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {selectedHotels.map(hotel => (
              <div
                key={hotel.id}
                onMouseEnter={() => setHoveredHotel(hotel.id)}
                onMouseLeave={() => setHoveredHotel(null)}
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: hoveredHotel === hotel.id ? '1px solid var(--gold-primary)' : '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  transform: hoveredHotel === hotel.id ? 'scale(1.05)' : 'scale(1)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{hotel.name}</h4>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--gold-primary)' }}>
                    {hotel.rating}★
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                  {hotel.type} • {hotel.availableRooms} rooms
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: 'var(--gold-primary)'
                }}>
                  ₹{hotel.price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
