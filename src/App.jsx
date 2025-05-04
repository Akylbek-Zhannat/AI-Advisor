import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { FaLightbulb, FaSyncAlt, FaHeart } from 'react-icons/fa';

function AdvicePage() {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAdvice = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://api.adviceslip.com/advice');
      if (!res.ok) throw new Error('Сеть не отвечает');
      const data = await res.json();
      setAdvice(data.slip);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdvice(); }, []);

  const addFavorite = () => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (advice && !saved.some(item => item.id === advice.id)) {
      saved.push(advice);
      localStorage.setItem('favorites', JSON.stringify(saved));
    }
  };

  return (
    <div className="container">
      <h1 className="title"><FaLightbulb /> Совет дня</h1>
      {loading && <div className="spinner" />}
      {error && <div className="error">{error}</div>}
      {advice && !loading && (
        <div className="card">
          <div className="advice-text">“{advice.advice}”</div>
          <div className="actions">
            <button onClick={fetchAdvice} className="btn primary"><FaSyncAlt /> Еще</button>
            <button onClick={addFavorite} className="btn accent"><FaHeart /> В избранное</button>
          </div>
        </div>
      )}
    </div>
  );
}

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  useEffect(() => { setFavorites(JSON.parse(localStorage.getItem('favorites') || '[]')); }, []);
  const removeFav = id => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <div className="container">
      <h1 className="title"><FaHeart /> Избранное</h1>
      {!favorites.length
        ? <div className="empty">Нет сохранённых советов.</div>
        : favorites.map(item => (
          <div key={item.id} className="card fav">
            <div className="advice-text">“{item.advice}”</div>
            <button onClick={() => removeFav(item.id)} className="btn remove">Удалить</button>
          </div>
        ))
      }
    </div>
  );
}

export default function App() {
  return (
    <>
      <nav className="nav">
        <NavLink to="/" end>Совет дня</NavLink>
        <NavLink to="/favorites">Избранное</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<AdvicePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </>
  );
}
