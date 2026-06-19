import React from 'react';
import { useReservations } from '../context/ReservationContext';
import { Check, X, ShieldAlert, Layers } from 'lucide-react';

export default function TableLayoutMap() {
  const { 
    tables, 
    selectedTables, 
    toggleTableSelection, 
    occupiedTables, 
    selectedZone,
    setSelectedZone
  } = useReservations();

  // Filter tables by current zone
  const zoneTables = tables.filter(t => t.zone === selectedZone);

  // Table dimensions helper
  const getTableStyle = (table) => {
    let width = '55px';
    let height = '55px';
    let borderRadius = '8px';

    if (table.shape === 'circle') {
      borderRadius = '50%';
    } else if (table.shape === 'rectangle') {
      width = '90px';
      height = '50px';
    } else if (table.shape === 'booth') {
      width = '100px';
      height = '60px';
      borderRadius = '12px';
    } else if (table.shape === 'bar') {
      width = '35px';
      height = '35px';
      borderRadius = '50%';
    }

    const isOccupied = occupiedTables.includes(table.id);
    const isSelected = selectedTables.includes(table.id);

    let background = 'rgba(26, 26, 34, 0.8)';
    let border = '2px solid var(--border-gold-soft)';
    let cursor = 'pointer';
    let boxShadow = 'none';

    if (isOccupied) {
      background = 'rgba(239, 68, 68, 0.15)';
      border = '2px solid var(--color-danger)';
      cursor = 'not-allowed';
    } else if (isSelected) {
      background = 'var(--gold-gradient)';
      border = '2px solid var(--gold-light)';
      boxShadow = '0 0 15px rgba(212, 175, 55, 0.6)';
    }

    return {
      position: 'absolute',
      left: `${table.x}%`,
      top: `${table.y}%`,
      transform: 'translate(-50%, -50%)',
      width,
      height,
      borderRadius,
      background,
      border,
      boxShadow,
      cursor,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition-smooth)',
      userSelect: 'none',
      color: isSelected ? '#000' : 'var(--text-primary)'
    };
  };

  return (
    <div className="glass-panel animate-slide-in" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Select Your Table</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Click on an available table to book it. Fully interactive map.</p>
        </div>
        
        {/* Zone Selector */}
        <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-gold-soft)' }}>
          {['Main Dining', 'Outdoor Patio', 'VIP Lounge', 'Bar Counter'].map(zone => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              style={{
                background: selectedZone === zone ? 'var(--gold-gradient)' : 'none',
                color: selectedZone === zone ? '#000' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: selectedZone === zone ? '600' : '500',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'var(--transition-smooth)'
              }}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Floor Plan Grid */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '380px',
        backgroundColor: '#070709',
        backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 0)',
        backgroundSize: '24px 24px',
        borderRadius: '12px',
        border: '1px dashed rgba(212, 175, 55, 0.2)',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
      }}>
        {/* Stage / Kitchen label */}
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(212, 175, 55, 0.05)',
          border: '1px solid var(--border-gold-soft)',
          padding: '0.35rem 2rem',
          borderRadius: '20px',
          color: 'var(--gold-primary)',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          fontWeight: 'bold'
        }}>
          {selectedZone === 'Bar Counter' ? 'OPEN KITCHEN' : selectedZone === 'Outdoor Patio' ? 'GARDEN FOUNTAIN' : 'MAIN FOYER & PIANO'}
        </div>

        {/* Dynamic Tables rendering */}
        {zoneTables.map(table => {
          const isOccupied = occupiedTables.includes(table.id);
          const isSelected = selectedTables.includes(table.id);
          
          return (
            <div
              key={table.id}
              style={getTableStyle(table)}
              onClick={() => toggleTableSelection(table.id)}
            >
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{table.name}</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                {table.seats} {table.seats === 1 ? 'Seat' : 'Seats'}
              </span>
              
              {isOccupied && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--color-danger)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  L
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend and stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* Legends */}
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', border: '1px solid var(--border-gold-soft)', background: 'rgba(26, 26, 34, 0.8)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', border: '1px solid var(--color-danger)', background: 'rgba(239, 68, 68, 0.15)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Reserved</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', border: '1px solid var(--gold-light)', background: 'var(--gold-gradient)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Selected</span>
          </div>
        </div>

        {/* Selected Tables Count */}
        <div style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
          {selectedTables.length > 0 ? (
            <span>Selected Tables: {selectedTables.map(id => {
              const t = tables.find(tbl => tbl.id === id);
              return t ? t.name : '';
            }).join(', ')} ({selectedTables.reduce((acc, id) => acc + (tables.find(tbl => tbl.id === id)?.seats || 0), 0)} Guests)</span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>No tables selected</span>
          )}
        </div>
      </div>
    </div>
  );
}
