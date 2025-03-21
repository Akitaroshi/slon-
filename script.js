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

// Функция для создания случайных данных для графика
function generateChartData(points = 24, volatility = 1) {
    const data = [];
    let value = 100;
    for (let i = 0; i < points; i++) {
        value = value + (Math.random() - 0.5) * volatility * value * 0.05;
        data.push(value);
    }
    return data;
}

function createTimeLabels(period = '24h') {
    const labels = [];
    const now = new Date();
    let interval;
    let count;

    switch(period) {
        case '24h':
            interval = 3600000; // 1 hour
            count = 24;
            break;
        case '7d':
            interval = 86400000; // 1 day
            count = 7;
            break;
        case '30d':
            interval = 86400000; // 1 day
            count = 30;
            break;
    }

    for (let i = count - 1; i >= 0; i--) {
        const time = new Date(now - interval * i);
        labels.push(time.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit'
        }));
    }

    return labels;
}

// Функция для инициализации графиков
function initCharts() {
    const btcCanvas = document.getElementById('btcChart');
    const ethCanvas = document.getElementById('ethChart');

    if (!btcCanvas || !ethCanvas) {
        console.error('Canvas elements not found');
        return;
    }

    // Функция форматирования чисел
    function formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return '0.00';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }

    // Функция для получения данных криптовалюты
    async function getCryptoData(id) {
        try {
            // Получаем текущую цену
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24h_change=true`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`${id} data:`, data); // Отладочный вывод

            return {
                price: data[id].usd,
                change24h: data[id].usd_24h_change || 0
            };
        } catch (error) {
            console.error(`Error fetching ${id} data:`, error);
            return { price: 0, change24h: 0 };
        }
    }

    // Функция для создания графика
    function createChart(canvas, color) {
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, `${color}20`);
        gradient.addColorStop(1, `${color}05`);

        // Генерируем тестовые данные для демонстрации
        const hours = 24;
        const data = [];
        const labels = [];
        const now = new Date();

        for (let i = hours - 1; i >= 0; i--) {
            const time = new Date(now - i * 3600000);
            labels.push(time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));
            // Генерируем случайные значения для демонстрации
            data.push(Math.random() * 1000 + 80000); // Для BTC
        }

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    borderColor: color,
                    borderWidth: 2,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleColor: '#fff',
                        bodyColor: '#fff'
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)',
                            font: { size: 10 }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)',
                            font: { size: 10 },
                            callback: value => `$${formatNumber(value)}`
                        }
                    }
                }
            }
        });
    }

    // Функция обновления информации о цене
    function updatePriceInfo(chartCard, price, change) {
        const priceElement = chartCard.querySelector('.price');
        const changeElement = chartCard.querySelector('.change');

        if (priceElement) {
            priceElement.textContent = `$${formatNumber(price)}`;
        }

        if (changeElement) {
            const changeValue = parseFloat(change);
            const changeText = `${changeValue >= 0 ? '+' : ''}${formatNumber(changeValue)}%`;
            changeElement.textContent = changeText;
            changeElement.className = `change ${changeValue >= 0 ? 'positive' : 'negative'}`;
        }
    }

    // Функция инициализации
    async function initCharts() {
        try {
            // Получаем данные для BTC
            const btcData = await getCryptoData('bitcoin');
            if (btcData) {
                updatePriceInfo(btcCanvas.closest('.chart-card'), btcData.price, btcData.change24h);
                createChart(btcCanvas, '#F7931A');
            }

            // Получаем данные для ETH
            const ethData = await getCryptoData('ethereum');
            if (ethData) {
                updatePriceInfo(ethCanvas.closest('.chart-card'), ethData.price, ethData.change24h);
                createChart(ethCanvas, '#627EEA');
            }
        } catch (error) {
            console.error('Error in initCharts:', error);
        }
    }

    // Запускаем инициализацию
    initCharts();

    // Обновляем каждые 5 минут
    setInterval(initCharts, 300000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    displaySellers();
    displayCard();
    displaySellerProfile();
    initAdminPanel();
    initCharts();
});