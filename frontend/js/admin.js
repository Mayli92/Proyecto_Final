let editandoID = null;

// 1. CARGAR LA LISTA AL INICIAR
async function consultarProductos() {
    const listaAdmin = document.getElementById("lista-productos-admin");
    if (!listaAdmin) return;

    try {
        const res = await fetch("http://localhost:3000/api/products");
        const productos = await res.json();
        // --- LÓGICA DE RESUMEN ---
        let totalStockBajo = 0;
        let valorTotal = 0;
        listaAdmin.innerHTML = "";
        productos.forEach(p => {
            // Estilo para stock bajo (menos de 5 unidades)
            const estiloStock = p.stock < 5 ? 'style="color:red; font-weight:bold; background-color:#ffe6e6;"' : '';
            
            listaAdmin.innerHTML += `
                <tr>
                    <td><img src="${p.image}" width="50" style="border-radius:5px;"></td>
                    <td><strong>${p.nombre}</strong>/td>
                    <td>${p.category || 'General'}</td>
                    <td>$${p.precio}</td>
                    <td><span class="${p.stock<5? 'stock-critico' : ''}">${p.stock}</span></td>
        <td>
                    <td>
                        <button onclick="prepararEdicion('${p._id}')" class="btn-editar">✏️</button>
                        <button onclick="eliminarProducto('${p._id}')" class="btn-eliminar">🗑️</button>
                    </td>
                </tr>
            `;
        });

        // Actualizar las tarjetas del Dashboard
        document.getElementById("total-productos").innerText = productos.length;
        document.getElementById("stock-bajo-count").innerText = totalStockBajo;
        document.getElementById("valor-inventario").innerText = `$ ${valorTotal.toLocaleString()}`;
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// 2. ELIMINAR PRODUCTO
async function eliminarProducto(id) {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`, { method: "DELETE" });
        if (res.ok) {
            alert("✅ Producto eliminado");
            consultarProductos();
        }
    } catch (error) {
        alert("❌ Error al conectar con el servidor");
    }
}

// 3. PREPARAR EDICIÓN
async function prepararEdicion(id) {
    try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const p = await res.json();

        document.getElementById("admin-nombre").value = p.nombre;
        document.getElementById("admin-descripcion").value = p.description || "";
        document.getElementById("admin-precio").value = p.precio;
        document.getElementById("admin-stock").value = p.stock;
        document.getElementById("admin-imagen").value = p.image;
        document.getElementById("admin-categoria").value = p.category || "";

        editandoID = id; 
        const btn = document.querySelector("#admin-form button");
        btn.innerText = "Actualizar Producto";
        btn.style.backgroundColor = "#d48d9a";
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        alert("Error al obtener datos");
    }
}

// 4. FUNCIÓN DE BÚSQUEDA (Fuera de los eventos)
function filtrarTablaAdmin() {
    const texto = document.getElementById("input-busqueda-admin").value.toLowerCase();
    const filas = document.querySelectorAll("#lista-productos-admin tr");

    filas.forEach(fila => {
        const nombreProducto = fila.cells[1].innerText.toLowerCase();
        fila.style.display = nombreProducto.includes(texto) ? "" : "none";
    });
}

// 5. EVENTO SUBMIT (CREAR O EDITAR)
document.getElementById("admin-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const producto = {
        nombre: document.getElementById("admin-nombre").value,
        description: document.getElementById("admin-descripcion").value,
        precio: parseFloat(document.getElementById("admin-precio").value),
        stock: parseInt(document.getElementById("admin-stock").value),
        image: document.getElementById("admin-imagen").value,
        category: document.getElementById("admin-categoria").value
    };

    const url = editandoID 
        ? `http://localhost:3000/api/products/${editandoID}` 
        : "http://localhost:3000/api/products";
    
    const metodo = editandoID ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });

        if (res.ok) {
            alert(editandoID ? "✅ Producto actualizado" : "✅ Producto creado");
            
            editandoID = null;
            document.getElementById("admin-form").reset();
            const btn = document.querySelector("#admin-form button");
            btn.innerText = "Guardar Producto";
            btn.style.backgroundColor = "";
            
            consultarProductos(); 
        }
    } catch (error) {
        alert("Error al procesar la solicitud");
    }
});

// Iniciar al cargar
document.addEventListener("DOMContentLoaded", consultarProductos);