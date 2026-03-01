document.getElementById("registro-form").addEventListener("submit", async e => {
    e.preventDefault();

    const nombre = document.getElementById("reg-nombre").value;
    const apellido = document.getElementById("reg-apellido").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    try {
        const res = await fetch("http://localhost:3000/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre,
                apellido,
                email,
                password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data);
            return;
        }

        alert("✅ Usuario registrado correctamente");
        window.location.href = "login.html";

    } catch (error) {
        console.error(error);
        alert("Error conectando con el servidor");
    }
});