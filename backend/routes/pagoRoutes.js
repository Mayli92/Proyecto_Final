const express = require("express");
const router = express.Router();

const { MercadoPagoConfig, Preference } = require("mercadopago");

/* -----------------
   CONFIGURACIÓN
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

        const body = {
            items: req.body.items
        };

        const response = await preference.create({ body });

        res.json({
            init_point: response.init_point
        });

    } catch (error) {
        console.log(error);
        res.status(500).json("Error al crear pago");
    }

});

module.exports = router;
