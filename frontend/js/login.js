document
    .getElementById("login-form")
    .addEventListener("submit", async e => {

        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {

            const res = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("usuarioLogueado", "true");
            localStorage.setItem("nombreUsuario", data.nombre);
            alert("Login exitoso");

            window.location.href = "index.html";

        } catch (error) {

            console.log(error);
            alert("Error en login");
        }
});
