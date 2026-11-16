import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import CheckoutForm from './CheckoutForm';
import Button from './Button';

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen } = useStore();

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') setIsCheckoutOpen(false);
    };
    if (isCheckoutOpen) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isCheckoutOpen, setIsCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  return (
    <div className="backdrop backdrop--center" onClick={() => setIsCheckoutOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-checkout-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 id="modal-checkout-title">Оформлення доставки</h2>
          <Button variant="ghost" onClick={() => setIsCheckoutOpen(false)}>✕</Button>
        </div>
        <CheckoutForm onSuccess={() => setIsCheckoutOpen(false)} />
      </div>
    </div>
  );
}
