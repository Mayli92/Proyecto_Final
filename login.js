document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        alert("No hay usuarios registrados");
        return;
    }

    if (
        loginEmail.value === usuario.email &&
        loginPassword.value === usuario.password
    ) {
        localStorage.setItem("usuarioLogueado", "true");
        alert("Inicio de sesión exitoso");
        window.location.href = "index.html";
    } else {
        alert("Email o contraseña incorrectos");
    }
});

