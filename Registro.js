document.getElementById("registro-form").addEventListener("submit", e => {
    e.preventDefault();

    const usuario = {
        nombre: document.getElementById("reg-nombre").value,
        email: document.getElementById("reg-email").value,
        password: document.getElementById("reg-password").value
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));
    alert("Usuario registrado con éxito");

    window.location.href = "login.html";
});
