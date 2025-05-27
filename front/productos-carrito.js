// Lógica para manejar el carrito y agregar productos
let cart = [];

function renderCart() {
  const cartList = document.getElementById('cart');
  const cartTotal = document.getElementById('cartTotal');
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach((item) => {
    const li = document.createElement('li');
    // Mostramos solo el nombre y cantidad, el id queda oculto en el objeto
    li.textContent = `Producto: ${item.product} x Cantidad: ${item.quantity}`;
    cartList.appendChild(li);
    total += (item.price || 0) * item.quantity;
  });
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Agregar producto al carrito
  const addToCartForm = document.getElementById('addToCartForm');

  if (addToCartForm) {
    addToCartForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const product = document.getElementById('productInput').value;
      const quantity = parseInt(document.getElementById('quantityInput').value);
      fetch(`http://localhost:3000/products/${encodeURIComponent(product)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`}
      })
      .then(response => response.json())
      .then(data => {
        // El endpoint /products/:query devuelve un array de productos que coinciden
        const productData = Array.isArray(data) ? data[0] : null;
        if (!productData) {
          alert('Producto no encontrado');
          return;
        }
        const name = productData.name;
        const price = productData.price;
        const id = productData.id;
        cart.push({ id, product: name, quantity, price });
        renderCart();
        addToCartForm.reset();
      });
    });
  }

  // Finalizar compra (puedes implementar la lógica de envío al backend aquí)
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
      }
      // Armar el array de productos con id y cantidad
      const products = cart.map(item => ({ id: item.id, quantity: item.quantity }));
        fetch('http://localhost:3000/orders/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ products })
        })
        .then(data => data.json())
        .then(response => {
          if (response.status === 201) {
          alert('Compra realizada correctamente');
          cart = [];
          renderCart();
        } else {
          alert(response.message || 'Error al realizar la compra');
        }
        })
        .catch(err => {
          alert('Error de red al enviar el carrito');
          console.error('Error de red:', err);
        });
      });
  }

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  }

  // Buscar productos
  const searchProductForm = document.getElementById('searchProductForm');
  const searchProductInput = document.getElementById('searchProductInput');
  const productsList = document.getElementById('productsList');

  if (searchProductForm) {
    searchProductForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = searchProductInput.value.trim();
      if (!query) return;
      fetch(`http://localhost:3000/products/${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        productsList.innerHTML = '';
        if (!Array.isArray(data) || data.length === 0) {
          productsList.textContent = 'No se encontraron productos.';
          return;
        }
        data.forEach(prod => {
          const div = document.createElement('div');
          div.textContent = `ID: ${prod.id} | ${prod.name} | $${prod.price} | Stock: ${prod.stock}`;
          productsList.appendChild(div);
        });
      })
      .catch(() => {
        productsList.textContent = 'Error al buscar productos.'
      });
    });
  }

  renderCart();
});
