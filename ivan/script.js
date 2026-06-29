document.addEventListener('DOMContentLoaded', () => {
    // Галерея с твоими фотографиями
    const images = [
        {
            src: 'https://i.pinimg.com/originals/0d/31/aa/0d31aa84c1071c5d815de7982e1c7439.jpg',
            caption: 'Свадьба Анны и Дмитрия'
        },
        {
            src: 'https://i.pinimg.com/originals/c1/95/28/c195287bc735d1eb39ce37909887fb4e.jpg',
            caption: 'Свадьба Елены и Сергея'
        },
        {
            src: 'https://i.pinimg.com/736x/07/1f/c7/071fc7777f415bef471aec8f8a952afb.jpg',
            caption: 'Портрет Марии'
        },
        {
            src: 'https://i.pinimg.com/originals/63/7e/39/637e39a638844ac0be755cdeca57b421.jpg',
            caption: 'Love Story Ольги и Павла'
        },
        {
            src: 'https://i.pinimg.com/originals/07/79/70/0779701697f75e3cc4632d7ba50cd50c.jpg',
            caption: 'Свадьба Ирины и Максима'
        },
        {
            src: 'https://i.pinimg.com/originals/e4/bd/6e/e4bd6ed5ecc24107f3b560791cd4a3b0.jpg',
            caption: 'Семейный портрет'
        }
    ];

    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    // Рендер галереи
    images.forEach(img => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const imageElement = document.createElement('img');
        imageElement.src = img.src;
        imageElement.alt = img.caption;
        imageElement.loading = 'lazy';
        
        imageElement.onerror = () => {
            imageElement.style.display = 'none';
        };

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = '<span>🔍</span>';

        item.appendChild(imageElement);
        item.appendChild(overlay);

        item.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.caption;
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
        gallery.appendChild(item);
    });

    // Закрытие лайтбокса
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Форма обратной связи с обрезкой сообщения
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        const phoneDigits = phone.replace(/\D/g, '');
        if (!name || !phone) {
            formMessage.textContent = '⚠️ Пожалуйста, заполните имя и телефон';
            formMessage.style.color = '#c9a96e';
            return;
        }
        if (phoneDigits.length < 10) {
            formMessage.textContent = '⚠️ Введите корректный номер телефона';
            formMessage.style.color = '#c9a96e';
            return;
        }

        const MAX_LENGTH = 80;
        let msg = '✅ Спасибо! Я свяжусь с вами в ближайшее время.';
        if (msg.length > MAX_LENGTH) {
            msg = msg.substring(0, MAX_LENGTH - 3) + '...';
        }
        formMessage.textContent = msg;
        formMessage.style.color = '#2e7d32';
        contactForm.reset();

        setTimeout(() => {
            formMessage.textContent = '';
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
});