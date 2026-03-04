// Usamos var o una validación para evitar el error de "already declared"
if (typeof listaResenas === 'undefined') {
    window.listaResenas = [
        { estrellas: 5, texto: "La crema facial cambió mi rutina...", nombre: "Maria G." },
        { estrellas: 4, texto: "Me encanta el aroma de los perfumes...", nombre: "Sofia L." },
        { estrellas: 5, texto: "El set de maquillaje es perfecto...", nombre: "Carla M." },
    ];
}

// 1. CARGAR PRODUCTOS DESDE LA API
async function cargarProductos(categoria = 'Todos') {
    const contenedor = document.getElementById("productos-contenedor");
    if(!contenedor) return;
    
    contenedor.innerHTML = "<p>Cargando productos...</p>";

    let url = "http://localhost:3000/api/products";
    if (categoria !== 'Todos') {
        url += `?categoria=${encodeURIComponent(categoria)}`;
    }

    try {
        const res = await fetch(url);
        const productos = await res.json();
        
        contenedor.innerHTML = ""; 

        if (productos.length === 0) {
            contenedor.innerHTML = "<p>No hay productos en esta categoría.</p>";
            return;
        }
        
        productos.forEach(p => {
            contenedor.innerHTML += `
                <div class="product-card">
                    <img src="${p.image}" alt="${p.nombre}">
                    <div class="info-card">
                        <h3>${p.nombre}</h3>
                        <p class="categoria-tag">${p.category || 'General'}</p>
                        <p class="precio">$${p.precio}</p>
                        <div class="botones-container">
                            <button class="btn-detalle" onclick="verDetalle('${p._id}')">
                                <i class="fas fa-eye"></i> Detalle
                            </button>
                            <button class="btn-agregar" onclick="agregarAlCarrito('${p._id}', '${p.nombre}', ${p.precio}, '${p.image}')">
                                <i class="fas fa-cart-plus"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = "<p>Error de conexión. ¿Está el backend prendido?</p>";
    }
}

// 2. LÓGICA DEL CARRITO (ESTO ES LO QUE FALTABA)
function agregarAlCarrito(id, nombre, precio, image) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    const producto = {_id: id, nombre, precio, image, cantidad: 1 };
    
    // Si ya existe, aumentar cantidad
    const existe = carrito.find(item => item._id === id);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ _id: id, nombre, precio, image, cantidad: 1 });
    }
    
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    // Feedback visual
    alert(`¡${nombre} agregado al carrito!`);
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.innerText = `Carrito (${totalItems})`;
    }
}

// 3. OTRAS FUNCIONES (Detalle, FAQ, Buscador)
async function verDetalle(id) {
    const modal = document.getElementById("modal-detalle");
    const contenedorInfo = document.getElementById("detalle-info");
    
    if (!modal || !contenedorInfo) return;

    // 1. Abrimos el modal con la clase active que definiste en CSS
    modal.classList.add("active");
    modal.style.display = "flex";
    contenedorInfo.innerHTML = "<p>Cargando detalles...</p>";

    try {
        // 2. Intentamos buscar el producto directamente en la API
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        
        if (!res.ok) throw new Error("Producto no encontrado en servidor");
        
        const p = await res.json();

        // 3. Dibujamos el contenido usando las clases de tu CSS
        contenedorInfo.innerHTML = `
            <div class="detalle-grid">
                <div class="detalle-imagen">
                    <img src="${p.image}" alt="${p.nombre}">
                </div>
                <div class="detalle-texto">
                    <span class="categoria-tag">${p.category || 'Fragancia'}</span>
                    <h2>${p.nombre}</h2>
                    <p>${p.description || 'Producto de alta calidad seleccionado especialmente para nuestra colección Las Magnolias.'}</p>
                    <p class="precio-grande">$${p.precio}</p>
                    <button class="btn-agregar" onclick="agregarAlCarrito('${p._id}', '${p.nombre}', ${p.precio}, '${p.image}')">
                        <i class="fas fa-cart-plus"></i> Añadir al carrito
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error:", error);
        contenedorInfo.innerHTML = `
            <div style="text-align:center; padding: 20px;">
                <p>Ocurrió un error al cargar el detalle.</p>
                <small>Verifica que la ruta GET /api/products/:id esté habilitada en tu backend.</small>
            </div>`;
    }
}

function filtrarProductos(cat, elemento) { // Quita la clase activa de todos los botones
    const botones = document.querySelectorAll('.btn-categoria');
    botones.forEach(btn => btn.classList.remove('active'));

    // Agrega la clase activa al botón presionado
    if (elemento) {
        elemento.classList.add('active');
    }

    // Llama a la carga de productos
    cargarProductos(cat);
}

function buscarPorNombre() {
    const texto = document.getElementById("input-busqueda").value.toLowerCase();
    const productos = document.querySelectorAll(".product-card");
    productos.forEach(card => {
        const nombre = card.querySelector("h3").innerText.toLowerCase();
        card.style.display = nombre.includes(texto) ? "block" : "none";
    });
}

function toggleFAQ(elemento) {
    const item = elemento.parentElement;
    item.classList.toggle('active');
}

function actualizarVistaResenas() {
    const contenedor = document.getElementById('contenedor-testimonios-dinamicos');
    if (!contenedor) return;
    contenedor.innerHTML = "";
    const ultimasTres = listaResenas.slice(-3).reverse();
    ultimasTres.forEach(resena => {
        let estrellasHTML = '⭐'.repeat(resena.estrellas);
        contenedor.innerHTML += `
            <div class="testimonio-card">
                <div class="estrellas">${estrellasHTML}</div>
                <p>"${resena.texto}"</p>
                <span>- ${resena.nombre}</span>
            </div>
        `;
    });
}


// 4. INICIO
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos('Todos');
    actualizarContadorCarrito();
    actualizarVistaResenas();

    const formResena = document.getElementById('form-resena');
    if (formResena) {
        formResena.addEventListener('submit', function(e) {
            e.preventDefault();
            listaResenas.push({
                estrellas: parseInt(document.getElementById('resena-estrellas').value),
                texto: document.getElementById('resena-texto').value,
                nombre: "Invitada"
            });
            actualizarVistaResenas();
            this.reset();
        });
    }
});

/* ==========================================================
   LÓGICA DEL NEWSLETTER (ENVÍO DE CORREO)
   ========================================================== */
const formNewsletter = document.getElementById("newsletter-form");

if (formNewsletter) {
    formNewsletter.addEventListener("submit", async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("newsletter-input");
        const btn = e.target.querySelector("button");

        btn.innerText = "ENVIANDO...";
        btn.disabled = true;

        try {
            const res = await fetch("http://localhost:3000/api/users/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailInput.value })
            });

            if (res.ok) {
                // VENTANA DE NOTIFICACIÓN
                alert("¡Suscripción exitosa! Revisa tu correo para ver tu regalo. 🌸");
                emailInput.value = "";
            } else {
                alert("Hubo un problema. Por favor, intenta más tarde.");
            }
        } catch (error) {
            alert("No se pudo conectar con el servidor.");
        } finally {
            btn.innerText = "SUSCRIBIRME";
            btn.disabled = false;
        }
    });
}

// Cerrar modal al hacer clic en la X
document.addEventListener("click", (e) => {
    const modal = document.getElementById("modal-detalle");
    // AGREGAMOS ESTA VALIDACIÓN:
    if (modal && (e.target.classList.contains("cerrar-modal") || e.target === modal)) {
        modal.style.display = "none";
        modal.classList.remove("active");
    }
});

actualizarContadorCarrito();