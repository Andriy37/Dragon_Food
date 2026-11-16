const THEME_KEY = 'dragon-food-theme';
const CART_KEY = 'dragon-food-cart';

// --- Перемикач світлої/темної теми ---
export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }

  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const updateLabel = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggleBtn.textContent = isDark ? '☀️ Світла' : '🌙 Темна';
  };
  updateLabel();

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    updateLabel();
  });
}

// --- Логіка кошика (1..10+ однакових позицій) ---
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

export function addToCart(dish) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === dish.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...dish, quantity: 1 });
  }
  saveCart(cart);
}

export function changeQuantity(dishId, delta) {
  let cart = getCart();
  cart = cart
    .map((item) => (item.id === dishId ? { ...item, quantity: item.quantity + delta } : item))
    .filter((item) => item.quantity > 0);
  saveCart(cart);
}

export function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cart-count').forEach((el) => {
    el.textContent = totalCount;
  });
}

// --- Центральне модальне вікно оформлення замовлення (Esc та клік по фону) ---
export function initModal() {
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  const openButtons = document.querySelectorAll('[data-open-checkout]');
  const closeButtons = modal.querySelectorAll('[data-close-modal]');

  const open = () => {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('input')?.focus();
  };

  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  openButtons.forEach((btn) => btn.addEventListener('click', open));
  closeButtons.forEach((btn) => btn.addEventListener('click', close));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
  }

