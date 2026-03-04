const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.post("/", async (req, res) => {
    try {
        const nuevoProducto = new Product(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// OBTENER PRODUCTOS (con soporte para filtros por categoría)
router.get("/", async (req, res) => {
    try {
        const { categoria } = req.query; // Leemos la categoría desde la URL
        let filtro = {};

        // Si el usuario envió una categoría y no es "Todos", filtramos en MongoDB
        if (categoria && categoria !== "Todos") {
            // Usamos una expresión regular para que no importe si es "Perfume" o "perfume"
            filtro = { category: { $regex: new RegExp("^" + categoria + "$", "i") } };
        }

        const productos = await Product.find(filtro);
        res.json(productos);
    } catch (error) {
        res.status(500).json("Error al obtener productos");
    }
});

//ELIMINAR producto
router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Producto eliminado" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar" });
    }
});

// EDITAR producto
router.put("/:id", async (req, res) => {
    try {
        const actualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(actualizado);
    } catch (err) {
        res.status(400).json({ message: "Error al actualizar" });
    }
});
// ESTA ES LA QUE TE FALTA Y CAUSA EL ERROR 404:
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "ID no válido o error de servidor" });
    }
});

module.exports = router;