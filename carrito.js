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

    // Función para renderizar los botones de "Vaciar" y "Finalizar"
    const renderizarBotones = () => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        // ID CORREGIDO: "acciones-carrito"
        let divAcciones = document.getElementById("acciones-carrito"); 
        divAcciones.innerHTML = "";

        if (carrito.length) {
            let btnVaciar = document.createElement("button");
            btnVaciar.textContent = "Vaciar carrito";

            btnVaciar.addEventListener("click", () => {
                vaciarCarrito();
            })

            let btnFinalizar = document.createElement("button");
            btnFinalizar.textContent = "Finalizar Compra"

            btnFinalizar.addEventListener("click", () => {
                let confirmado = confirm("¿Estás seguro que deseas finalizar la compra?");
                if (confirmado) {
                    alert("Gracias por su compra");
                    localStorage.removeItem("carrito");
                    window.location.href = "index.html"; // Redirige a la página principal
                }
            });
            divAcciones.appendChild(btnVaciar);
            divAcciones.appendChild(btnFinalizar);
        }
    };
    
    // Función AÑADIDA para calcular y mostrar el total
    const renderizarResumen = (carrito) => {
        let seccionResumen = document.getElementById("resumen-carrito");
        seccionResumen.innerHTML = "";

        // Calcular el total
        // Suma el precio de cada producto multiplicado por su cantidad (si no existe cantidad, asume 1)
        const total = carrito.reduce((acumulador, producto) => {
            return acumulador + (producto.price * (producto.cantidad || 1));
        }, 0);

        let pTotal = document.createElement("p");
        pTotal.classList.add("carrito-total");
        pTotal.textContent = `TOTAL A PAGAR: $${total.toFixed(2)}`; // toFixed(2) para dos decimales

        seccionResumen.appendChild(pTotal);
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