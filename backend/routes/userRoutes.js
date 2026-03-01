const express = require("express");
const nodemailer = require('nodemailer'); 
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Tu modelo de Mongoose
const auth = require("../middleware/auth"); // Tu middleware de backend



// Configura el transporte (ejemplo con Gmail)
const sgMail = require('@sendgrid/mail');
// Reemplaza esto por tu código largo de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Asegúrate de usar process.env.SENDGRID_API_KEY en producción

/* --- REGISTRO --- */
router.post("/register", async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;

        // Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) return res.status(400).json("El usuario ya existe");

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ nombre, apellido, email, password: hashedPassword });
        await user.save();

        res.json("Usuario registrado correctamente");
    } catch (error) {
        console.error("DETALLE DEL ERROR:", error.message); 
        res.status(500).json("Error: " + error.message);
    }
});

/* --- LOGIN --- */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json("Credenciales inválidas");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json("Credenciales inválidas");

        // Crear Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        // AQUÍ ESTÁ LA CLAVE: Enviamos 'nombre' para que coincida con tu login.js
        res.json({
            token,
            nombre: user.nombre,
            email: user.email
        });
    } catch (error) {
        res.status(500).json("Error en el login");
    }
});


router.post('/newsletter', async (req, res) => {
    const { email } = req.body;

    const msg = {
        to: email, 
        from: 'lasmagnoliasbeauty2026@gmail.com', // EL MISMO QUE VERIFICASTE
        subject: '¡Bienvenida a Las Magnolias! 🌸',
        text: 'Gracias por suscribirte a nuestra comunidad.',
        html: `
            <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px; text-align: center;">
                <h2 style="color: #d48d9a;">¡Hola! Gracias por unirte</h2>
                <p>Tu cupón de 10% de descuento es: <strong>MAGNOLIA10</strong></p>
                <p>Te esperamos pronto en nuestra tienda.</p>
            </div>
        `,
    };

    try {
        await sgMail.send(msg);
        res.status(200).json({ mensaje: "Correo enviado" });
    } catch (error) {
        // Esto ayuda a ver por qué falla en la consola del servidor
        console.error("Error de SendGrid:", error.response ? error.response.body : error);
        res.status(500).json({ error: "Error al enviar el correo" });
    }
});
/* --- OBTENER PERFIL (Protegida) --- */
router.get("/perfil", auth, async (req, res) => {
    try {
        // req.user.id viene de tu middleware de backend 'auth'
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json("Error al obtener el perfil");
    }
});

module.exports = router;
