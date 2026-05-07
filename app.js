// app.js

// Productos de prueba hiperrealistas estilo Prune
const defaultProducts = [
    { id: '1', name: 'Tote Leather Noir', description: 'Tote bag 100% cuero vacuno negro con textura graneada. Herrajes bañados en oro. Ideal para la oficina o viajes.', price: 185, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'Totes' },
    { id: '2', name: 'Bandolera Siena', description: 'Bandolera estructurada de cuero liso color suela. Correa ajustable y cierre metálico frontal.', price: 145, image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'Bandoleras' },
    { id: '3', name: 'Mini Bag Pearl', description: 'Cartera de mano pequeña en tono blanco hueso. Detalles trenzados a mano. Perfecta para salidas nocturnas.', price: 120, image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'Fiesta' },
    { id: '4', name: 'Tote Canvas & Leather', description: 'Combinación perfecta de lona resistente y ribetes de cuero camel. Estilo relajado y elegante.', price: 160, image: 'https://images.unsplash.com/photo-1614179689702-355944cd0918?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'Totes' },
    { id: '5', name: 'Shoulder Bag Mocca', description: 'Bolso de hombro silueta hobo en cuero color chocolate. Interior forrado en algodón.', price: 175, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'Shoulders' },
    { id: '6', name: 'Bandolera Chain', description: 'Cartera cruzada de cuero texturizado con correa de cadena gruesa. Un clásico atemporal.', price: 155, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'Bandoleras' }
];

function formatPrice(price) {
    // Formato de precio premium, ej: $ 185.000
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price * 1000); 
}

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
        card.style.animationDelay = `${(index % 3) * 0.15}s`;
        
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="btn-buy" onclick="buyProduct('${product.name}', '${product.description}')">Añadir al Carrito (WhatsApp)</button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Escuchar Firebase
    if (typeof db !== 'undefined' && db !== null) {
        db.collection("carteras").onSnapshot((querySnapshot) => {
            const productsArray = [];
            querySnapshot.forEach((doc) => {
                productsArray.push({ id: doc.id, ...doc.data() });
            });
            
            // Si firebase está vacío, podemos inyectar los default para MVP
            if(productsArray.length === 0) {
                renderProductsGrid(defaultProducts);
                
                // Opcional: Escribirlos en Firebase para poblar la base de datos de prueba
                /*
                defaultProducts.forEach(p => {
                    db.collection("carteras").add(p);
                });
                */
            } else {
                renderProductsGrid(productsArray);
            }
            
        }, (error) => {
            console.error("Error leyendo de Firebase:", error);
            renderProductsGrid(defaultProducts);
        });
    } else {
        // Fallback LocalStorage
        let localProducts = JSON.parse(localStorage.getItem('carterasProducts'));
        if (!localProducts || localProducts.length === 0) {
            localProducts = defaultProducts;
            localStorage.setItem('carterasProducts', JSON.stringify(localProducts));
        }
        renderProductsGrid(localProducts);
    }
});
