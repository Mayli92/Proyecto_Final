document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    // Redirigir si no hay token
    if (!token) {
        alert("Debes iniciar sesión para acceder a tu perfil.");
        window.location.href = "login.html";
        return;
    }

    // Ejecutamos la navegación para que el nombre aparezca en el Nav de esta página
    gestionarNavegacionGlobal();


    // --- 1. CARGAR DATOS PERSONALES ---
try {
    const resUser = await fetch('http://localhost:3000/api/users/perfil', {
        headers: { 'x-auth-token': token }
    });
    const usuario = await resUser.json();

    // Consola para que veas EXACTAMENTE qué nombres te manda el servidor
    console.log("Datos recibidos:", usuario); 

    const nombreElem = document.getElementById("perf-nombre");
    const emailElem = document.getElementById("perf-email");

    if (nombreElem) {
        // Verificamos si las propiedades existen, si no, usamos alternativas
        const nombre = usuario.nombre || "Usuario";
        const apellido = usuario.apellido || "";
        nombreElem.innerText = `${nombre} ${apellido}`.trim();
    }
    
    if (emailElem) {
        emailElem.innerText = usuario.email || "Correo no disponible";
    }
    
} catch (err) {
    console.error("Error cargando perfil:", err);
}
    // --- 2. CARGAR HISTORIAL DE ÓRDENES ---
    try {
        const resOrders = await fetch('http://localhost:3000/api/compra/mis-compras', {
            headers: { 'x-auth-token': token }
        });
        const ordenes = await resOrders.json();
        const contenedor = document.getElementById("lista-ordenes");

        if (!contenedor) return;

        if (ordenes.length === 0) {
            contenedor.innerHTML = "<p>Aún no tienes compras registradas. ¡Te esperamos en la tienda! 🌸</p>";
            return;
        }

        contenedor.innerHTML = ""; 
        
        // Mostramos las más recientes primero
        ordenes.reverse().forEach(orden => {
            const fecha = new Date(orden.fecha).toLocaleDateString();
            
            contenedor.innerHTML += `
                <div class="orden-item">
                    <div class="orden-info">
                        <strong>Pedido #${orden._id.slice(-5).toUpperCase()}</strong>
                        <span>📅 ${fecha}</span>
                    </div>
                    <ul class="orden-productos">
                        ${orden.productos.map(p => `<li>• ${p.title || p.nombre} (x${p.cantidad})</li>`).join('')}
                    </ul>
                    <div class="orden-total">Total: $${orden.total}</div>
                </div>
            `;
        });
    } catch (err) {
        const contenedor = document.getElementById("lista-ordenes");
        if (contenedor) contenedor.innerHTML = "<p>Error al cargar el historial.</p>";
    }
});

/* Esta función es mejor tenerla en auth-check.js para que funcione en index.html */
function gestionarNavegacionGlobal() {
    const token = localStorage.getItem("token");
    const nombre = localStorage.getItem("nombreUsuario");

    const menuPerfil = document.getElementById("menu-perfil");
    const menuLogin = document.getElementById("menu-login");
    const btnCerrar = document.getElementById("btn-cerrar-sesion");
    const nombreDisplay = document.getElementById("nombre-usuario-nav");

    if (token) {
        if (menuPerfil) menuPerfil.style.display = "block";
        if (btnCerrar) btnCerrar.style.display = "block";
        if (menuLogin) menuLogin.style.display = "none";
        
        if (nombreDisplay) {
            nombreDisplay.innerText = nombre ? `Hola, ${nombre}` : "Mi Perfil";
        }
    } else {
        if (menuPerfil) menuPerfil.style.display = "none";
        if (btnCerrar) btnCerrar.style.display = "none";
        if (menuLogin) menuLogin.style.display = "block";
    }
}

// Un solo evento de Logout para evitar conflictos
document.addEventListener("click", (e) => {
    if (e.target && (e.target.id === "logout-btn" || e.target.parentElement?.id === "logout-btn")) {
        localStorage.clear();
        window.location.href = "index.html";
    }
});