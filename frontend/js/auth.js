function cerrarSesion() {

    localStorage.clear();
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {

    const nombreSpan = document.getElementById("nombre-usuario");
    const nombre = localStorage.getItem("nombreUsuario");

    if (nombreSpan && nombre) {
        nombreSpan.textContent = `Hola, ${nombre} 👋`;
    }

    const btnCerrar = document.getElementById("btn-cerrar-sesion");

    if (btnCerrar) {
        btnCerrar.style.display = nombre ? "inline-block" : "none";
    }

});

function esAdmin() {

    const token = localStorage.getItem("token");
    if (!token) return false;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role === "admin";
}


function verificarToken() {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
        // Un JWT siempre tiene 3 partes. Verificamos antes de dividir.
        const partes = token.split(".");
        if (partes.length !== 3) throw new Error("Formato de token inválido");

        const payloadJSON = atob(partes[1]);
        const payload = JSON.parse(payloadJSON);
        
        const exp = payload.exp * 1000;

        if (Date.now() > exp) {
            alert("Sesión expirada");
            cerrarSesion();
        }
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        // Si el token es basura, mejor cerramos la sesión
        cerrarSesion();
    }
}


/* -----------------------
   PROTEGER PÁGINAS
----------------------- */
function verificarLogin() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Debes iniciar sesión");
        window.location.href = "login.html";
    }
}

