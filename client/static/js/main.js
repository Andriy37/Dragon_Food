import { fetchCatalogData, debounce } from './api.js';
import { initTheme, updateCartBadge, addToCart, changeQuantity, getCart, initModal } from './ui.js';
import { initFormValidation } from './form.js';

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  updateCartBadge();
  initModal();
  initFormValidation('order-form');

  const restaurantsContainer = document.getElementById('restaurants-list');
  const dishesContainer = document.getElementById('dishes-list');
  const cartItemsContainer = document.getElementById('cart-items-list');
  const cartTotalEl = document.getElementById('cart-total-sum');

  if (!restaurantsContainer && !dishesContainer) return;

  try {
    if (restaurantsContainer) {
      restaurantsContainer.innerHTML = '<p class="status-msg">Завантаження закладів...</p>';
    }

    const data = await fetchCatalogData();

// --- Рендер каталогу ресторанів + пошук з debounce 300 мс ---
    if (restaurantsContainer) {
      const searchInput = document.getElementById('search-input');
      const sortSelect = document.getElementById('sort-select');
      const urlParams = new URLSearchParams(window.location.search);
      const selectedCategory = urlParams.get('category');

      const renderRestaurants = (list) => {
        if (!list.length) {
          restaurantsContainer.innerHTML = '<p class="status-msg">Закладів за вашим запитом не знайдено.</p>';
          return;
        }
        restaurantsContainer.innerHTML = list
          .map(
            (r) => `
            <article class="card" data-id="${r.id}">
              <img src="${r.image}" alt="${r.name}" width="400" height="240" loading="lazy">
              <div class="card__body">
                <h2><a href="restaurant.html?id=${r.id}">${r.name}</a></h2>
                <p>${r.categoryLabel}</p>
                <p class="card__meta">${r.rating} ★ • ${r.deliveryTimeLabel} • Доставка ${r.deliveryFee === 0 ? '0 грн' : r.deliveryFee + ' грн'}</p>
              </div>
            </article>`
          )
          .join('');
      };

      const applyFilters = () => {
        const query = (searchInput?.value || '').trim().toLowerCase();
        const sortBy = sortSelect?.value || 'rating';

        let filtered = data.restaurants.filter((r) => {
          const matchesCategory = !selectedCategory || r.category === selectedCategory;
          const matchesQuery =
            r.name.toLowerCase().includes(query) || r.categoryLabel.toLowerCase().includes(query);
          return matchesCategory && matchesQuery;
        });
        

        if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
        if (sortBy === 'time') filtered.sort((a, b) => a.deliveryTime - b.deliveryTime);
        if (sortBy === 'fee') filtered = filtered.filter((r) => r.deliveryFee === 0);

        renderRestaurants(filtered);
      };

      applyFilters();
      searchInput?.addEventListener('input', debounce(applyFilters, 300));
      sortSelect?.addEventListener('change', applyFilters);
    }

    // --- Рендер страв закладу та інтерактивного кошика (делегування подій) ---
    if (dishesContainer) {
      const params = new URLSearchParams(window.location.search);
      const restaurantId = Number(params.get('id')) || 1;
      const restaurant = data.restaurants.find((r) => r.id === restaurantId) || data.restaurants[0];
      const dishes = data.dishes.filter((d) => d.restaurantId === restaurant.id);

      const titleEl = document.getElementById('restaurant-name');
      if (titleEl) titleEl.textContent = restaurant.name;

      const renderCartSidebar = () => {
        if (!cartItemsContainer || !cartTotalEl) return;
        const cart = getCart();
        if (!cart.length) {
          cartItemsContainer.innerHTML = '<li>Кошик порожній. Оберіть страви зліва!</li>';
          cartTotalEl.textContent = '0 грн';
          return;
        }
        cartItemsContainer.innerHTML = cart
          .map(
            (item) => `
            <li class="cart-row">
              <span>${item.name} × ${item.quantity}</span>
              <strong>${item.price * item.quantity} грн</strong>
            </li>`
          )
          .join('');
        const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
        cartTotalEl.textContent = `${total} грн`;
      };

      const renderDishes = () => {
        const cart = getCart();
        dishesContainer.innerHTML = dishes
          .map((dish) => {
            const inCart = cart.find((c) => c.id === dish.id);
            const qty = inCart ? inCart.quantity : 0;
            return `
            <article class="dish-card" data-dish-id="${dish.id}">
              <img src="${dish.image}" alt="${dish.name}" width="320" height="200" loading="lazy">
              <div class="dish-card__content">
                <h3>${dish.name}</h3>
                <p>${dish.description} Вага: ${dish.weight}.</p>
                <div class="dish-card__footer">
                  <span class="price">${dish.price} грн</span>
                  ${
                    qty === 0
                      ? `<button type="button" class="btn btn--pill btn--primary" data-action="add" data-id="${dish.id}">Додати +</button>`
                      : `<div class="counter-controls">
                          <button type="button" class="btn btn--pill" data-action="dec" data-id="${dish.id}" aria-label="Зменшити">−</button>
                          <span>${qty}</span>
                          <button type="button" class="btn btn--pill" data-action="inc" data-id="${dish.id}" aria-label="Збільшити">+</button>
                        </div>`
                  }
                </div>
              </div>
            </article>`;
          })
          .join('');
        renderCartSidebar();
      };

      // Делегування подій кліку на картках страв
      dishesContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const dishId = Number(btn.dataset.id);
        const action = btn.dataset.action;
        const dish = dishes.find((d) => d.id === dishId);

        if (action === 'add' || action === 'inc') addToCart(dish);
        if (action === 'dec') changeQuantity(dishId, -1);
        renderDishes();
      });

      renderDishes();
    }
  } catch (err) {
    if (restaurantsContainer) {
      restaurantsContainer.innerHTML = `<p class="status-msg error">Не вдалося завантажити дані: ${err.message}</p>`;
    }
  }
});