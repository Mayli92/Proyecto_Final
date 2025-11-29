document.addEventListener("DOMContentLoaded", () => {
    
    // Función principal para renderizar los productos en el carrito
    const renderizarProductos = () => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        
        // 1. Actualiza el contador
        productosEnCarrito(carrito); 

        let seccionProductos = document.getElementById("contenedor-carrito");
        seccionProductos.innerHTML = "";

        if (!carrito.length) {
            let mensajeCarrito = document.createElement("p");
            mensajeCarrito.classList.add("mensaje-carrito");
            mensajeCarrito.textContent = "No hay productos en el carrito";
            seccionProductos.appendChild(mensajeCarrito);
            
            // Si el carrito está vacío, limpia también las secciones de acciones y resumen
            document.getElementById("acciones-carrito").innerHTML = "";
            document.getElementById("resumen-carrito").innerHTML = "";
            
        } else {
            carrito.forEach((elemento, index) => {
                let tarjetaProducto = document.createElement("article");
                tarjetaProducto.classList.add("producto-carrito");

                let imgProducto = document.createElement("img");
                // Asume que images es un array y tiene al menos un elemento
                imgProducto.src = elemento.images[0]; 
                imgProducto.width = 100; // Por ejemplo, 100 píxeles de ancho
                imgProducto.height = 70; // Por ejemplo, 70 píxeles de alto

                let tituloProducto = document.createElement("h3");
                tituloProducto.textContent = elemento.title;

                let cantidadProducto = document.createElement("p");
                // Muestra la cantidad y el precio unitario
                cantidadProducto.textContent = `Cantidad: ${elemento.cantidad || 1} | $${elemento.price} c/u`; 
                
                let precioSubtotal = document.createElement("p");
                // Calcula el subtotal del item: precio * cantidad
                const subtotal = elemento.price * (elemento.cantidad || 1); 
                precioSubtotal.textContent = `Subtotal: $${subtotal.toFixed(2)}`;

                let btnEliminar = document.createElement("button");
                btnEliminar.classList.add("btn-eliminar-carrito");
                btnEliminar.textContent = "Eliminar";

                btnEliminar.addEventListener("click", () => {
                    eliminarProducto(index)
                })

                tarjetaProducto.appendChild(imgProducto);
                tarjetaProducto.appendChild(tituloProducto);
                tarjetaProducto.appendChild(cantidadProducto);
                tarjetaProducto.appendChild(precioSubtotal);
                tarjetaProducto.appendChild(btnEliminar);

                seccionProductos.appendChild(tarjetaProducto);
            });
            
            // 2. Llama a las funciones de acciones y resumen
            renderizarBotones();
            renderizarResumen(carrito);
        }
    };

    // Función para renderizar los botones de "Vaciar" y "Continuar Comprando"
    const renderizarBotones = () => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let divAcciones = document.getElementById("acciones-carrito"); 
        divAcciones.innerHTML = "";

        if (carrito.length) {
            // 1. Botón Vaciar Carrito
            let btnVaciar = document.createElement("button");
            btnVaciar.textContent = "Vaciar carrito";
            // APLICACIÓN DE ESTILOS CSS
            btnVaciar.classList.add("btn-accion-carrito", "btn-vaciar-carrito"); 

            btnVaciar.addEventListener("click", () => {
                vaciarCarrito();
            });
            
            // 2. Enlace Continuar Comprando
            let linkContinuar = document.createElement("a"); // Usamos <a> para redirección
            linkContinuar.textContent = "Continuar Comprando";
            linkContinuar.href = "index.html";
            // APLICACIÓN DE ESTILOS CSS
            linkContinuar.classList.add("btn-accion-carrito", "btn-continuar-compra"); 
            
            divAcciones.appendChild(btnVaciar);
            divAcciones.appendChild(linkContinuar);
        }
    };
    
    // Función para calcular y mostrar el resumen y el botón de finalizar compra
    const renderizarResumen = (carrito) => {
        let seccionResumen = document.getElementById("resumen-carrito");
        seccionResumen.innerHTML = "";

        // Calcular el total
        const total = carrito.reduce((acumulador, producto) => {
            return acumulador + (producto.price * (producto.cantidad || 1));
        }, 0);

        // 1. Contenedor para la línea de Total (usa clases CSS)
        let divTotal = document.createElement("div");
        divTotal.classList.add("resumen-linea");
        divTotal.id = "total-final"; // Aplica estilo de línea superior y fuente grande

        let spanTexto = document.createElement("span");
        spanTexto.textContent = "Total a Pagar:";
        
        let spanValor = document.createElement("span");
        spanValor.textContent = `$${total.toFixed(2)}`;
        
        divTotal.appendChild(spanTexto);
        divTotal.appendChild(spanValor);

        // 2. Botón de Checkout (usa ID CSS)
        let btnCheckout = document.createElement("button");
        btnCheckout.textContent = "Proceder al Pago";
        btnCheckout.id = "btn-checkout"; // APLICACIÓN DE ESTILOS CSS

        btnCheckout.addEventListener("click", () => {
            let confirmado = confirm("¿Estás seguro que deseas finalizar la compra?");
            if (confirmado) {
                alert("Gracias por su compra");
                localStorage.removeItem("carrito");
                window.location.href = "index.html"; // Mantiene la redirección original a la página principal
            }
        });
        
        seccionResumen.appendChild(divTotal);
        seccionResumen.appendChild(btnCheckout);
    };

    // Función para actualizar el contador en el HTML
    const productosEnCarrito = (carrito) => {
        // ID CORREGIDO: "contador-carrito"
        let contadorCarrito = document.getElementById("contador-carrito"); 
        // Asegura que el contador existe antes de actualizarlo
        if(contadorCarrito) {
            contadorCarrito.textContent = carrito.length;
        }
    };

    // Función para eliminar un producto
    const eliminarProducto = (indice) => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.splice(indice, 1);

        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert("Producto eliminado del carrito");
        renderizarProductos()
    };

    // Función para vaciar todo el carrito
    const vaciarCarrito = () => {
        localStorage.removeItem("carrito");
        alert("Vaciando Carrito");
        renderizarProductos()
    };
    
    // Inicia la renderización al cargar la página
    renderizarProductos()
});