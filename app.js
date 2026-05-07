// app.js
const defaultProducts = [
    { id: '1', name: 'Bolso Ethereal Noir', description: 'Elegante bolso de cuero negro con detalles dorados.', price: 120, image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '2', name: 'Tote Minimal Sand', description: 'Amplio bolso tote en color arena, ideal para el día a día.', price: 95, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '3', name: 'Clutch Evening Pearl', description: 'Clutch sofisticado en tono perla, perfecto para eventos formales.', price: 85, image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '4', name: 'Bandolera Urban', description: 'Cómoda bandolera de cuero marrón para la ciudad.', price: 110, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price * 1000); 
}

// Función global porque se llama desde el HTML via onclick
window.buyProduct = function(name, description) {
    const phone = "5491100000000"; // Reemplaza con tu número
    const message = `Hola, estoy interesado/a en comprar la cartera "${name}". Detalles: ${description}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function renderProductsGrid(productsArray) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    productsArray.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in-up';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="btn-buy" onclick="buyProduct('${product.name}', '${product.description}')">Comprar por WhatsApp</button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Si Firebase está configurado, leemos de ahí en tiempo real
    if (typeof db !== 'undefined' && db !== null) {
        db.collection("carteras").onSnapshot((querySnapshot) => {
            const productsArray = [];
            querySnapshot.forEach((doc) => {
                productsArray.push({ id: doc.id, ...doc.data() });
            });
            renderProductsGrid(productsArray);
        }, (error) => {
            console.error("Error leyendo de Firebase:", error);
        });
    } else {
        // Fallback: usar LocalStorage si Firebase no está listo
        let localProducts = JSON.parse(localStorage.getItem('carterasProducts'));
        if (!localProducts || localProducts.length === 0) {
            localProducts = defaultProducts;
            localStorage.setItem('carterasProducts', JSON.stringify(localProducts));
        }
        renderProductsGrid(localProducts);
    }
});
