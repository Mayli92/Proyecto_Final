document.addEventListener("DOMContentLoaded", () => {
    // Variables de estado global para la paginación y el carrito
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let limiteProductos = 100; // Máximo que la API devolverá por llamada, aunque usaremos paginación por scroll
    let productosSaltados = 0; // Contador de productos ya cargados (offset)
    let cargando = false; // Bandera para evitar peticiones duplicadas
    let todosCargados = false; // Indicador de finalización de productos

    // 🟢 LISTA DE CATEGORÍAS A INCLUIR (¡Añadida!) 🟢
    const categoriasDeseadas = [
        'beauty', 
        'fragrances', 
        'skin-care', 
        'womens-bags', 
        'womens-dresses',
        'womens-jewellery',
        'womens-shoes',
        'womens-watches'
    ];

    const actualizarContador = () => {
        const contadorCarrito = document.getElementById("contador-carrito");
        if (contadorCarrito) {
            contadorCarrito.textContent = carrito.length;
        }
    };

    const agregarProducto = (producto) => {
        const productoExistente = carrito.find(p => p.id === producto.id);

        if (productoExistente) {
            productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
        } else {
            producto.cantidad = 1;
            carrito.push(producto);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert(`${producto.title} agregado al carrito.`);
        actualizarContador();
    };

    // FUNCIÓN MODIFICADA PARA USAR ASYNC/AWAIT, LIMIT Y SKIP CON FILTRADO LOCAL
    const renderizarProductos = async () => {
        if (cargando || todosCargados) return;
        cargando = true;

        // Construye la URL con LIMIT y SKIP para la paginación (usando el endpoint general /products)
        
        const url = `https://dummyjson.com/products?limit=100&skip=${productosSaltados}`;
        
        let contenedorProductos = document.getElementById("productos-contenedor");
        if (!contenedorProductos) {
            console.error("No se encontró el contenedor de productos con ID 'productos-contenedor'.");
            cargando = false;
            return;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();

            // 1. Verificar si hay productos y aplicar el filtro de categorías
            const productosRecibidos = data.products || [];
            
            // 🟢 FILTRADO LOCAL DE PRODUCTOS POR CATEGORÍA 🟢
            const productosFiltrados = productosRecibidos.filter(producto => 
                categoriasDeseadas.includes(producto.category)
            );
            
            // 2. Comprobar si se ha llegado al final de la API global
            if (productosRecibidos.length === 0 || productosSaltados >= data.total) {
                todosCargados = true;
                contenedorProductos.insertAdjacentHTML('beforeend', '<p style="text-align:center; width: 100%; margin: 20px;">No hay más productos para cargar.</p>');
                cargando = false;
                return;
            }
            
            // 3. Renderizar solo los productos que pasaron el filtro
            for (const producto of productosFiltrados) {

                let stockProducto = document.createElement("p");
                stockProducto.textContent = `Stock disponible: ${producto.stock}`;

                tarjetaProducto.appendChild(stockProducto);

                let tarjetaProducto = document.createElement("article");
                tarjetaProducto.classList.add("tarjeta-producto");

                let imagenProducto = document.createElement("img");
                imagenProducto.src = producto.images[0];
                imagenProducto.alt = producto.description;

                let tituloProducto = document.createElement("h3");
                tituloProducto.classList.add("titulo-producto");
                tituloProducto.textContent = producto.title;

                let precioProducto = document.createElement("p");
                precioProducto.textContent = `$${producto.price.toFixed(2)}`;

                let btnAgregar = document.createElement("button");
                btnAgregar.textContent = "Agregar al Carrito";
                btnAgregar.classList.add("btn-agregar");

                btnAgregar.addEventListener("click", () => {
                    agregarProducto(producto);
                });

                let btnCarrito = document.createElement("btn-ircarrito");
                btnCarrito.textContent = "Ir al Carrito";
                btnCarrito.classList.add("btn-ircarrito"); 

                btnCarrito.addEventListener("click", () => {
                    window.location.href = "carrito.html";
                });


                tarjetaProducto.appendChild(imagenProducto);
                tarjetaProducto.appendChild(tituloProducto);
                tarjetaProducto.appendChild(precioProducto);
                tarjetaProducto.appendChild(btnAgregar);
                tarjetaProducto.appendChild(btnCarrito);

                contenedorProductos.appendChild(tarjetaProducto);
            }

            // Aumenta el offset para la siguiente llamada (basado en lo que la API envió)
            productosSaltados += productosRecibidos.length;
            
        } catch (error) {
            console.error("Error al cargar los productos de la API:", error);
            if (productosSaltados === 0) {
                contenedorProductos.textContent = "Error al cargar los productos. Por favor, inténtelo más tarde.";
            }
        } finally {
            cargando = false;
        }
    };

    // FUNCIÓN PARA MANEJAR EL SCROLL (DESPLAZAMIENTO INFINITO)
    const manejarScroll = () => {
        // Altura total del documento
        const alturaDocumento = document.documentElement.scrollHeight;
        // Posición actual del scroll + altura de la ventana visible
        const posicionScroll = window.scrollY + window.innerHeight;

        // Si estamos 10px cerca del final y no estamos cargando, solicitamos más productos
        if (posicionScroll >= alturaDocumento - 10 && !cargando && !todosCargados) {
            renderizarProductos();
        }
    };

    // 1. Carga inicial
    renderizarProductos();
    
    // 2. Adjuntar el evento de scroll para la carga infinita
    window.addEventListener('scroll', manejarScroll);
    
    // 3. Inicializa el contador del carrito
    actualizarContador();
});