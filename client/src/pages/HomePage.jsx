import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import RestaurantCard from '../components/RestaurantCard';
import Button from '../components/Button';

const CATEGORIES = [
  { id: 'all', label: '🍽️ Усі заклади' },
  { id: 'burgers', label: '🍔 Бургери' },
  { id: 'pizza', label: '🍕 Піца' },
  { id: 'sushi', label: '🍣 Суші та роли' },
  { id: 'asian', label: '🍜 Азійська кухня' },
  { id: 'desserts', label: '🍰 Десерти' },
];

export default function HomePage() {
  const { data, loading } = useFetch('/data.json');

  return (
    <div className="container">
      <section className="hero">
        <div className="hero__grid">
          <div>
            <span className="badge">⚡ Доставка за 25–35 хв</span>
            <h1>Улюблена їжа з топ-закладів міста прямо до дверей</h1>
            <p>
              Обирай серед найкращих ресторанів: соковиті смеш-бургери, піца на дровах, свіжі роли та десерти. Зручне замовлення без зайвих кліків.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/restaurants">
                <Button variant="primary">Переглянути заклади →</Button>
              </Link>
              <Link to="/restaurants?category=sushi">
                <Button variant="secondary">Замовити суші</Button>
              </Link>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
            alt="Фірмовий бургер Dragon Food"
            className="hero__img"
          />
        </div>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <h2 style={{ marginBottom: '14px' }}>Категорії кухні</h2>
        <div className="pills-row">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={cat.id === 'all' ? '/restaurants' : `/restaurants?category=${cat.id}`}
              className="pill-chip"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: '18px' }}>Популярні заклади сьогодні</h2>
        {loading ? (
          <p>Завантаження закладів...</p>
        ) : (
          <div className="cards-grid">
            {data?.restaurants?.slice(0, 3).map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}