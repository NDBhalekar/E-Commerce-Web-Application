const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Listing",
                },
                title: String,
                quantity: Number,
                price: Number,
            },
        ],
        totalAmount: Number,
        paymentId: String,
        status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
