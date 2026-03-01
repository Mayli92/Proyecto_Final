const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    precio: {
        type: Number,
        required: true,
        min: 0
    },

    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },

    image: {
        type: String,
        default: ""
    },

    category: {
        type: String,
        default: "General"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Product", ProductSchema);
