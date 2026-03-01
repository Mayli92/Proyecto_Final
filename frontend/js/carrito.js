/* ==========================================================
   CONFIGURACIÓN Y VARIABLES GLOBALES
   ========================================================== */
const URL_API = "http://localhost:3000/api/products";
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let descuentoPorcentaje = 0;
let totalFinalConDescuento = 0;

/* ==========================================================
   RENDERIZADO DEL CARRITO
   ========================================================== */
async function renderizarCarrito() {
    const contenedor = document.getElementById("contenedor-carrito");
    const totalElemento = document.getElementById("total-monto"); 
    let totalAcumulado = 0;

    // 1. Verificar si el carrito existe y tiene elementos
    if (!carrito || carrito.length === 0) {
        contenedor.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <p style="color: #888;">Tu carrito de Las Magnolias está vacío.</p>
                <a href="index.html#nuestros-productos" class="btn-hero" style="text-decoration:none; display:inline-block; margin-top:10px;">Ir a la tienda</a>
            </div>`;
        if (totalElemento) totalElemento.innerText = "$ 0";
        actualizarContador();
        return;
    }

    contenedor.innerHTML = "<p style='text-align:center;'>Cargando tu selección de belleza...</p>";

    // 2. Bucle para traer datos actualizados de la API por cada ID
    let htmlGenerado = "";

    for (const item of carrito) {
        try {
            const idParaBuscar = item._id || item.id;
            // Petición al backend por el ID específico del producto
            const res = await fetch(`${URL_API}/${idParaBuscar}`);
            if (!res.ok) throw new Error("Producto no encontrado");
            const p = await res.json();

            const subtotal = p.precio * item.cantidad;
            totalAcumulado += subtotal;

            htmlGenerado += `
                <div class="producto-carrito" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; border-bottom: 1px solid #f2dadd; background: white;">
                    <img src="${p.image}" width="80" style="border-radius: 10px; object-fit: cover; height: 80px;">
                    <div style="flex: 1; margin-left: 20px;">
                        <h4 style="margin: 0; color: #d48d9a; font-family: 'Playfair Display', serif;">${p.nombre}</h4>
                        <p style="margin: 5px 0; font-size: 0.9em; color: #666;">$${p.precio} x ${item.cantidad}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-weight: bold; margin: 0; color: #4a4a4a;">$${subtotal}</p>
                        <button onclick="eliminarDelCarrito('${p._id}')" style="background:none; border:none; color: #b56b78; cursor:pointer; font-size: 0.85em; text-decoration: underline; margin-top: 5px;">Eliminar</button>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error("Error cargando producto del carrito:", item.id, error);
        }
    }

    contenedor.innerHTML = htmlGenerado;
  
    const subtotalElemento = document.getElementById("subtotal-monto");
    const descuentoElemento = document.getElementById("descuento-monto");
    const filaDescuento = document.getElementById("fila-descuento");

    if (subtotalElemento) subtotalElemento.innerText = `$ ${totalAcumulado}`;

    // Lógica de descuento
    const montoDescuento = totalAcumulado * (descuentoPorcentaje / 100);
    totalFinalConDescuento = totalAcumulado - montoDescuento;

    if (descuentoPorcentaje > 0) {
        filaDescuento.style.display = "flex";
        descuentoElemento.innerText = `-$ ${montoDescuento.toFixed(0)}`;
    }

    if (totalElemento) totalElemento.innerText = `$ ${totalFinalConDescuento.toFixed(0)}`;
    
    // Guardamos el total final para el backend
    const inputTotalHidden = document.getElementById("input-total-compra");
    if (inputTotalHidden) inputTotalHidden.value = totalFinalConDescuento;

    actualizarContador();
}
    

/* ==========================================================
   FUNCIONES DE GESTIÓN
   ========================================================== */

function eliminarDelCarrito(id) {
    // Filtramos el carrito para quitar el producto seleccionado
   carrito = carrito.filter(item => (item.id || item._id) !== id);
    
    // Guardamos el nuevo estado en LocalStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    // Volvemos a dibujar el carrito
    renderizarCarrito();
}

function actualizarContador() {
    const contador = document.getElementById("carrito");
    if (contador) {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.innerText = totalItems;
    }
}

function aplicarCupon() {
    const input = document.getElementById("input-cupon");
    const mensaje = document.getElementById("mensaje-cupon");
    const codigo = input.value.trim().toUpperCase();

    mensaje.style.display = "block";

    if (codigo === "MAGNOLIA20") {
        descuentoPorcentaje = 20;
        mensaje.innerText = "✅ Cupón del 20% aplicado correctamente.";
        mensaje.style.color = "green";
    } else if (codigo === "MAGNOLIA10") { // Ejemplo para el 10% del newsletter
        descuentoPorcentaje = 10;
        mensaje.innerText = "✅ Cupón del 10% aplicado correctamente.";
        mensaje.style.color = "green";
    } else {
        descuentoPorcentaje = 0;
        mensaje.innerText = "❌ Código no válido.";
        mensaje.style.color = "red";
    }

    renderizarCarrito(); // Recalculamos la vista
}

/* ==========================================================
   EVENTOS DE CHECKOUT (MODAL)
   ========================================================== */

// Abrir Modal de Pago
document.getElementById("btn-abrir-checkout")?.addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Por favor, agrega productos antes de finalizar la compra.");
    } else {
        document.getElementById("modal-pago").classList.add("active");
    }
});

// Cerrar Modal
document.getElementById("cerrar-checkout")?.addEventListener("click", () => {
    document.getElementById("modal-pago").classList.remove("active");
});

// Procesar Formulario de Compra
document.getElementById("form-finalizar-compra")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Obtenemos el token de seguridad
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión para finalizar la compra.");
        window.location.href = "login.html"; // O tu página de login
        return;
    }

    // 2. Preparamos el pedido según lo que espera tu backend
    // Tu ruta /api/compra espera un objeto { carrito: [...] }
    const pedidoData = {
        carrito: carrito.map(item => ({
            _id: item._id || item.id,
            cantidad: item.cantidad
        }))
 // <--- Agrega esto para verificar en consola
    };
    console.log("Datos enviados al servidor:", pedidoData); // <--- Agrega esto para verificar en consola

    try {
        const response = await fetch('http://localhost:3000/api/compra', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token // Enviamos el token en el header
            },
            body: JSON.stringify(pedidoData)
        });

        const data = await response.json();

        if (response.ok) {
            alert(`¡Gracias! Compra realizada con éxito. ${data.mensaje}`);
            
            // Limpiar todo después del éxito
            localStorage.removeItem("carrito");
            window.location.href = "index.html"; 
        } else {
            alert("Error: " + data);
        }
    } catch (error) {
        console.error("Error en la compra:", error);
        alert("Hubo un problema al procesar tu pedido con el servidor.");
    }
});

/* ==========================================================
   INICIO AL CARGAR LA PÁGINA
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();
});