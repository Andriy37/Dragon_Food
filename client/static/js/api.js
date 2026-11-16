const DATA_URL = './data/data.json';

export async function fetchCatalogData() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Помилка завантаження даних: HTTP ${response.status}`);
  }
  return await response.json();
}

export function debounce(fn, delay = 300) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}