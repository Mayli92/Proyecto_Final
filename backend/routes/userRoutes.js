const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* -----------------
   REGISTRO
----------------- */
router.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            nombre: req.body.nombre,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();

        res.json({ message: "Usuario creado" });

    } catch (error) {
        res.status(500).json(error.message);
    }
});

/* -----------------
   LOGIN
----------------- */
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(400).json("Usuario no existe");

        const valid = await bcrypt.compare(req.body.password, user.password);

        if (!valid) return res.status(400).json("Contraseña incorrecta");

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );

        res.json({ token });

    } catch (error) {
        res.status(500).json(error.message);
    }
});

module.exports = router;
