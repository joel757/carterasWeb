// admin.js

function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price * 1000);
}

function renderAdminList(productsArray) {
    const list = document.getElementById('admin-product-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    productsArray.forEach((product) => {
        const tr = document.createElement('tr');
        tr.className = 'fade-in-up';
        
        tr.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" style="width:50px;height:50px;object-fit:cover;"></td>
            <td><strong>${product.name}</strong><br><small style="color: #858383">${product.description.substring(0, 50)}...</small></td>
            <td>${formatPrice(product.price)}</td>
            <td>
                <button class="btn-danger" onclick="deleteProduct('${product.id}')">Eliminar</button>
            </td>
        `;
        
        list.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Escuchar datos
    if (typeof db !== 'undefined' && db !== null) {
        db.collection("carteras").onSnapshot((querySnapshot) => {
            const productsArray = [];
            querySnapshot.forEach((doc) => {
                productsArray.push({ id: doc.id, ...doc.data() });
            });
            renderAdminList(productsArray);
        });
    } else {
        const localProducts = JSON.parse(localStorage.getItem('carterasProducts')) || [];
        renderAdminList(localProducts);
    }

    // Agregar producto
    const form = document.getElementById('add-product-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const price = parseFloat(document.getElementById('price').value);
            const image = document.getElementById('image').value;
            const description = document.getElementById('description').value;
            
            const newProduct = {
                name,
                price,
                image,
                description
            };
            
            if (typeof db !== 'undefined' && db !== null) {
                // Guardar en Firebase
                db.collection("carteras").add(newProduct)
                .then(() => {
                    form.reset();
                })
                .catch((error) => {
                    console.error("Error añadiendo documento: ", error);
                    alert("Error al guardar en Firebase");
                });
            } else {
                // Fallback LocalStorage
                newProduct.id = Date.now().toString();
                let products = JSON.parse(localStorage.getItem('carterasProducts')) || [];
                products.push(newProduct);
                localStorage.setItem('carterasProducts', JSON.stringify(products));
                renderAdminList(products);
                form.reset();
            }
        });
    }
});

// Función global para eliminar (usada en onclick)
window.deleteProduct = function(id) {
    if (confirm('¿Estás seguro de eliminar esta cartera?')) {
        if (typeof db !== 'undefined' && db !== null) {
            db.collection("carteras").doc(id).delete().catch(error => {
                console.error("Error eliminando documento: ", error);
            });
        } else {
            let products = JSON.parse(localStorage.getItem('carterasProducts')) || [];
            products = products.filter(p => p.id !== id);
            localStorage.setItem('carterasProducts', JSON.stringify(products));
            renderAdminList(products);
        }
    }
}
