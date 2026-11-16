import { useStore } from '../context/StoreContext';
import Button from './Button';

export default function DishCard({ dish }) {
  const { cart, addToCart, updateQuantity } = useStore();
  const inCart = cart.find((item) => item.id === dish.id);
  const qty = inCart ? inCart.quantity : 0;

  return (
    <article className="card">
      <img src={dish.image} alt={dish.name} className="card__img" loading="lazy" />
      <div className="card__body">
        <h3 className="card__title">{dish.name}</h3>
        <p className="card__desc">
          {dish.description} <small>({dish.weight})</small>
        </p>
        <div className="card__meta">
          <span className="price">{dish.price} ₴</span>
          {qty === 0 ? (
            <Button variant="primary" onClick={() => addToCart(dish)} style={{ padding: '8px 18px' }}>
              Додати +
            </Button>
          ) : (
            <div className="counter">
              <button type="button" className="counter__btn" onClick={() => updateQuantity(dish.id, -1)} aria-label="Зменшити">
                −
              </button>
              <span className="counter__val">{qty}</span>
              <button type="button" className="counter__btn" onClick={() => updateQuantity(dish.id, 1)} aria-label="Збільшити">
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}