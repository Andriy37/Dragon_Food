import { useStore } from '../context/StoreContext';
import CheckoutForm from '../components/CheckoutForm';

export default function CheckoutPage() {
  const { cart, totalPrice } = useStore();

  return (
    <div className="container" style={{ paddingTop: '32px', maxWidth: '640px' }}>
      <h1 style={{ marginBottom: '20px' }}>Оформлення замовлення</h1>

      {cart.length > 0 && (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ marginBottom: '10px' }}>Обрані позиції:</h3>
          {cart.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span>{item.name} × {item.quantity}</span>
              <strong>{item.price * item.quantity} ₴</strong>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '10px', paddingTop: '10px', fontWeight: 800 }}>
            Разом до сплати: {totalPrice} ₴
          </div>
        </div>
      )}

      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
        }}
      >
        <CheckoutForm />
      </div>
    </div>
  );
}