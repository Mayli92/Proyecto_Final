const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    productoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    title: String,
    price: Number,
    cantidad: Number
});

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productos: [ItemSchema],
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ["pendiente", "pagado", "enviado", "cancelado"],
        default: "pendiente"
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", OrderSchema);