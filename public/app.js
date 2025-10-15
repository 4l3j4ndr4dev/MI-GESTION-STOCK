// app.js

// Configuración de la API - CORREGIDO
const API_URL = window.location.origin;

// Estado de la aplicación
let currentToken = localStorage.getItem('token');
let currentUser = localStorage.getItem('userEmail');
let editingProductId = null;

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Inicializando aplicación...');
    console.log('🔧 API_URL:', API_URL);
    console.log('🔧 Token en localStorage:', currentToken ? 'Sí' : 'No');
    
    if (currentToken && currentUser) {
        showProductsSection();
        loadProducts();
    } else {
        showAuthSection();
    }
});

// ========== FUNCIONES DE UTILIDAD ==========

function showMessage(message, type, elementId) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

function setLoading(loading) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (loading) {
            button.disabled = true;
            button.style.opacity = '0.6';
        } else {
            button.disabled = false;
            button.style.opacity = '1';
        }
    });
}

// ========== AUTENTICACIÓN ==========

async function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showMessage('❌ Email y contraseña son requeridos', 'error', 'authMessage');
        return;
    }

    setLoading(true);

    try {
        console.log('📤 Enviando registro a:', `${API_URL}/users/register`);
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('📥 Respuesta del registro:', data);

        if (response.ok) {
            showMessage('✅ Usuario registrado exitosamente. Ahora puedes iniciar sesión.', 'success', 'authMessage');
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        } else {
            showMessage(`❌ Error: ${data.error}`, 'error', 'authMessage');
        }
    } catch (error) {
        console.error('❌ Error en registro:', error);
        showMessage('❌ Error de conexión con el servidor', 'error', 'authMessage');
    } finally {
        setLoading(false);
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showMessage('❌ Email y contraseña son requeridos', 'error', 'authMessage');
        return;
    }

    setLoading(true);

    try {
        console.log('📤 Enviando login a:', `${API_URL}/users/login`);
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log('📥 Respuesta del login:', data);

        if (response.ok) {
            currentToken = data.token;
            currentUser = data.user.email;
            
            // Guardar en localStorage
            localStorage.setItem('token', currentToken);
            localStorage.setItem('userEmail', currentUser);
            
            showProductsSection();
            loadProducts();
            showMessage('✅ ¡Login exitoso!', 'success', 'productsMessage');
        } else {
            showMessage(`❌ Error: ${data.error}`, 'error', 'authMessage');
        }
    } catch (error) {
        console.error('❌ Error en login:', error);
        showMessage('❌ Error de conexión con el servidor', 'error', 'authMessage');
    } finally {
        setLoading(false);
    }
}

function logout() {
    currentToken = null;
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    showAuthSection();
    clearForm();
    showMessage('✅ Sesión cerrada correctamente', 'success', 'authMessage');
}

// ========== NAVEGACIÓN ==========

function showAuthSection() {
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('productsSection').classList.add('hidden');
}

function showProductsSection() {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('productsSection').classList.remove('hidden');
    document.getElementById('userEmail').textContent = currentUser;
}

// ========== GESTIÓN DE PRODUCTOS ==========

async function loadProducts() {
    console.log('🔧 Cargando productos...');
    console.log('🔧 Token:', currentToken);
    
    if (!currentToken) {
        showMessage('❌ No hay token de autenticación', 'error', 'productsMessage');
        return;
    }

    setLoading(true);

    try {
        console.log('📤 Enviando petición a:', `${API_URL}/items`);
        const response = await fetch(`${API_URL}/items`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`,
            },
        });

        console.log('📥 Estado de la respuesta:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error en la respuesta:', errorData);
            throw new Error(errorData.error || `Error ${response.status}`);
        }

        const data = await response.json();
        console.log('📦 Productos recibidos:', data);
        
        displayProducts(data.products || []);
        showMessage(`✅ ${data.products?.length || 0} productos cargados`, 'success', 'productsMessage');
        
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        
        if (error.message.includes('401') || error.message.includes('Token')) {
            showMessage('❌ Sesión expirada. Por favor, inicia sesión nuevamente.', 'error', 'productsMessage');
            logout();
        } else {
            showMessage(`❌ Error al cargar productos: ${error.message}`, 'error', 'productsMessage');
        }
    } finally {
        setLoading(false);
    }
}

async function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value;
    console.log('🔍 Buscando:', searchTerm);
    
    try {
        const response = await fetch(`${API_URL}/items?search=${encodeURIComponent(searchTerm)}`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();
        displayProducts(data.products || []);
        
    } catch (error) {
        console.error('❌ Error buscando productos:', error);
        showMessage(`❌ Error al buscar productos: ${error.message}`, 'error', 'productsMessage');
    }
}

function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    const productsCount = document.getElementById('productsCount');
    
    // Actualizar contador
    productsCount.textContent = `${products.length} producto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`;
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <h3>No hay productos</h3>
                <p>Agrega tu primer producto usando el formulario superior</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-name">${escapeHtml(product.name)}</div>
            <div class="product-description">${escapeHtml(product.description || 'Sin descripción')}</div>
            <div class="product-price">$${product.price?.toFixed(2) || '0.00'}</div>
            <div class="product-stock">Stock: ${product.stock || 0} unidades</div>
            <div class="product-category">Categoría: ${escapeHtml(product.category || 'general')}</div>
            <div class="product-actions">
                <button onclick="editProduct('${product.id}')">Editar</button>
                <button class="delete" onclick="deleteProduct('${product.id}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// ========== FUNCIONES PRINCIPALES QUE TE FALTAN ==========

async function saveProduct() {
    const productData = {
        name: document.getElementById('productName').value.trim(),
        description: document.getElementById('productDescription').value.trim(),
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        category: document.getElementById('productCategory').value
    };

    // Validaciones
    if (!productData.name || !productData.price || !productData.stock) {
        showMessage('❌ Nombre, precio y stock son requeridos', 'error', 'productsMessage');
        return;
    }

    if (productData.price < 0 || productData.stock < 0) {
        showMessage('❌ Precio y stock no pueden ser negativos', 'error', 'productsMessage');
        return;
    }

    setLoading(true);

    try {
        const url = editingProductId ? 
            `${API_URL}/items/${editingProductId}` : 
            `${API_URL}/items`;
        
        const method = editingProductId ? 'PUT' : 'POST';

        console.log('📤 Guardando producto:', { url, method, productData });
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`,
            },
            body: JSON.stringify(productData),
        });

        const data = await response.json();
        console.log('📥 Respuesta guardar producto:', data);

        if (response.ok) {
            const action = editingProductId ? 'actualizado' : 'creado';
            showMessage(`✅ Producto ${action} exitosamente!`, 'success', 'productsMessage');
            clearForm();
            loadProducts();
        } else {
            showMessage(`❌ Error: ${data.error}`, 'error', 'productsMessage');
        }
    } catch (error) {
        console.error('❌ Error guardando producto:', error);
        showMessage('❌ Error de conexión con el servidor', 'error', 'productsMessage');
    } finally {
        setLoading(false);
    }
}

function editProduct(productId) {
    // Buscar el producto en la lista actual
    const productsGrid = document.getElementById('productsGrid');
    const productCards = productsGrid.getElementsByClassName('product-card');
    
    for (let card of productCards) {
        // Obtener el ID del producto desde el botón de editar
        const editButton = card.querySelector('button[onclick*="editProduct"]');
        const buttonProductId = editButton.getAttribute('onclick').match(/'([^']+)'/)[1];
        
        if (buttonProductId === productId) {
            const name = card.querySelector('.product-name').textContent;
            const description = card.querySelector('.product-description').textContent;
            const price = card.querySelector('.product-price').textContent.replace('$', '');
            const stock = card.querySelector('.product-stock').textContent.replace('Stock: ', '').replace(' unidades', '');
            const category = card.querySelector('.product-category').textContent.replace('Categoría: ', '');
            
            // Llenar el formulario con los datos del producto
            document.getElementById('productName').value = name;
            document.getElementById('productDescription').value = description === 'Sin descripción' ? '' : description;
            document.getElementById('productPrice').value = price;
            document.getElementById('productStock').value = stock;
            document.getElementById('productCategory').value = category;
            
            editingProductId = productId;
            document.getElementById('formTitle').textContent = 'Editar Producto';
            document.getElementById('saveButton').textContent = 'Actualizar Producto';
            
            // Scroll al formulario
            document.querySelector('.product-form-container').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            break;
        }
    }
}

async function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
        return;
    }

    setLoading(true);

    try {
        console.log('🗑️ Eliminando producto:', productId);
        const response = await fetch(`${API_URL}/items/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
            },
        });

        const data = await response.json();
        console.log('📥 Respuesta eliminar producto:', data);

        if (response.ok) {
            showMessage('✅ Producto eliminado exitosamente!', 'success', 'productsMessage');
            loadProducts();
        } else {
            showMessage(`❌ Error: ${data.error}`, 'error', 'productsMessage');
        }
    } catch (error) {
        console.error('❌ Error eliminando producto:', error);
        showMessage('❌ Error de conexión con el servidor', 'error', 'productsMessage');
    } finally {
        setLoading(false);
    }
}

function clearForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productCategory').value = 'tecnología';
    
    editingProductId = null;
    document.getElementById('formTitle').textContent = 'Agregar Nuevo Producto';
    document.getElementById('saveButton').textContent = 'Guardar Producto';
}

// ========== FUNCIONES AUXILIARES ==========

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Manejar envío de formularios con Enter
document.addEventListener('DOMContentLoaded', function() {
    // Formulario de auth
    const authInputs = document.querySelectorAll('#authSection input');
    authInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    });

    // Formulario de productos
    const productInputs = document.querySelectorAll('.product-form-container input, .product-form-container textarea');
    productInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                saveProduct();
            }
        });
    });
});