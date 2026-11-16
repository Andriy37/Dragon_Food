import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StoreProvider } from './context/StoreContext';
import CheckoutForm from './components/CheckoutForm';
import Button from './components/Button';

describe('Dragon Food — Модульне та компонентне тестування', () => {
  it('1. Коректно рендерить компонент кнопки Button із текстом', () => {
    render(<Button variant="primary">Оформити замовлення</Button>);
    expect(screen.getByRole('button', { name: /Оформити замовлення/i })).toBeInTheDocument();
  });

  it('2. Відображає всі поля форми адреси доставки та перемикач домофону', () => {
    render(
      <StoreProvider>
        <CheckoutForm />
      </StoreProvider>
    );
    expect(screen.getByLabelText(/Ваше ім'я/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Телефон/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Вулиця/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Так' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ні' })).toBeInTheDocument();
  });

  it('3. Показує помилки валідації при спробі відправити порожню форму', () => {
    render(
      <StoreProvider>
        <CheckoutForm />
      </StoreProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Підтвердити замовлення/i }));
    expect(screen.getByText(/Введіть коректне ім'я/i)).toBeInTheDocument();
    expect(screen.getByText(/Вкажіть назву вулиці/i)).toBeInTheDocument();
  });

  it('4. Відхиляє некоректний формат українського номера телефону', () => {
    render(
      <StoreProvider>
        <CheckoutForm />
      </StoreProvider>
    );
    const phoneInput = screen.getByLabelText(/Телефон/i);
    fireEvent.change(phoneInput, { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: /Підтвердити замовлення/i }));
    expect(screen.getByText(/Формат: \+380XXXXXXXXX/i)).toBeInTheDocument();
  });

  it('5. Перемикає стан домофону між "Так" та "Ні"', () => {
    render(
      <StoreProvider>
        <CheckoutForm />
      </StoreProvider>
    );
    const noBtn = screen.getByRole('button', { name: 'Ні' });
    fireEvent.click(noBtn);
    expect(noBtn).toHaveClass('active');
  });

  it('6. Успішно підтверджує замовлення при коректному заповненні всіх полів', async () => {
    render(
      <StoreProvider>
        <CheckoutForm />
      </StoreProvider>
    );
    fireEvent.change(screen.getByLabelText(/Ваше ім'я/i), { target: { value: 'Андрій' } });
    fireEvent.change(screen.getByLabelText(/Телефон/i), { target: { value: '+380991234567' } });
    fireEvent.change(screen.getByLabelText(/Вулиця/i), { target: { value: 'Незалежності' } });
    fireEvent.change(screen.getByLabelText(/Будинок/i), { target: { value: '15А' } });
    fireEvent.change(screen.getByLabelText(/Квартира/i), { target: { value: '42' } });
    fireEvent.click(screen.getByRole('button', { name: /Підтвердити замовлення/i }));

    expect(await screen.findByText(/Замовлення прийнято!/i)).toBeInTheDocument();
  });
});