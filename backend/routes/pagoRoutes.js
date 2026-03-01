/* -----------------
   IMPORTACIONES
----------------- */
const express = require("express");
const router = express.Router();

const { MercadoPagoConfig, Preference } = require("mercadopago");

/* -----------------
   CONFIGURACIÓN MP
----------------- */
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_TOKEN
});

const preference = new Preference(client);


/* -----------------
   CREAR PAGO
----------------- */
router.post("/pago", async (req, res) => {

    try {

        // ⭐ Items que manda el frontend
        const items = req.body.items;

        if (!items || items.length === 0) {
            return res.status(400).json("No hay productos para pagar");
        }

        const body = {
            items: items.map(item => ({
                title: item.title,
                quantity: Number(item.quantity),
                unit_price: Number(item.unit_price),
                currency_id: "ARS"
            }))
        };

        const response = await preference.create({ body });

        res.json({
            init_point: response.init_point
        });

    } catch (error) {

        console.log("❌ Error MercadoPago:", error);
        res.status(500).json("Error al generar el pago");
    }
});


module.exports = router;
