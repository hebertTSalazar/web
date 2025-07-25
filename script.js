document.addEventListener('DOMContentLoaded', () => {
  // --- Carrito con cantidades persistentes ---
  function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || {};
  }

  function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function actualizarCantidadCarrito() {
    const carrito = obtenerCarrito();
    const totalCantidad = Object.values(carrito).reduce((a, b) => a + b, 0);
    const spanCantidad = document.querySelector('#carrito-cantidad');
    if (spanCantidad) {
      spanCantidad.textContent = totalCantidad;
      spanCantidad.style.display = totalCantidad > 0 ? 'inline-block' : 'none';
    }
  }

  function renderizarCarrito() {
    const contenedorCarrito = document.querySelector('#carrito-lista');
    const totalSpan = document.querySelector('#total');
    if (!contenedorCarrito || !totalSpan) return;

    const carrito = obtenerCarrito();
    contenedorCarrito.innerHTML = '';

    let total = 0;

    for (const producto in carrito) {
      const cantidad = carrito[producto];
      const precio = precios[producto] || 0;
      const subtotal = precio * cantidad;
      total += subtotal;

      const item = document.createElement('li');
      item.innerHTML = `
        ${producto} - S/. ${precio.toFixed(2)} x 
        <input type="number" min="0" value="${cantidad}" data-producto="${producto}" class="cantidad-input" style="width: 50px;" />
        = S/. ${subtotal.toFixed(2)}
        <button class="btn-eliminar" data-producto="${producto}" style="margin-left: 10px;">Eliminar</button>
      `;
      contenedorCarrito.appendChild(item);
    }

    totalSpan.textContent = `S/. ${total.toFixed(2)}`;
  }

  // --- Agregar productos al carrito ---
  const precios = {
    'Capuchino': 12.00,
    'Americano': 13.00,
    'Mocca': 15.00,
    'Caramelo': 14.00,
    'Frappe de café': 12.99,
    'Frappe de Oreo': 13.50,
    'Frappe Espumoso': 12.00,
    'Frappe premium': 13.50,
    'Café con arte latte': 16.00,
    'Americano doble': 22.00,
    'Café con Leche Bañado en Chocolate': 13.50,
    'Pastel de Chocolate con frutos de temporada': 4.50,
    'Bocaditos': 8.00,
    'Tres Leches': 5.50,
    'Pastel de Chocolate Bañado en crema de Chocolate': 6.50,
    'Alitas a la BBQ': 15.00,
    'Alitas más papas fritas': 20.00,
    'Super anticuhos': 15.00,
    'Tamales verdes': 3.00,
    'Jugo de Naranja': 5.00,
    'Jugo de Papaya': 6.00,
    'Jugo de Piña': 7.00,
    'Jugo de Fresa': 8.00,
    'Hada verde': 18.00,
    'Amor en llamas': 16.00,
    'Martini red': 20.00,
    'Cielo azul': 20.00,
    'Hamburguesa más jugo': 15.00,
    'Café más salchipapa personal': 20.00,
    'Duo enamorados': 30.00,
    'Combinación perfecta': 20.00,
    'Cafés más anticuchos': 35.00,
    'Triple café con pastel': 25.00,
  };

  const botonesAgregar = document.querySelectorAll('.btn-agregar');
  botonesAgregar.forEach(btn => {
    btn.addEventListener('click', () => {
      const producto = btn.dataset.producto;
      agregarAlCarrito(producto);
    });
  });

  function agregarAlCarrito(producto) {
    const carrito = obtenerCarrito();
    carrito[producto] = (carrito[producto] || 0) + 1;
    guardarCarrito(carrito);
    alert(`"${producto}" agregado al carrito. Total: ${carrito[producto]}`);
    actualizarCantidadCarrito();
  }

  // --- Envío de pedido y QR ---
  const formularioPedido = document.querySelector('#formulario-pedido');

  if (formularioPedido) {
    formularioPedido.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre = formularioPedido.nombre.value.trim();
      const telefono = formularioPedido.telefono.value.trim();
      const comentario = formularioPedido.comentario.value.trim();
      const metodo = formularioPedido.metodo.value;

      if (!nombre || !telefono || !comentario || !metodo) {
        alert('Por favor completa todos los campos del pedido.');
        return;
      }

      const carrito = obtenerCarrito();
      if (Object.keys(carrito).length === 0) {
        alert('Tu carrito está vacío.');
        return;
      }

      let mensaje = `Hola, te saluda *Coffee Dreams* %0ATu pedido es:%0A`;
   

      let total = 0;
      for (const producto in carrito) {
        const cantidad = carrito[producto];
        const precio = precios[producto] || 0;
        const subtotal = precio * cantidad;
        mensaje += `- ${producto} x${cantidad} = S/. ${subtotal.toFixed(2)}%0A`;
        total += subtotal;
      }

      mensaje += `%0ATotal a pagar: S/. ${total.toFixed(2)}`;
      mensaje += `%0AComentario: ${comentario}`;
      mensaje += `%0AMétodo de pago: ${metodo}`;

      const url = `https://wa.me/51${telefono}?text=${mensaje}`;
      window.open(url, '_blank');

      localStorage.removeItem('carrito');
      formularioPedido.reset();
      renderizarCarrito();
      actualizarCantidadCarrito();
    });
  }

  // --- Método de pago y QR ---
  const metodoSelect = document.getElementById('metodo-pago');
  const qrContainer = document.getElementById('qr-container');
  const qrImg = document.getElementById('qr-img');
  const qrTexto = document.getElementById('qr-texto');

  if (metodoSelect && qrContainer && qrImg && qrTexto) {
    metodoSelect.addEventListener('change', () => {
      const metodo = metodoSelect.value;

      if (metodo === 'Yape') {
        qrImg.src = 'qr-yape.png'; // Asegúrate de tener este archivo de imagen en tu proyecto
        qrContainer.style.display = 'block';
        qrTexto.textContent = 'Escanea el QR con tu app Yape.';
      } else if (metodo === 'Plin') {
        qrImg.src = 'qr-plin.png'; // Asegúrate de tener este archivo de imagen en tu proyecto
        qrContainer.style.display = 'block';
        qrTexto.textContent = 'Escanea el QR con tu app Plin.';
      } else {
        qrImg.src = '';
        qrContainer.style.display = 'none';
        qrTexto.textContent = '';
      }
    });
  }

  // --- Inicialización ---
  actualizarCantidadCarrito();
  renderizarCarrito();
});
