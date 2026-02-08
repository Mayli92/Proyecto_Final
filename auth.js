function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado");
    alert("Sesión cerrada");
    window.location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", () => {
    const btnCerrar = document.getElementById("btn-cerrar-sesion");
    const logueado = localStorage.getItem("usuarioLogueado");

    if (!btnCerrar) return;

    if (logueado) {
        btnCerrar.style.display = "inline-block";
    } else {
        btnCerrar.style.display = "none";
    }
});
