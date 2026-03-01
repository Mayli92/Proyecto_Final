const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const productosBeauty = [
    {
        nombre: "Sérum Facial de Rosas",
        description: "Hidratación profunda con extractos de pétalos naturales.",
        precio: 3500,
        stock: 15,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400",
        category: "Cuidado Facial"
    },
    {
        nombre: "Crema Corporal Magnolia",
        description: "Fragancia suave y textura sedosa para todo el día.",
        precio: 2800,
        stock: 20,
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400",
        category: "Cuidado Corporal"
    },
    {
        nombre: "Mascarilla de Arcilla Rosa",
        description: "Desintoxica y suaviza los poros con suavidad.",
        precio: 1900,
        stock: 25,
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400",
        category: "Tratamientos"
    }
];

const seedDB = async () => {
    try {
        // Conexión a la base de datos (usará el nombre en minúsculas de tu .env)
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Conectado a MongoDB para el seeding...");

        // OPCIONAL: Borra los productos actuales para no duplicarlos cada vez que corras el script
        await Product.deleteMany({});
        console.log("Limpiando colección de productos...");

        // Inserción masiva
        await Product.insertMany(productosParaCargar);
        console.log("🚀 ¡Se han cargado 4 productos con éxito!");

        // Cerrar conexión
        mongoose.connection.close();
        console.log("Conexión cerrada.");
        process.exit();
    } catch (error) {
        console.error("❌ Error en el seeding:", error.message);
        process.exit(1);
    }
};

seedDB();