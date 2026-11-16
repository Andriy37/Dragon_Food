import { Link } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurants/${restaurant.id}`} className="card">
      <img src={restaurant.image} alt={restaurant.name} className="card__img" loading="lazy" />
      <div className="card__body">
        <h3 className="card__title">{restaurant.name}</h3>
        <p className="card__desc">{restaurant.categoryLabel}</p>
        <div className="card__meta">
          <span>⭐ {restaurant.rating}</span>
          <span>🕒 {restaurant.deliveryTimeLabel}</span>
          <span style={{ color: 'var(--color-primary)' }}>
            {restaurant.deliveryFee === 0 ? 'Безкоштовно' : `${restaurant.deliveryFee} ₴`}
          </span>
        </div>
      </div>
    </Link>
  );
}