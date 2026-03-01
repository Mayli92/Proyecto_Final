const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const Product = require("../models/Product.js");
const Order = require("../models/Order.js");

/* -------------------------
   REALIZAR COMPRA
------------------------- */
router.post("/", auth, async (req, res) => {
    try {
        const { carrito } = req.body;
        console.log("CARRITO RECIBIDO:", carrito); // Para verificar los IDs en la terminal

        if (!carrito || carrito.length === 0) {
            return res.status(400).json("Carrito vacío");
        }

        let total = 0;
        let productosOrden = [];

        /* -------------------------
           VALIDAR STOCK Y PROCESAR PRODUCTOS
        ------------------------- */
        for (const item of carrito) {
            // Buscamos el producto por _id (de MongoDB) o id (del front)
            const producto = await Product.findById(item._id || item.id);

            if (!producto) {
                return res.status(404).json(`Producto no encontrado ID: ${item._id || item.id}`);
            }

            if (producto.stock < item.cantidad) {
                return res.status(400).json(`Stock insuficiente para ${producto.nombre}`);
            }

            /* Descontar stock en la base de datos */
            producto.stock -= item.cantidad;
            await producto.save();

            /* Formatear para el esquema de la orden */
            productosOrden.push({
                productoId: producto._id,
                title: producto.nombre,
                price: producto.precio,
                cantidad: item.cantidad
            });

            total += producto.precio * item.cantidad;
        }

        /* -------------------------
           CREAR Y GUARDAR LA ORDEN EN LA COLECCIÓN 'ORDERS'
        ------------------------- */
        const nuevaOrden = new Order({
            userId: req.user.id, // Extraído del token por el middleware auth.js
            productos: productosOrden,
            total: total,
            estado: "pagado"
        });

        await nuevaOrden.save();

        res.json("✅ Compra realizada y stock actualizado correctamente");

    } catch (error) {
        console.error("Error en compra:", error);
        res.status(500).json("Error al procesar la compra");
    }
});

/* -------------------------
   HISTORIAL DE COMPRAS
------------------------- */
router.get("/mis-compras", auth, async (req, res) => {
    try {
        const ordenes = await Order.find({ userId: req.user.id }).sort({ fecha: -1 });
        res.json(ordenes);
    } catch (error) {
        res.status(500).json("Error obteniendo historial");
    }
});

module.exports = router;