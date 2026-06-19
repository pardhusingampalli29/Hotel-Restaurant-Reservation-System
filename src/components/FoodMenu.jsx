import React, { useState } from 'react';
import { useReservations, MENU_ITEMS } from '../context/ReservationContext';
import { Utensils, Search, Plus, Minus, FileText, Wine, IceCream, Pizza } from 'lucide-react';

export default function FoodMenu() {
  const { preOrderCart, updatePreOrder } = useReservations();
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories list
  const categories = ['All', 'Appetizers', 'Mains', 'Desserts', 'Cocktails'];

  // Filter items
  const filteredItems = activeCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  // Cart total calculations
  const subtotal = preOrderCart.reduce((sum, cartItem) => sum + (cartItem.item.price * cartItem.qty), 0);
  const tax = subtotal * 0.08; // 8% Luxury Tax
  const serviceCharge = subtotal * 0.10; // 10% Service Charge
  const total = subtotal + tax + serviceCharge;

  // Get item quantity in cart
  const getItemQty = (itemId) => {
    const found = preOrderCart.find(c => c.item.id === itemId);
    return found ? found.qty : 0;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Appetizers': return <Pizza size={14} />;
      case 'Mains': return <Utensils size={14} />;
      case 'Desserts': return <IceCream size={14} />;
      case 'Cocktails': return <Wine size={14} />;
      default: return <Utensils size={14} />;
    }
  };

  return (
    <div className="glass-panel animate-slide-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Pre-Order Fine Dining</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Skip the wait. Select courses to add directly to your reservation.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'row', flexWrap: 'wrap' }}>
        {/* Menu Items Area */}
        <div style={{ flex: '2 1 450px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Categories Tab Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.02)',
                  color: activeCategory === cat ? '#000' : 'var(--text-secondary)',
                  border: activeCategory === cat ? '1px solid var(--gold-light)' : '1px solid var(--border-gold-soft)',
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-sans)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {cat !== 'All' && getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: '0.5rem'
          }}>
            {filteredItems.map(item => {
              const qty = getItemQty(item.id);
              
              return (
                <div 
                  key={item.id}
                  style={{
                    backgroundColor: 'rgba(18, 18, 22, 0.5)',
                    border: qty > 0 ? '1px solid var(--gold-primary)' : '1px solid var(--border-gold-soft)',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    transition: 'var(--transition-smooth)',
                    boxShadow: qty > 0 ? '0 0 10px rgba(212, 175, 55, 0.1)' : 'none'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: '0.95rem', color: 'var(--gold-primary)', fontWeight: 'bold' }}>
                        ${item.price}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: '1.4' }}>
                      {item.desc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {item.category}
                    </span>

                    {/* Quantity selectors */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: 'var(--bg-primary)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-gold-soft)' }}>
                      <button
                        onClick={() => updatePreOrder(item, qty - 1)}
                        style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '12px', textAlign: 'center' }}>
                        {qty}
                      </span>
                      <button
                        onClick={() => updatePreOrder(item, qty + 1)}
                        style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pre-order Cart Summary Panel (Right side) */}
        <div style={{
          flex: '1 1 280px',
          backgroundColor: 'rgba(10, 10, 12, 0.8)',
          border: '1px solid var(--border-gold-soft)',
          borderRadius: '10px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '280px'
        }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              <FileText size={16} />
              <span>Pre-order Folio</span>
            </h4>

            {preOrderCart.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '2rem 0' }}>
                No dishes selected. You can complete reservation without pre-ordering.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '180px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.25rem' }}>
                {preOrderCart.map(cartItem => (
                  <div key={cartItem.item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {cartItem.qty}x {cartItem.item.name}
                    </span>
                    <span style={{ color: 'var(--gold-light)', fontWeight: 500 }}>
                      ${cartItem.item.price * cartItem.qty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {preOrderCart.length > 0 && (
            <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Luxury Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Service Charge (10%)</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gold-primary)', fontWeight: 'bold', fontSize: '0.95rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                <span>Total Pre-Order Est.</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
