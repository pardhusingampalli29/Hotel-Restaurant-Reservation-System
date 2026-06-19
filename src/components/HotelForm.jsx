import React, { useState, useEffect } from 'react';
import { useHotels } from '../context/HotelContext';

export default function HotelForm({ editing, onDone }) {
  const { addHotel, updateHotel } = useHotels();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState(1000);
  const [image, setImage] = useState('');
  const [type, setType] = useState('Luxury');
  const [rating, setRating] = useState(4.5);

  useEffect(() => {
    if (editing) {
      setName(editing.name || '');
      setCity(editing.city || '');
      setPrice(editing.price || 0);
      setImage(editing.image || '');
      setType(editing.type || 'Luxury');
      setRating(editing.rating || 4.5);
    } else {
      setName(''); setCity(''); setPrice(1000); setImage(''); setType('Luxury'); setRating(4.5);
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, city, price: Number(price), image, type, rating: Number(rating), availableRooms: 10 };
    if (editing) {
      updateHotel(editing.id, payload);
      onDone?.();
    } else {
      addHotel(payload);
    }
    // clear form
    setName(''); setCity(''); setPrice(1000); setImage(''); setType('Luxury'); setRating(4.5);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <input placeholder="Hotel name" value={name} onChange={e => setName(e.target.value)} className="form-input" style={{ minWidth: 200 }} required />
      <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="form-input" style={{ width: 140 }} required />
      <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} className="form-input" style={{ width: 120 }} required />
      <input placeholder="Image URL or asset name" value={image} onChange={e => setImage(e.target.value)} className="form-input" style={{ width: 200 }} />
      <select value={type} onChange={e => setType(e.target.value)} className="form-input" style={{ width: 140 }}>
        <option>Luxury</option>
        <option>Business</option>
        <option>Resort</option>
        <option>Heritage</option>
      </select>
      <input placeholder="Rating" type="number" step="0.1" min="0" max="5" value={rating} onChange={e => setRating(e.target.value)} className="form-input" style={{ width: 100 }} />
      <button className="btn-primary" type="submit">{editing ? 'Update' : 'Add Hotel'}</button>
    </form>
  );
}
