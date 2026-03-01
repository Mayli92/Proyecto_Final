/* -----------------
   IMPORTACIONES
----------------- */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

/* -----------------
   IMPORTAR MIDDLEWARE
----------------- */
const auth = require("./middleware/auth.js");

/* -----------------
   IMPORTAR RUTAS
----------------- */
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js"); // Organizado
const pagoRoutes = require("./routes/pagoRoutes.js");       // Organizado
const compraRoutes = require("./routes/compraRoutes.js");

/* -----------------
   IMPORTAR MODELOS
----------------- */
const Product = require("./models/Product.js");
const Order = require("./models/Order.js");

/* -----------------
   APP EXPRESS
----------------- */
const app = express();


/* -----------------
   MIDDLEWARES
----------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -----------------
   CONEXIÓN MONGODB
----------------- */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB conectado"))
    .catch(err => console.log("❌ Error MongoDB:", err));


/* -----------------
   RUTAS USUARIOS
----------------- */
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/pago", pagoRoutes);
app.use("/api/compra", compraRoutes);



/* -----------------
   RUTA TEST
----------------- */
app.get("/", (req, res) => {
    res.send("🚀 Servidor funcionando");
});


/* -----------------
   SERVIDOR
----------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});
