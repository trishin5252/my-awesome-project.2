// Минимальная валидация формы
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

// Функция для показа ошибок
function showError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error';
    errorElement.textContent = message;
    errorElement.style.color = '#b00020';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    // Удаляем предыдущую ошибку
    const existingError = input.parentNode.querySelector('.error');
    if (existingError) {
        existingError.remove();
    }
    
    input.parentNode.appendChild(errorElement);
    input.setAttribute('aria-invalid', 'true');
}

// Функция для очистки ошибок
function clearError(input) {
    const errorElement = input.parentNode.querySelector('.error');
    if (errorElement) {
        errorElement.remove();
    }
    input.setAttribute('aria-invalid', 'false');
}

// Валидация отдельных полей
function validateField(input) {
    clearError(input);
    
    if (input.validity.valid) {
        return true;
    }
    
    if (input.validity.valueMissing) {
        showError(input, 'Это поле обязательно для заполнения');
        return false;
    }
    
    if (input.validity.typeMismatch) {
        if (input.type === 'email') {
            showError(input, 'Введите корректный email адрес');
        }
        return false;
    }
    
    if (input.validity.tooShort) {
        showError(input, `Минимальная длина: ${input.minLength} символов`);
        return false;
    }
    
    if (input.validity.patternMismatch) {
        if (input.id === 'phone') {
            showError(input, 'Формат: +7 (800) 000-00-00');
        }
        return false;
    }
    
    return true;
}

// Общая валидация формы
function validateForm() {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Открытие модалки
openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal();
    // Фокус на первое поле
    dlg.querySelector('input, select, textarea, button')?.focus();
});

// Закрытие модалки
closeBtn.addEventListener('click', () => {
    dlg.close('cancel');
    // Очищаем ошибки при закрытии
    const errors = dlg.querySelectorAll('.error');
    errors.forEach(error => error.remove());
});

// Обработка отправки формы
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        // Имитация успешной отправки
        setTimeout(() => {
            dlg.close('success');
            form.reset();
            // Очищаем все ошибки
            const errors = form.querySelectorAll('.error');
            errors.forEach(error => error.remove());
            const invalidFields = form.querySelectorAll('[aria-invalid="true"]');
            invalidFields.forEach(field => field.setAttribute('aria-invalid', 'false'));
        }, 500);
    }
});

// Валидация при потере фокуса
form.addEventListener('focusout', (e) => {
    if (e.target.matches('input, select, textarea') && e.target.hasAttribute('required')) {
        validateField(e.target);
    }
});

// Обработка закрытия модалки
dlg.addEventListener('close', () => {
    lastActive?.focus();
});

// Легкая маска для телефона (опционально)
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('7')) {
            value = '+' + value;
        } else if (value.startsWith('8')) {
            value = '+7' + value.slice(1);
        } else if (!value.startsWith('+')) {
            value = '+7' + value;
        }
        
        // Форматирование: +7 (XXX) XXX-XX-XX
        if (value.length > 2) {
            value = value.slice(0, 2) + ' (' + value.slice(2);
        }
        if (value.length > 7) {
            value = value.slice(0, 7) + ') ' + value.slice(7);
        }
        if (value.length > 12) {
            value = value.slice(0, 12) + '-' + value.slice(12);
        }
        if (value.length > 15) {
            value = value.slice(0, 15) + '-' + value.slice(15);
        }
        
        e.target.value = value;
    });
}
