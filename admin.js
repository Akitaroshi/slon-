// Проверка авторизации
if (!localStorage.getItem('isAdmin')) {
    window.location.href = 'login.html';
}

// Обработчик выхода
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('isAdmin');
    window.location.href = 'login.html';
});

// Загрузка данных
async function loadData() {
    try {
        const response = await fetch('api/sellers.php');
        const data = await response.json();
        updateSellersList(data.sellers);
        updateReviewSellersList(data.sellers);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Обновление списка продавцов
function updateSellersList(sellers) {
    const list = document.getElementById('adminSellersList');
    if (!list) return;

    list.innerHTML = sellers.map(seller => `
        <div class="seller-card">
            <div class="seller-info">
                <div class="seller-avatar">${seller.name[0].toUpperCase()}</div>
                <div class="seller-details">
                    <span class="seller-name">${seller.name}</span>
                    <span class="seller-rating">${'★'.repeat(seller.rating)}${'☆'.repeat(5-seller.rating)}</span>
                </div>
            </div>
            <div class="seller-limits">
                ${seller.minAmount} ₽ - ${seller.maxAmount} ₽
            </div>
        </div>
    `).join('');
}

// Обновление списка продавцов в форме отзывов
function updateReviewSellersList(sellers) {
    const select = document.getElementById('reviewSeller');
    if (!select) return;

    select.innerHTML = `
        <option value="">Выберите продавца</option>
        ${sellers.map(seller => `
            <option value="${seller.id}">${seller.name}</option>
        `).join('')}
    `;
}

// Обработчик формы добавления продавца
document.getElementById('addSellerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        name: document.getElementById('sellerName').value,
        avatar: document.getElementById('sellerAvatar').value || 'default-avatar.png',
        minAmount: parseInt(document.getElementById('minAmount').value),
        maxAmount: parseInt(document.getElementById('maxAmount').value)
    };

    try {
        const response = await fetch('api/sellers.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        if (result.success) {
            loadData();
            e.target.reset();
        }
    } catch (error) {
        console.error('Ошибка добавления продавца:', error);
    }
});

// Обработчик формы добавления отзыва
document.getElementById('addReviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        sellerId: document.getElementById('reviewSeller').value,
        author: document.getElementById('reviewAuthor').value,
        rating: parseInt(document.getElementById('reviewRating').value),
        text: document.getElementById('reviewText').value
    };

    try {
        const response = await fetch('api/reviews.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        if (result.success) {
            loadData();
            e.target.reset();
        }
    } catch (error) {
        console.error('Ошибка добавления отзыва:', error);
    }
});

// Загрузка данных при открытии страницы
loadData(); 