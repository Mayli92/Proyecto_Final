/* -----------------
   IMPORTACIONES
----------------- */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

/* -----------------
   APP EXPRESS
----------------- */
const app = express();

/* -----------------
   MIDDLEWARES
----------------- */
app.use(cors());
app.use(express.json());

/* -----------------
   CONEXIÓN MONGODB
----------------- */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB conectado"))
    .catch(err => console.log("❌ Error MongoDB:", err));

/* -----------------
   RUTAS
----------------- */
const userRoutes = require("./routes/userRoutes");
const pagoRoutes = require("./routes/pagoRoutes");

app.use("/api/users", userRoutes);
app.use("/api", pagoRoutes);

/* -----------------
   RUTA TEST
----------------- */
app.get("/", (req, res) => {
    res.send("Servidor funcionando 🚀");
});

/* -----------------
   SERVIDOR
----------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});
