/* js/auth-check.js */
function gestionarNavegacionGlobal() {
    const token = localStorage.getItem("token");
    const nombre = localStorage.getItem("nombreUsuario");

    // Elementos del DOM
    const menuPerfil = document.getElementById("menu-perfil");
    const menuLogin = document.getElementById("menu-login");
    const menuRegistro = document.getElementById("menu-registro"); // Vi que lo tienes en la foto
    const btnCerrarContenedor = document.getElementById("btn-cerrar-sesion");
    const nombreDisplay = document.getElementById("nombre-usuario-nav");

    if (token) {
        // Logueado
        if (menuPerfil) menuPerfil.style.display = "inline-block";
        if (btnCerrarContenedor) btnCerrarContenedor.style.display = "inline-block";
        if (menuLogin) menuLogin.style.display = "none";
        if (menuRegistro) menuRegistro.style.display = "none";
        
        if (nombreDisplay) {
            nombreDisplay.innerText = nombre ? `Hola, ${nombre} ✨` : "Mi Perfil";
        }
    } else {
        // No logueado
        if (menuPerfil) menuPerfil.style.display = "none";
        if (btnCerrarContenedor) btnCerrarContenedor.style.display = "none";
        if (menuLogin) menuLogin.style.display = "inline-block";
        if (menuRegistro) menuRegistro.style.display = "inline-block";
    }
}

document.addEventListener("DOMContentLoaded", gestionarNavegacionGlobal);

// Manejo del Logout
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "logout-btn") {
        localStorage.clear();
        window.location.href = "index.html";
    }
});