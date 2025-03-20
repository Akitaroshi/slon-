// Данные продавцов и отзывов (в реальном приложении должны храниться на сервере)
let sellers = [
    {
        id: '1',
        name: 'whyhate',
        rating: 5,
        minAmount: 500,
        maxAmount: 50000,
        avatar: 'default-avatar.png',
        reviews: [
            {
                author: 'Александр',
                rating: 5,
                text: 'Отличный продавец, быстрый обмен, рекомендую!',
                date: '15.03.2024'
            }
        ]
    }
];

// Функция для создания звездочек рейтинга
function createRatingStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// Функция для отображения списка продавцов
function displaySellers() {
    const sellersList = document.getElementById('sellersList');
    if (!sellersList) return;

    sellersList.innerHTML = sellers.map(seller => `
        <div class="seller-card" data-seller-id="${seller.id}">
            <div class="seller-info">
                <div class="seller-avatar">${seller.name[0].toUpperCase()}</div>
                <div class="seller-info-main">
                    <div class="seller-header">
                        <h3 class="seller-name">${seller.name}</h3>
                        <div class="seller-rating">${createRatingStars(seller.rating)}</div>
                    </div>
                </div>
            </div>
            <div class="seller-limits">
                <div>Мин: ${seller.minAmount} ₽</div>
                <div>Макс: ${seller.maxAmount} ₽</div>
            </div>
        </div>
    `).join('');

    // Добавляем обработчики клика для перехода на страницу продавца
    sellersList.querySelectorAll('.seller-card').forEach(card => {
        card.addEventListener('click', () => {
            const sellerId = card.dataset.sellerId;
            window.location.href = `seller.html?id=${sellerId}`;
        });
    });
}

// Функция для отображения карточки
function displayCard() {
    const cardSection = document.querySelector('.card-section');
    if (!cardSection) return;

    const hasCard = localStorage.getItem('hasCard') === 'true';
    const cardActions = document.createElement('div');
    cardActions.className = 'card-actions';

    if (hasCard) {
        cardActions.innerHTML = `
            <button class="card-action-btn remove" title="Отвязать карту">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;
    } else {
        cardActions.innerHTML = `
            <button class="card-action-btn" title="Привязать карту">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;
    }

    cardSection.appendChild(cardActions);

    // Обработчики событий для кнопок
    cardActions.querySelector('.card-action-btn').addEventListener('click', (e) => {
        e.preventDefault();
        if (hasCard) {
            if (confirm('Вы уверены, что хотите отвязать карту?')) {
                localStorage.setItem('hasCard', 'false');
                displayCard();
            }
        } else {
            const cardNumber = prompt('Введите номер карты:');
            if (cardNumber) {
                localStorage.setItem('hasCard', 'true');
                displayCard();
            }
        }
    });
}

// Функция для отображения профиля продавца
function displaySellerProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const sellerId = urlParams.get('id');
    const seller = sellers.find(s => s.id === sellerId);

    if (!seller) return;

    document.title = `${seller.name} - Crypto Exchange`;

    const sellerProfile = document.querySelector('.seller-profile');
    if (!sellerProfile) return;

    // Обновляем информацию о продавце
    const sellerCard = sellerProfile.querySelector('.seller-card');
    sellerCard.querySelector('.seller-name').textContent = seller.name;
    sellerCard.querySelector('.seller-rating').innerHTML = createRatingStars(seller.rating);
    sellerCard.querySelector('.seller-limits').innerHTML = `
        <div>Мин: ${seller.minAmount} ₽</div>
        <div>Макс: ${seller.maxAmount} ₽</div>
    `;

    // Отображаем отзывы
    const reviewsList = sellerProfile.querySelector('.reviews-list');
    reviewsList.innerHTML = seller.reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <span class="review-date">${review.date}</span>
            </div>
            <div class="review-rating">${createRatingStars(review.rating)}</div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

// Функции для админ-панели
function initAdminPanel() {
    const addSellerForm = document.getElementById('addSellerForm');
    const addReviewForm = document.getElementById('addReviewForm');
    const reviewSellerSelect = document.getElementById('reviewSeller');

    if (addSellerForm) {
        addSellerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newSeller = {
                id: Date.now().toString(),
                name: document.getElementById('sellerName').value,
                avatar: document.getElementById('sellerAvatar').value || 'default-avatar.png',
                minAmount: parseInt(document.getElementById('minAmount').value),
                maxAmount: parseInt(document.getElementById('maxAmount').value),
                rating: 5,
                reviews: []
            };
            sellers.push(newSeller);
            updateAdminSellersList();
            updateReviewSellersList();
            addSellerForm.reset();
        });
    }

    if (addReviewForm) {
        addReviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sellerId = document.getElementById('reviewSeller').value;
            const seller = sellers.find(s => s.id === sellerId);
            if (seller) {
                const newReview = {
                    author: document.getElementById('reviewAuthor').value,
                    rating: parseInt(document.getElementById('reviewRating').value),
                    text: document.getElementById('reviewText').value,
                    date: new Date().toLocaleDateString('ru-RU')
                };
                seller.reviews.push(newReview);
                // Пересчитываем средний рейтинг
                seller.rating = Math.round(seller.reviews.reduce((acc, rev) => acc + rev.rating, 0) / seller.reviews.length);
                updateAdminSellersList();
                addReviewForm.reset();
            }
        });
    }

    updateAdminSellersList();
    updateReviewSellersList();
}

function updateAdminSellersList() {
    const adminSellersList = document.getElementById('adminSellersList');
    if (!adminSellersList) return;

    adminSellersList.innerHTML = sellers.map(seller => `
        <div class="seller-card">
            <div class="seller-info">
                <div class="seller-avatar">${seller.name[0].toUpperCase()}</div>
                <div class="seller-info-main">
                    <div class="seller-header">
                        <h3 class="seller-name">${seller.name}</h3>
                        <div class="seller-rating">${createRatingStars(seller.rating)}</div>
                    </div>
                </div>
            </div>
            <div class="seller-limits">
                <div>Мин: ${seller.minAmount} ₽</div>
                <div>Макс: ${seller.maxAmount} ₽</div>
            </div>
        </div>
    `).join('');
}

function updateReviewSellersList() {
    const reviewSellerSelect = document.getElementById('reviewSeller');
    if (!reviewSellerSelect) return;

    reviewSellerSelect.innerHTML = `
        <option value="">Выберите продавца</option>
        ${sellers.map(seller => `
            <option value="${seller.id}">${seller.name}</option>
        `).join('')}
    `;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    displaySellers();
    displayCard();
    displaySellerProfile();
    initAdminPanel();
});