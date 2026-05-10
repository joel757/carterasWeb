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

let allProducts = [];
let cart = JSON.parse(localStorage.getItem('carterasCart')) || [];
let currentProduct = null;
let currentQty = 1;
let currentColor = 'Negro';
const WHATSAPP_NUMBER = "5491100000000"; 

window.openProductModal = function(id) {
    currentProduct = allProducts.find(p => p.id === id);
    if(!currentProduct) return;
    
    currentQty = 1;
    currentColor = 'Negro';
    
    document.getElementById('modal-title').textContent = currentProduct.name;
    document.getElementById('modal-price').textContent = formatPrice(currentProduct.price);
    document.getElementById('modal-desc').textContent = currentProduct.description;
    document.getElementById('modal-img').src = currentProduct.image;
    document.getElementById('qty-value').textContent = currentQty;
    
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.color-btn[data-color="Negro"]').classList.add('active');
    
    document.getElementById('product-modal').classList.add('active');
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total-price');
    
    if(!cartCount || !cartContainer) return;
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    
    cartContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img class="cart-item-img" src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div>
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-color">Color: ${item.color}</div>
                    <div class="cart-item-price">${formatPrice(item.price)} x ${item.qty}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="qty-controls" style="transform: scale(0.8); transform-origin: left;">
                        <button onclick="changeCartItemQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeCartItemQty(${index}, 1)">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeCartItem(${index})">Eliminar</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(div);
    });
    
    cartTotal.textContent = formatPrice(total);
    localStorage.setItem('carterasCart', JSON.stringify(cart));
}

window.changeCartItemQty = function(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

window.removeCartItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function getCartWhatsAppMessage() {
    let message = "¡Hola! Quiero realizar el siguiente pedido:%0A%0A";
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        message += `${item.qty}x ${item.name} (Color: ${item.color}) - $${item.price * item.qty}%0A`;
    });
    
    message += `%0ATotal: $${total}`;
    return message;
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
                <button class="btn-buy" onclick="openProductModal('${product.id}')">Ver Detalle</button>
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
            
            allProducts = productsArray;
            
            // Si firebase está vacío, podemos inyectar los default para MVP
            if(productsArray.length === 0) {
                allProducts = defaultProducts;
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
            allProducts = defaultProducts;
            renderProductsGrid(defaultProducts);
        });
    } else {
        // Fallback LocalStorage
        let localProducts = JSON.parse(localStorage.getItem('carterasProducts'));
        if (!localProducts || localProducts.length === 0) {
            localProducts = defaultProducts;
            localStorage.setItem('carterasProducts', JSON.stringify(localProducts));
        }
        allProducts = localProducts;
        renderProductsGrid(localProducts);
    }
    
    // Configurar Event Listeners UI
    const modalCloseBtn = document.getElementById('modal-close');
    if(modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            document.getElementById('product-modal').classList.remove('active');
        });
    }
    
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentColor = e.target.getAttribute('data-color');
        });
    });
    
    const qtyPlusBtn = document.getElementById('qty-plus');
    if(qtyPlusBtn) {
        qtyPlusBtn.addEventListener('click', () => {
            currentQty++;
            document.getElementById('qty-value').textContent = currentQty;
        });
    }
    
    const qtyMinusBtn = document.getElementById('qty-minus');
    if(qtyMinusBtn) {
        qtyMinusBtn.addEventListener('click', () => {
            if (currentQty > 1) currentQty--;
            document.getElementById('qty-value').textContent = currentQty;
        });
    }
    
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    if(addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (!currentProduct) return;
            
            const existing = cart.find(i => i.id === currentProduct.id && i.color === currentColor);
            if (existing) {
                existing.qty += currentQty;
            } else {
                cart.push({
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: currentProduct.price,
                    image: currentProduct.image,
                    color: currentColor,
                    qty: currentQty
                });
            }
            
            updateCartUI();
            document.getElementById('product-modal').classList.remove('active');
            document.getElementById('cart-panel').classList.add('active');
            document.getElementById('cart-overlay').classList.add('active');
        });
    }
    
    // Cart Listeners
    const cartIcon = document.getElementById('cart-icon');
    if(cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('cart-panel').classList.add('active');
            document.getElementById('cart-overlay').classList.add('active');
        });
    }
    
    const cartCloseBtn = document.getElementById('cart-close');
    if(cartCloseBtn) {
        cartCloseBtn.addEventListener('click', () => {
            document.getElementById('cart-panel').classList.remove('active');
            document.getElementById('cart-overlay').classList.remove('active');
        });
    }
    
    const cartOverlay = document.getElementById('cart-overlay');
    if(cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            document.getElementById('cart-panel').classList.remove('active');
            document.getElementById('cart-overlay').classList.remove('active');
            const modal = document.getElementById('product-modal');
            if(modal) modal.classList.remove('active');
        });
    }
    
    const checkoutBtn = document.getElementById('btn-checkout');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert("Tu carrito está vacío.");
            const msg = getCartWhatsAppMessage();
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
        });
    }
    
    // Init Cart
    updateCartUI();
});
