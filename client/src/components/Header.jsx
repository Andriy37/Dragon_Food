import { NavLink, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ThemeToggle from './ThemeToggle';
import Button from './Button';

export default function Header() {
  const { totalCount, totalPrice, setIsCartOpen } = useStore();

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand">
          <span className="brand__icon">🐉</span>
          <div>
            Dragon<span>Food</span>
          </div>
        </Link>

        <nav className="nav" aria-label="Головна навігація">
          <NavLink to="/" end className="nav__link">
            Головна
          </NavLink>
          <NavLink to="/restaurants" className="nav__link">
            Заклади
          </NavLink>
          <NavLink to="/checkout" className="nav__link">
            Оформлення
          </NavLink>
        </nav>

        <div className="header__actions">
          <ThemeToggle />
          <Button variant="primary" onClick={() => setIsCartOpen(true)}>
            🛍️ Кошик ({totalCount}){totalPrice > 0 ? ` • ${totalPrice} ₴` : ''}
          </Button>
        </div>
      </div>
    </header>
  );
}