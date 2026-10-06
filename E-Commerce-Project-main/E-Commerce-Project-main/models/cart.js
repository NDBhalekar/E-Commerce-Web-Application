const mongoose = require("mongoose");
const Listing = require("./listing");
const Schema = mongoose.Schema;

const cartItem = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: Listing,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
});

const cart = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [cartItem],
    },
    { timestamps: true },
);

module.exports = mongoose.model("Cart", cart);
