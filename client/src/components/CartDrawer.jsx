import { useStore } from '../context/StoreContext';
import Button from './Button';

export default function CartDrawer() {
  const { cart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen, setIsCheckoutOpen } = useStore();

  if (!isCartOpen) return null;

  const handleProceed = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="backdrop backdrop--right" onClick={() => setIsCartOpen(false)}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} aria-label="Кошик замовлення">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Ваш кошик</h2>
          <Button variant="ghost" onClick={() => setIsCartOpen(false)}>✕</Button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '40px' }}>
              Кошик поки порожній. Оберіть смачні страви в закладах!
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--color-border)',
                  gap: '10px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{item.price * item.quantity} ₴</div>
                </div>
                <div className="counter">
                  <button type="button" className="counter__btn" onClick={() => updateQuantity(item.id, -1)}>−</button>
                  <span className="counter__val">{item.quantity}</span>
                  <button type="button" className="counter__btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ paddingTop: '18px', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, marginBottom: '14px' }}>
              <span>Разом:</span>
              <span>{totalPrice} ₴</span>
            </div>
            <Button variant="primary" style={{ width: '100%' }} onClick={handleProceed}>
              Оформити замовлення →
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
}
