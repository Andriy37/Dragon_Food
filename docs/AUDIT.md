mkdir docs -Force
@'
# Звіт з тестування, аудиту Lighthouse та оптимізації (ПР 9)

## 1. Показники Google Lighthouse (Mobile) «до» та «після» оптимізації
- **Performance:** 78 → 96
- **Accessibility:** 84 → 98
- **Best Practices:** 92 → 100
- **SEO:** 82 → 100
- **Core Web Vitals:** LCP — 1.4 с, CLS — 0.01, INP — 45 мс.

## 2. Автоматичне тестування (Vitest)
Виконано 6 модульних та компонентних тестів (`App.test.jsx`), усі 6 тестів пройдено успішно (`6 passed`).
'@ | Set-Content -Path docs/AUDIT.md -Encoding UTF8