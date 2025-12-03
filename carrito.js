document.addEventListener("DOMContentLoaded", () => {
    
    // Función para actualizar el contador en el HTML (suma el total de UNIDADES)
    const productosEnCarrito = (carrito) => {
        let contadorCarrito = document.getElementById("contador-carrito"); 
        
        if (contadorCarrito) {
            // Calcula la suma de la propiedad 'cantidad' de todos los productos
            const totalUnidades = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
            contadorCarrito.textContent = totalUnidades;
        }
    };

    // Función principal para renderizar los productos en el carrito
    const renderizarProductos = () => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        
        productosEnCarrito(carrito); 

        let seccionProductos = document.getElementById("contenedor-carrito");
        let divAcciones = document.getElementById("acciones-carrito"); 
        let seccionResumen = document.getElementById("resumen-carrito");

        seccionProductos.innerHTML = "";

        if (!carrito.length) {
            // Lógica para carrito vacío
            let mensajeCarrito = document.createElement("p");
            mensajeCarrito.classList.add("mensaje-carrito");
            mensajeCarrito.textContent = "No hay productos en el carrito";
            seccionProductos.appendChild(mensajeCarrito);

            if(divAcciones) divAcciones.innerHTML = "";
            if(seccionResumen) seccionResumen.innerHTML = "";
            
            // Oculta el formulario si está presente
            const formularioCompra = document.getElementById("formulario-compra");
            if (formularioCompra) {
                formularioCompra.style.display = 'none';
            }
            
        } else {
            carrito.forEach((elemento, index) => {
                let tarjetaProducto = document.createElement("article");
                tarjetaProducto.classList.add("producto-carrito");
                
                let imgProducto = document.createElement("img");
                // Asegura usar la primera imagen disponible o un placeholder
                imgProducto.src = elemento.images ? elemento.images[0] : 'placeholder.jpg'; 

                let tituloProducto = document.createElement("h3");
                tituloProducto.textContent = elemento.title;

                let cantidadProducto = document.createElement("p");
                cantidadProducto.textContent = `Cant: ${elemento.cantidad || 1} | $${elemento.price} c/u`; 
                
                let precioSubtotal = document.createElement("p");
                const subtotal = elemento.price * (elemento.cantidad || 1); 
                precioSubtotal.textContent = `Subtotal: $${subtotal.toFixed(2)}`;

                let btnEliminar = document.createElement("button");
                btnEliminar.classList.add("btn-eliminar-carrito", "btn-eliminar");
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

    // Función para calcular y mostrar el total
    const renderizarResumen = (carrito) => {
        let seccionResumen = document.getElementById("resumen-carrito");
        if (!seccionResumen) return;

        seccionResumen.innerHTML = "";

        const total = carrito.reduce((acumulador, producto) => {
            return acumulador + (producto.price * (producto.cantidad || 1));
        }, 0);

        let pTotal = document.createElement("p");
        pTotal.classList.add("carrito-total");
        pTotal.textContent = `TOTAL A PAGAR: $${total.toFixed(2)}`;

        seccionResumen.appendChild(pTotal);
    };

    // ** LÓGICA DE ENVÍO DE FORMULARIO Y NOTIFICACIONES CON MODAL **
    const configurarFormularioFinalizacion = (carrito) => {
        const form = document.getElementById("form-finalizar-compra");
        const inputTotal = document.getElementById("input-total-compra");
        const inputDetalle = document.getElementById("input-detalle-compra");
        
        if (!form || !inputTotal || !inputDetalle) return; // Asegura que los elementos existan

        // 1. Calcular y configurar el total
        const total = carrito.reduce((acumulador, producto) => {
            return acumulador + (producto.price * (producto.cantidad || 1));
        }, 0);

        // 2. Crear el detalle de la compra para el email (formato de texto)
        const detalleCompra = carrito.map(p => 
            `* ${p.title} (${p.cantidad || 1} unidad/es) - $${p.price.toFixed(2)} c/u`
        ).join('\n');
        
        // 3. Llenar los campos ocultos del formulario
        inputTotal.value = `$${total.toFixed(2)}`;
        inputDetalle.value = `Productos:\n${detalleCompra}`;

        // 4. Manejar el envío del formulario
        form.removeEventListener("submit", handleFormSubmit); 
        form.addEventListener("submit", handleFormSubmit);

        async function handleFormSubmit(event) {
            event.preventDefault(); 

            // Captura de datos del cliente
            const datosCliente = {
                nombre: document.getElementById("nombre-cliente").value,
                apellido: document.getElementById("apellido-cliente").value,
                email: document.getElementById("email-cliente").value,
                total: inputTotal.value,
                detalle: inputDetalle.value
            };

            // Validar que el formulario HTML haya marcado todos los campos como válidos
            if (!form.checkValidity()) {
                alert("Por favor, complete todos los campos requeridos.");
                return;
            }

            // SIMULACIÓN DE ENVÍO POR SERVICIO EXTERNO (ej: Formspree)
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json' 
                    }
                });

                if (response.ok) {
                    
                    // Lógica para mostrar la MODAL personalizada
                    const modal = document.getElementById("comprobante-modal");
                    const btnAceptar = document.getElementById("btn-modal-aceptar");

                    if(modal && btnAceptar) {
                        // 1. Llenar la Modal con los datos
                        document.getElementById("modal-cliente-nombre").textContent = `Cliente: ${datosCliente.nombre} ${datosCliente.apellido}`;
                        document.getElementById("modal-cliente-email").textContent = `Correo: ${datosCliente.email}`;
                        document.getElementById("modal-total").textContent = datosCliente.total;
                        document.getElementById("modal-detalle").textContent = datosCliente.detalle;
                        
                        // 2. Mostrar la Modal
                        modal.classList.add('active');

                        // 3. Manejar el cierre de la Modal y la redirección
                        // Se usa 'once: true' para que el listener se elimine automáticamente después del click
                        btnAceptar.addEventListener('click', () => {
                            modal.classList.remove('active'); // Ocultar
                            
                            // Limpiar el carrito y redirigir
                            localStorage.removeItem("carrito");
                            window.location.href = "index.html"; 
                        }, { once: true });
                    } else {
                        // Fallback si la modal no se encuentra (vuelve al alert simple)
                         const mensaje = `¡Compra Finalizada con Éxito!\n\n` +
                                    `NOTIFICACIÓN AL VENDEDOR:\n` +
                                    `✅ Compra efectuada con éxito.\n` +
                                    `✅ Se ha enviado el comprobante/factura a: ${datosCliente.email}\n` +
                                    `DATOS DEL CLIENTE:\n` +
                                    `- Nombre: ${datosCliente.nombre} ${datosCliente.apellido}\n` +
                                    `- Correo: ${datosCliente.email}\n` +
                                    `- Total: ${datosCliente.total}`;
                        alert(mensaje);
                        localStorage.removeItem("carrito");
                        window.location.href = "index.html"; 
                    }

                } else {
                    alert("Error al procesar la compra. Por favor, revise sus datos o la configuración de Formspree.");
                }
            } catch (error) {
                console.error("Error de conexión al finalizar la compra:", error);
                alert("Error de conexión al finalizar la compra. Inténtelo más tarde.");
            }
        }
    }
    
    // Función para renderizar los botones de "Vaciar" y "Finalizar"
    const renderizarBotones = () => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let divAcciones = document.getElementById("acciones-carrito"); 
        if (!divAcciones) return;
        
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
                // OCULTAMOS EL BOTÓN DE FINALIZAR y MOSTRAMOS EL FORMULARIO
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