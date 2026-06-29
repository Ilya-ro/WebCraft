document.addEventListener('DOMContentLoaded', () => {
    // --- Данные меню ---
    const menuItems = [
        { id: 1, name: 'Борщ', emoji: '🍲', price: 320, desc: 'Сытный обед на каждый день' },
        { id: 2, name: 'Паста карбонара', emoji: '🍝', price: 380, desc: 'Итальянская классика' },
        { id: 3, name: 'Цезарь с курицей', emoji: '🥗', price: 290, desc: 'Лёгкий и вкусный' },
        { id: 4, name: 'Гречка с грибами', emoji: '🍚', price: 210, desc: 'Полезный гарнир' }
    ];

    // --- Корзина (массив объектов { id, name, price, quantity }) ---
    let cart = [];

    // DOM-элементы
    const menuGrid = document.getElementById('menuGrid');
    const cartBtn = document.getElementById('cartBtn');
    const cartCount = document.getElementById('cartCount');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartOrderBtn = document.getElementById('cartOrderBtn');
    const orderForm = document.getElementById('orderForm');
    const orderMessage = document.getElementById('orderMessage');

    // --- Рендер меню ---
    function renderMenu() {
        menuGrid.innerHTML = '';
        menuItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            card.innerHTML = `
                <div class="menu-card__img">${item.emoji}</div>
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <span class="price">${item.price} ₽</span>
                <button class="add-to-cart-btn" data-id="${item.id}">В корзину</button>
            `;
            menuGrid.appendChild(card);
        });
    }

    // --- Обновление корзины ---
    function updateCart() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        cartItems.innerHTML = '';
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Корзина пуста</p>';
            cartTotal.textContent = '0';
            return;
        }

        let totalSum = 0;
        cart.forEach(cartItem => {
            totalSum += cartItem.price * cartItem.quantity;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span class="cart-item-name">${cartItem.name}</span>
                <span class="cart-item-price">${cartItem.price} ₽</span>
                <div class="cart-item-controls">
                    <button class="cart-item-btn decrease" data-id="${cartItem.id}">−</button>
                    <span class="cart-item-qty">${cartItem.quantity}</span>
                    <button class="cart-item-btn increase" data-id="${cartItem.id}">+</button>
                </div>
            `;
            cartItems.appendChild(div);
        });
        cartTotal.textContent = totalSum;
    }

    // --- Добавление в корзину ---
    function addToCart(id) {
        const menuItem = menuItems.find(item => item.id === id);
        if (!menuItem) return;
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 });
        }
        updateCart();
    }

    // --- Изменение количества ---
    function changeQuantity(id, delta) {
        const item = cart.find(item => item.id === id);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCart();
    }

    // --- Получение текста заказа ---
    function getOrderDetails() {
        if (cart.length === 0) return 'Без блюд';
        return cart.map(i => `${i.name} x${i.quantity}`).join(', ');
    }

    // --- Обработчики событий ---
    menuGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        }
    });

    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('show');
    });

    cartClose.addEventListener('click', () => {
        cartModal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('show');
    });

    cartItems.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        if (e.target.classList.contains('increase')) changeQuantity(id, 1);
        if (e.target.classList.contains('decrease')) changeQuantity(id, -1);
    });

    cartOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Добавьте блюда в корзину');
            return;
        }
        cartModal.classList.remove('show');
        document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    });

    // --- Отправка формы с обрезкой сообщения ---
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const comment = document.getElementById('comment').value.trim();

        if (!name || !phone || !address) {
            orderMessage.textContent = '⚠️ Заполните обязательные поля';
            orderMessage.style.color = '#e76f51';
            return;
        }

        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            orderMessage.textContent = '⚠️ Некорректный телефон';
            orderMessage.style.color = '#e76f51';
            return;
        }

        // Формируем и обрезаем сообщение
        const MAX_LENGTH = 80;
        let msg = `Спасибо, ${name}! Заказ принят.`;
        if (msg.length > MAX_LENGTH) {
            msg = msg.substring(0, MAX_LENGTH - 3) + '...';
        }
        orderMessage.textContent = msg;
        orderMessage.style.color = '#10b981';

        // Очищаем корзину
        cart = [];
        updateCart();
        orderForm.reset();

        setTimeout(() => {
            orderMessage.textContent = '';
        }, 5000);
    });

    // Плавный скролл
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Инициализация
    renderMenu();
    updateCart();
});