import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import RestaurantCard from '../components/RestaurantCard';

const CATEGORIES = [
  { id: 'all', label: 'Усі' },
  { id: 'burgers', label: '🍔 Бургери' },
  { id: 'pizza', label: '🍕 Піца' },
  { id: 'sushi', label: '🍣 Суші' },
  { id: 'asian', label: '🍜 Азія' },
  { id: 'desserts', label: '🍰 Десерти' },
];

export default function RestaurantsPage() {
  const { data, loading, error } = useFetch('/data.json');
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    document.title = 'Заклади доставки — Dragon Food';
  }, []);

  const restaurants = data?.restaurants || [];

  const filtered = restaurants
    .filter((r) => {
      const byCat = activeCategory === 'all' || r.category === activeCategory;
      const byQuery =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.categoryLabel.toLowerCase().includes(search.toLowerCase());
      return byCat && byQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'time') return a.deliveryTime - b.deliveryTime;
      if (sortBy === 'fee') return a.deliveryFee - b.deliveryFee;
      return 0;
    });

  return (
    <div className="container" style={{ paddingTop: '28px' }}>
      <h1 style={{ marginBottom: '18px' }}>Усі заклади доставки</h1>

      <div className="pills-row">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`pill-chip ${activeCategory === c.id ? 'active' : ''}`}
            onClick={() => setSearchParams(c.id === 'all' ? {} : { category: c.id })}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="filters-bar">
        <input
          type="search"
          className="input"
          style={{ flex: 2, minWidth: '240px' }}
          placeholder="Пошук ресторану..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select"
          style={{ flex: 1, minWidth: '180px' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="rating">За рейтингом ⭐</option>
          <option value="time">Найшвидша доставка ⚡</option>
          <option value="fee">Найдешевша доставка 💸</option>
        </select>
      </div>

      {loading && <p>Завантаження списку ресторанів...</p>}
      {error && <p className="error-text">Помилка: {error}</p>}

      {!loading && filtered.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Нічого не знайдено за вашим запитом.</p>
      ) : (
        <div className="cards-grid">
          {filtered.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}