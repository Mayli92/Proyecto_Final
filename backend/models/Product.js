const ProductSchema = new mongoose.Schema({
    title: String,
    price: Number,
    stock: Number
});

module.exports = mongoose.model("Product", ProductSchema);
app.post("/api/compra", auth, async (req, res) => {
    for (const item of req.body.carrito) {
        const producto = await Product.findById(item.id);

        if (producto.stock < item.cantidad) {
            return res.status(400).json("Stock insuficiente");
        }

        producto.stock -= item.cantidad;
        await producto.save();
    }

    res.json("Compra realizada");
});
