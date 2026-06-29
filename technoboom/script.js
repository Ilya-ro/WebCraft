document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: 'Смарт-часы X1', emoji: '⌚', price: 4990, desc: 'GPS, пульсометр, водозащита' },
        { id: 2, name: 'Беспроводные наушники Pro', emoji: '🎧', price: 3200, desc: 'Шумоподавление, 30 ч' },
        { id: 3, name: 'Пауэрбанк 20000 мАч', emoji: '🔋', price: 2450, desc: 'Быстрая зарядка, USB-C' },
        { id: 4, name: 'Умная колонка Max', emoji: '🔊', price: 5800, desc: 'Алиса, Hi-Fi звук' },
        { id: 5, name: 'Чехол противоударный', emoji: '📱', price: 890, desc: 'Для iPhone и Samsung' },
        { id: 6, name: 'USB-хаб 4-в-1', emoji: '🔌', price: 1350, desc: 'Type-C, HDMI, USB 3.0' },
        { id: 7, name: 'Фитнес-браслет Neo', emoji: '⌚', price: 2200, desc: 'Шагомер, сон, уведомления' },
        { id: 8, name: 'Портативная колонка Rock', emoji: '🔈', price: 3600, desc: 'Водонепроницаемая, 20 Вт' },
        { id: 9, name: 'Игровая мышь Cyber', emoji: '🖱️', price: 2950, desc: '16000 DPI, подсветка' },
        { id: 10, name: 'Механическая клавиатура K70', emoji: '⌨️', price: 7100, desc: 'Cherry MX, RGB' }
    ];

    let cart = [];

    const catalogBody = document.getElementById('catalogBody');
    const searchInput = document.getElementById('searchInput');
    const cartBtn = document.getElementById('cartBtn');
    const cartPanel = document.getElementById('cartPanel');
    const cartPanelClose = document.getElementById('cartPanelClose');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartOrderBtn = document.getElementById('cartOrderBtn');
    const orderForm = document.getElementById('orderForm');
    const orderMessage = document.getElementById('orderMessage');

    function renderCatalog(filter = '') {
        catalogBody.innerHTML = '';
        const filtered = products.filter(p => {
            const txt = filter.toLowerCase().trim();
            return p.name.toLowerCase().includes(txt) || p.desc.toLowerCase().includes(txt);
        });
        if (filtered.length === 0) {
            catalogBody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px;">Ничего не найдено</td></tr>';
            return;
        }
        filtered.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="product-emoji">${p.emoji}</span><span class="product-name">${p.name}</span></td>
                <td>${p.desc}</td>
                <td class="price-col">${p.price.toLocaleString()} ₽</td>
                <td><button class="add-to-cart-btn" data-id="${p.id}">В корзину</button></td>
            `;
            catalogBody.appendChild(row);
        });
    }

    function updateCart() {
        const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;

        cartItems.innerHTML = '';
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Корзина пуста</p>';
            cartTotal.textContent = '0';
            return;
        }
        let sum = 0;
        cart.forEach(item => {
            sum += item.price * item.quantity;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">${item.price.toLocaleString()} ₽</span>
                <div class="cart-item-controls">
                    <button class="cart-item-btn decrease" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="cart-item-btn increase" data-id="${item.id}">+</button>
                </div>
            `;
            cartItems.appendChild(div);
        });
        cartTotal.textContent = sum.toLocaleString();
    }

    function addToCart(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;
        const existing = cart.find(i => i.id === id);
        if (existing) existing.quantity++;
        else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
        updateCart();
    }

    function changeQuantity(id, delta) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
        updateCart();
    }

    catalogBody.addEventListener('click', e => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            addToCart(parseInt(e.target.dataset.id));
        }
    });

    searchInput.addEventListener('input', () => renderCatalog(searchInput.value));

    cartBtn.addEventListener('click', () => cartPanel.classList.add('show'));
    cartPanelClose.addEventListener('click', () => cartPanel.classList.remove('show'));
    
    // Закрытие по клику на фон (если нужно)
    window.addEventListener('click', e => {
        if (e.target === cartPanel) cartPanel.classList.remove('show');
    });

    cartItems.addEventListener('click', e => {
        const id = parseInt(e.target.dataset.id);
        if (e.target.classList.contains('increase')) changeQuantity(id, 1);
        if (e.target.classList.contains('decrease')) changeQuantity(id, -1);
    });

    cartOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) return alert('Добавьте товары');
        cartPanel.classList.remove('show');
        document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    });

    orderForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const phoneDigits = phone.replace(/\D/g, '');
        if (!name || !phone || !address) {
            orderMessage.textContent = 'Заполните обязательные поля';
            orderMessage.style.color = '#ef4444';
            return;
        }
        if (phoneDigits.length < 10) {
            orderMessage.textContent = 'Некорректный телефон';
            orderMessage.style.color = '#ef4444';
            return;
        }
        orderMessage.textContent = `Спасибо, ${name}! Заказ принят.`;
        orderMessage.style.color = '#22c55e';
        cart = [];
        updateCart();
        orderForm.reset();
        setTimeout(() => orderMessage.textContent = '', 4000);
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    renderCatalog();
    updateCart();
});