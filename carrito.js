document.addEventListener("DOMContentLoaded", () => {
    
    // Función para actualizar el contador en el HTML
    const productosEnCarrito = (carrito) => {
        let contadorCarrito = document.getElementById("contador-carrito"); 
        if(contadorCarrito) {
            contadorCarrito.textContent = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
        }
    };

    // Función principal para renderizar los productos en el carrito
    const renderizarProductos = () => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        
        productosEnCarrito(carrito); 

        let seccionProductos = document.getElementById("contenedor-carrito");
        seccionProductos.innerHTML = "";

        if (!carrito.length) {
            // ... (Lógica para carrito vacío) ...
            let mensajeCarrito = document.createElement("p");
            mensajeCarrito.classList.add("mensaje-carrito");
            mensajeCarrito.textContent = "No hay productos en el carrito";
            seccionProductos.appendChild(mensajeCarrito);

            document.getElementById("acciones-carrito").innerHTML = "";
            document.getElementById("resumen-carrito").innerHTML = "";
            // Oculta el formulario si está presente
            if (document.getElementById("formulario-compra")) {
                document.getElementById("formulario-compra").style.display = 'none';
            }
            
        } else {
            carrito.forEach((elemento, index) => {
                let tarjetaProducto = document.createElement("article");
                tarjetaProducto.classList.add("producto-carrito");
                // ... (Creación de elementos de producto) ...
                
                let imgProducto = document.createElement("img");
                imgProducto.src = elemento.images[0] || 'placeholder.jpg'; // Asegurar una imagen

                let tituloProducto = document.createElement("h3");
                tituloProducto.textContent = elemento.title;

                let cantidadProducto = document.createElement("p");
                cantidadProducto.textContent = `Cantidad: ${elemento.cantidad || 1} | $${elemento.price} c/u`; 
                
                let precioSubtotal = document.createElement("p");
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
            
            renderizarResumen(carrito);
            renderizarBotones();
        }
    };
    
    const eliminarProducto = (indice) => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.splice(indice, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert("Producto eliminado del carrito");
        renderizarProductos()
    };

    const vaciarCarrito = () => {
        localStorage.removeItem("carrito");
        alert("Vaciando Carrito");
        renderizarProductos()
    };

    // Función AÑADIDA para calcular y mostrar el total
    const renderizarResumen = (carrito) => {
        let seccionResumen = document.getElementById("resumen-carrito");
        seccionResumen.innerHTML = "";

        const total = carrito.reduce((acumulador, producto) => {
            return acumulador + (producto.price * (producto.cantidad || 1));
        }, 0);

        let pTotal = document.createElement("p");
        pTotal.classList.add("carrito-total");
        pTotal.textContent = `TOTAL A PAGAR: $${total.toFixed(2)}`;

        seccionResumen.appendChild(pTotal);
    };

    // ** LÓGICA DE ENVÍO DE FORMULARIO Y NOTIFICACIONES **
    const configurarFormularioFinalizacion = (carrito) => {
        const form = document.getElementById("form-finalizar-compra");
        const inputTotal = document.getElementById("input-total-compra");
        const inputDetalle = document.getElementById("input-detalle-compra");
        
        if (!form) return; 

        // 1. Calcular y configurar el total
        const total = carrito.reduce((acumulador, producto) => {
            return acumulador + (producto.price * (producto.cantidad || 1));
        }, 0);

        // 2. Crear el detalle de la compra para el email (legible)
        const detalleCompra = carrito.map(p => 
            `* ${p.title} (${p.cantidad || 1} unidad/es) - $${p.price.toFixed(2)} c/u`
        ).join('\n');
        
        // 3. Llenar los campos ocultos del formulario
        inputTotal.value = `$${total.toFixed(2)}`;
        inputDetalle.value = `Productos:\n${detalleCompra}`;

        // 4. Manejar el envío del formulario
        // Se añade el listener de forma segura
        form.removeEventListener("submit", handleFormSubmit); 
        form.addEventListener("submit", handleFormSubmit);

        async function handleFormSubmit(event) {
            event.preventDefault(); 

            // Simula captura de datos para la notificación
            const datosCliente = {
                nombre: document.getElementById("nombre-cliente").value,
                apellido: document.getElementById("apellido-cliente").value,
                email: document.getElementById("email-cliente").value,
                total: inputTotal.value,
                detalle: inputDetalle.value
            };

            // SIMULACIÓN DE ENVÍO POR SERVICIO EXTERNO (ej: Formspree)
            try {
                // Se envía el formulario al endpoint configurado
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json' // Necesario para Formspree
                    }
                });

                if (response.ok) {
                    // ** NOTIFICACIÓN AL VENDEDOR (SIMULADA POR EL ALERT) **
                    const mensaje = `¡Compra Finalizada con Éxito!\n\n` +
                                    `NOTIFICACIÓN AL VENDEDOR:\n` +
                                    `--------------------------\n` +
                                    `✅ Compra efectuada con éxito.\n` +
                                    `✅ Se ha enviado el comprobante/factura a: ${datosCliente.email}\n\n` +
                                    `DATOS DEL CLIENTE:\n` +
                                    `- Nombre: ${datosCliente.nombre} ${datosCliente.apellido}\n` +
                                    `- Correo: ${datosCliente.email}\n\n` +
                                    `DETALLE DE COMPROBANTE ENVIADO:\n` +
                                    `- Total: ${datosCliente.total}\n` +
                                    `${datosCliente.detalle}`;

                    alert(mensaje);

                    // Limpiar el carrito y redirigir
                    localStorage.removeItem("carrito");
                    window.location.href = "index.html"; 
                } else {
                    alert("Error al procesar la compra. Inténtelo de nuevo o revise la configuración de Formspree.");
                }
            } catch (error) {
                console.error("Error de conexión al finalizar la compra:", error);
                alert("Error de conexión al finalizar la compra. Asegúrese de que el endpoint de Formspree es correcto.");
            }
        }
    }
    
    // Función para renderizar los botones de "Vaciar" y "Finalizar"
    const renderizarBotones = () => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let divAcciones = document.getElementById("acciones-carrito"); 
        divAcciones.innerHTML = "";
        const formularioCompra = document.getElementById("formulario-compra");

        if (formularioCompra) {
            formularioCompra.style.display = 'none';
        }

        if (carrito.length) {
            let btnVaciar = document.createElement("button");
            btnVaciar.textContent = "Vaciar carrito";
            btnVaciar.addEventListener("click", vaciarCarrito);

            let btnFinalizar = document.createElement("button");
            btnFinalizar.textContent = "Finalizar Compra";
            btnFinalizar.id = "btn-finalizar-compra"; 

            btnFinalizar.addEventListener("click", () => {
                // OCULTAMOS EL BOTÓN DE FINALIZAR Y MOSTRAMOS EL FORMULARIO
                if (formularioCompra) {
                    formularioCompra.style.display = 'block';
                }
                btnFinalizar.style.display = 'none';
            });

            divAcciones.appendChild(btnVaciar);
            divAcciones.appendChild(btnFinalizar);
            
            // Configura el manejador del formulario de finalización
            configurarFormularioFinalizacion(carrito);
        }
    };
    
    // Inicia la renderización al cargar la página
    renderizarProductos()
});