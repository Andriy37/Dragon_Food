import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useStore } from '../context/StoreContext';
import DishCard from '../components/DishCard';
import Button from '../components/Button';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const { data, loading } = useFetch('/data.json');
  const { totalCount, totalPrice, setIsCheckoutOpen } = useStore();

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '32px' }}>
        <p>Завантаження меню закладу...</p>
      </div>
    );
  }

  const restaurant = data?.restaurants?.find((r) => r.id === Number(id));
  const dishes = data?.dishes?.filter((d) => d.restaurantId === Number(id)) || [];

  if (!restaurant) {
    return (
      <div className="container" style={{ paddingTop: '32px' }}>
        <h1>Заклад не знайдено</h1>
        <Link to="/restaurants">
          <Button variant="primary" style={{ marginTop: '16px' }}>← Повернутися до закладів</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '28px' }}>
      <Link to="/restaurants" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
        ← Усі заклади
      </Link>

      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          margin: '16px 0 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ marginBottom: '6px' }}>{restaurant.name}</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>{restaurant.description}</p>
          <p style={{ fontWeight: 600, marginTop: '10px', fontSize: '0.92rem' }}>
            ⭐ {restaurant.rating} • 🕒 {restaurant.deliveryTimeLabel} • Мін. замовлення: {restaurant.minOrder} ₴
          </p>
        </div>

        {totalCount > 0 && (
          <Button variant="primary" onClick={() => setIsCheckoutOpen(true)}>
            Оформити замовлення ({totalCount} шт. • {totalPrice} ₴)
          </Button>
        )}
      </div>

      <h2 style={{ marginBottom: '18px' }}>Меню закладу</h2>
      <div className="cards-grid">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
}