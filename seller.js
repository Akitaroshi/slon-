async function loadSellerProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const sellerId = urlParams.get('id');
    
    if (!sellerId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`api/sellers.php?id=${sellerId}`);
        const data = await response.json();
        const seller = data.seller;

        if (!seller) {
            window.location.href = 'index.html';
            return;
        }

        document.title = `${seller.name} - Crypto Exchange`;

        const sellerCard = document.querySelector('.seller-card');
        sellerCard.querySelector('.seller-avatar').textContent = seller.name[0].toUpperCase();
        sellerCard.querySelector('.seller-name').textContent = seller.name;
        sellerCard.querySelector('.seller-rating').innerHTML = '★'.repeat(seller.rating) + '☆'.repeat(5-seller.rating);
        sellerCard.querySelector('.seller-limits').textContent = `${seller.minAmount} ₽ - ${seller.maxAmount} ₽`;

        const reviewsList = document.querySelector('.reviews-list');
        reviewsList.innerHTML = seller.reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <span class="review-author">${review.author}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
    }
}

// Загрузка профиля при открытии страницы
loadSellerProfile(); 