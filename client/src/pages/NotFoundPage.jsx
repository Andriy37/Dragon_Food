import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '80px 16px' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--color-primary)' }}>404</h1>
      <p style={{ margin: '12px 0 24px', color: 'var(--color-text-muted)' }}>
        Ой! Такої сторінки не існує або страву вже з'їли.
      </p>
      <Link to="/">
        <Button variant="primary">Повернутися на головну</Button>
      </Link>
    </div>
  );
}