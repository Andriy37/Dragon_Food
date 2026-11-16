const PHONE_REGEX = /^\+380\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const inputs = Array.from(form.querySelectorAll('input[required], select[required], textarea'));

  const getErrorEl = (input) => {
    let errorEl = document.getElementById(`${input.id}-error`);
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.id = `${input.id}-error`;
      errorEl.className = 'field-error';
      errorEl.setAttribute('aria-live', 'polite');
      input.setAttribute('aria-describedby', errorEl.id);
      input.insertAdjacentElement('afterend', errorEl);
    }
    return errorEl;
  };

  const validateField = (input) => {
    const val = input.value.trim();
    const errorEl = getErrorEl(input);
    let message = '';

    if (input.hasAttribute('required') && !val) {
      message = 'Це поле обов’язкове для заповнення';
    } else if (input.name === 'phone' && !PHONE_REGEX.test(val)) {
      message = 'Введіть номер у форматі +380XXXXXXXXX (напр. +380991234567)';
    } else if (input.type === 'email' && val && !EMAIL_REGEX.test(val)) {
      message = 'Введіть коректну email-адресу';
    } else if (input.minLength > 0 && val.length < input.minLength) {
      message = `Мінімальна довжина — ${input.minLength} символи`;
    }

    errorEl.textContent = message;
    input.setAttribute('aria-invalid', Boolean(message));
    return !message;
  };

  const updateSubmitState = () => {
    const allValid = inputs.every((inp) => validateField(inp));
    if (submitBtn) submitBtn.disabled = !allValid;
    return allValid;
  };

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      validateField(input);
      updateSubmitState();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!updateSubmitState()) return;

    const formData = new FormData(form);
    const hasIntercom = formData.get('hasIntercom') === 'yes' ? 'Так' : 'Ні';
    alert(
      `Замовлення успішно оформлено!\nОтримувач: ${formData.get('customerName')}\nАдреса: вул. ${formData.get('street')}, буд. ${formData.get('house')}, кв. ${formData.get('apartment')}\nДомофон: ${hasIntercom}`
    );
    localStorage.removeItem('dragon-food-cart');
    form.reset();
    updateSubmitState();
  });
}