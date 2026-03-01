/* ==========================================================
   CONFIGURACIÓN Y VARIABLES GLOBALES
   ========================================================== */
const URL_API = "http://localhost:3000/api/products";

// Cargar carrito desde LocalStorage o empezar vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/* ==========================================================
   GESTIÓN DEL CARRITO
   ========================================================== */

function agregarAlCarrito(id) {
    // 1. Buscar si el producto ya existe en el carrito
    const existe = carrito.find(item => item.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        // 2. Si es nuevo, agregarlo con cantidad 1
        carrito.push({ id: id, cantidad: 1 });
    }

    // 3. Guardar en LocalStorage
    localStorage.setItem("carrito-magnolias", JSON.stringify(carrito));

    // 4. Feedback visual y actualización
    alert("¡Producto añadido con éxito a Las Magnolias!");
    actualizarContadorCarrito(); 
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.innerText = total;
    }
}

/* ==========================================================
   CARGA DE PRODUCTOS DESDE LA API (MONGODB)
   ========================================================== */

async function cargarProductos() {
    try {
        const respuesta = await fetch(URL_API);
        const productos = await respuesta.json();

        const contenedor = document.getElementById("productos-contenedor");
        if (!contenedor) return; // Seguridad por si no estamos en la página de tienda
        
        contenedor.innerHTML = ""; // Limpiar antes de cargar

        productos.forEach(p => {
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta-producto");
            tarjeta.innerHTML = `
                <img src="${p.image}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p class="precio">$${p.precio}</p>
                <div class="botones-tarjeta">
                    <button class="btn-agregar" onclick="agregarAlCarrito('${p._id}')">Agregar</button>
                    <button class="btn-ver-mas" onclick="verDetalle('${p._id}')">Ver Detalles</button>
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });
    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}

/* ==========================================================
   VISTA DE DETALLES (MODAL)
   ========================================================== */

async function verDetalle(id) {
    try {
        const respuesta = await fetch(`${URL_API}/${id}`);
        const p = await respuesta.json();

        const modal = document.getElementById("modal-detalle");
        const info = document.getElementById("detalle-info");

        if (!modal || !info) return;

        info.innerHTML = `
            <div class="detalle-grid">
                <img src="${p.image}" alt="${p.nombre}">
                <div>
                    <h2>${p.nombre}</h2>
                    <p class="categoria-tag">${p.category || 'Belleza'}</p>
                    <p class="descripcion">${p.description || 'Sin descripción disponible.'}</p>
                    <p class="precio-grande">$${p.precio}</p>
                    <p class="stock">Disponibles: ${p.stock} unidades</p>
                    <button class="btn-hero" onclick="agregarAlCarrito('${p._id}')">Añadir al Carrito</button>
                </div>
            </div>
        `;
        modal.classList.add("active");
    } catch (error) {
        console.error("Error al cargar el detalle");
    }
}

/* ==========================================================
   INICIALIZACIÓN
   ========================================================== */

// Cerrar modal al hacer clic en la X
document.querySelector(".cerrar-modal")?.addEventListener("click", () => {
    document.getElementById("modal-detalle").classList.remove("active");
});

// Cerrar modal al hacer clic fuera del contenido blanco
window.addEventListener("click", (e) => {
    const modal = document.getElementById("modal-detalle");
    if (e.target === modal) {
        modal.classList.remove("active");
    }
});

// Disparar carga de datos al abrir la página
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizarContadorCarrito();
});