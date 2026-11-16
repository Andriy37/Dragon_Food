import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import Button from './Button';

export default function CheckoutForm({ onSuccess }) {
  const { cart, totalPrice, clearCart } = useStore();
  const [form, setForm] = useState({
    customerName: '',
    phone: '+380',
    street: '',
    house: '',
    entrance: '',
    apartment: '',
    hasIntercom: 'yes',
    comment: '',
  });
  const [errors, setErrors] = useState({});
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const validate = () => {
    const nextErrors = {};
    if (form.customerName.trim().length < 2) nextErrors.customerName = "Введіть коректне ім'я (мін. 2 символи)";
    if (!/^\+380\d{9}$/.test(form.phone.trim())) nextErrors.phone = 'Формат: +380XXXXXXXXX (9 цифр після +380)';
    if (form.street.trim().length < 3) nextErrors.street = 'Вкажіть назву вулиці';
    if (!form.house.trim()) nextErrors.house = 'Вкажіть будинок';
    if (!form.apartment.trim()) nextErrors.apartment = 'Вкажіть квартиру';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const orderPayload = {
      ...form,
      hasIntercom: form.hasIntercom === 'yes',
      items: cart,
      totalPrice,
    };

    // Якщо підключений Node.js сервер (ПР 8), відправляємо на API
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      try {
        await fetch(`${apiUrl}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
      } catch {
        // Fallback на локальне підтвердження, якщо сервер ще не запущено
      }
    }

    setSubmittedOrder(orderPayload);
    clearCart();
  };

  if (submittedOrder) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ fontSize: '3.2rem', marginBottom: '10px' }}>🎉</div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Замовлення прийнято!</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
          Кур'єр вирушить за адресою: <strong>вул. {submittedOrder.street}, буд. {submittedOrder.house}, кв. {submittedOrder.apartment}</strong>
          <br />
          Домофон: <strong>{submittedOrder.hasIntercom ? 'Так' : 'Ні'}</strong>
        </p>
        {onSuccess && (
          <Button variant="primary" onClick={onSuccess}>
            Чудово!
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="cf-name">Ваше ім'я *</label>
        <input
          id="cf-name"
          className="input"
          placeholder="Андрій"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
        />
        {errors.customerName && <div className="error-text">{errors.customerName}</div>}
      </div>

      <div className="form-field">
        <label htmlFor="cf-phone">Телефон *</label>
        <input
          id="cf-phone"
          className="input"
          placeholder="+380991234567"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        {errors.phone && <div className="error-text">{errors.phone}</div>}
      </div>

      <div className="form-field">
        <label htmlFor="cf-street">Вулиця *</label>
        <input
          id="cf-street"
          className="input"
          placeholder="Вулиця Незалежності"
          value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })}
        />
        {errors.street && <div className="error-text">{errors.street}</div>}
      </div>

      <div className="form-grid-3">
        <div className="form-field">
          <label htmlFor="cf-house">Будинок *</label>
          <input
            id="cf-house"
            className="input"
            placeholder="15А"
            value={form.house}
            onChange={(e) => setForm({ ...form, house: e.target.value })}
          />
          {errors.house && <div className="error-text">{errors.house}</div>}
        </div>

        <div className="form-field">
          <label htmlFor="cf-entrance">Під'їзд</label>
          <input
            id="cf-entrance"
            className="input"
            placeholder="2"
            value={form.entrance}
            onChange={(e) => setForm({ ...form, entrance: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label htmlFor="cf-apt">Квартира *</label>
          <input
            id="cf-apt"
            className="input"
            placeholder="42"
            value={form.apartment}
            onChange={(e) => setForm({ ...form, apartment: e.target.value })}
          />
          {errors.apartment && <div className="error-text">{errors.apartment}</div>}
        </div>
      </div>

      <div className="form-field">
        <label>Чи є домофон? *</label>
        <div className="intercom-switch">
          <button
            type="button"
            className={`intercom-switch__btn ${form.hasIntercom === 'yes' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, hasIntercom: 'yes' })}
          >
            Так
          </button>
          <button
            type="button"
            className={`intercom-switch__btn ${form.hasIntercom === 'no' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, hasIntercom: 'no' })}
          >
            Ні
          </button>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="cf-comment">Коментар кур'єру</label>
        <textarea
          id="cf-comment"
          className="textarea"
          rows="2"
          placeholder="Код домофону, поверх або побажання..."
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
      </div>

      <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '6px' }}>
        Підтвердити замовлення {totalPrice > 0 ? `(${totalPrice} ₴)` : ''}
      </Button>
    </form>
  );
}