import { useStore } from '../context/StoreContext';
import Button from './Button';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useStore();
  return (
    <Button variant="ghost" onClick={toggleTheme} aria-label="Перемкнути тему">
      {theme === 'light' ? '🌙 Темна' : '☀️ Світла'}
    </Button>
  );
}