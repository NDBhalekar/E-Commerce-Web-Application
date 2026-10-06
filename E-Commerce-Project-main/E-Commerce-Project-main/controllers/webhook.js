const stripe = require("../config/stripe");
const Cart = require("../models/cart");
const Order = require("../models/order");
const Listing = require("../models/listing");

module.exports.webhookHandler = async (req, res) => {
    console.log("Webhook hit");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        console.error("Webhook error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("Event:", event.type);

    //HANDLE SUCCESSFUL PAYMENT
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        console.log("Payment success");

        try {
            const userId = session.metadata?.userId;
            const paymentIntentId = session.payment_intent;
            const checkoutType = session.metadata?.checkoutType;

            console.log("Metadata:", session.metadata);

            // if metadata missing → stop
            if (!userId) {
                console.log("❌ No userId in metadata");
                return res.json({ received: true });
            }

            // duplicate orders
            const existingOrder = await Order.findOne({
                paymentId: paymentIntentId,
            });

            if (existingOrder) {
                console.log("Order already exists");
                return res.json({ received: true });
            }

            if (checkoutType === "buy_now") {
                const listingId = session.metadata?.listingId;
                const quantity = parseInt(session.metadata?.quantity, 10) || 1;
                const price = parseInt(session.metadata?.price, 10) || 0;
                const title = session.metadata?.title || "Product";

                const order = new Order({
                    user: userId,
                    items: [
                        {
                            product: listingId,
                            title,
                            quantity,
                            price,
                        },
                    ],
                    totalAmount: price * quantity,
                    paymentId: paymentIntentId,
                    status: "paid",
                });

                await order.save();
                await Listing.findByIdAndUpdate(listingId, {
                    $inc: { stock: -quantity },
                });

                console.log("Buy now order created:", order._id);
                return res.json({ received: true });
            }

            //cart
            const cart = await Cart.findOne({ user: userId }).populate(
                "items.product",
            );

            if (!cart || cart.items.length === 0) {
                console.log("Cart not found or empty");
                return res.json({ received: true });
            }

            // order items
            const orderItems = cart.items.map((item) => ({
                product: item.product._id,
                title: item.product.title,
                quantity: item.quantity,
                price: item.product.price,
            }));

            const totalAmount = cart.items.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0,
            );

            // create order
            const order = new Order({
                user: userId,
                items: orderItems,
                totalAmount,
                paymentId: paymentIntentId,
                status: "paid",
            });

            await order.save();

            console.log("Order created:", order._id);

            await Promise.all(
                cart.items.map((item) =>
                    Listing.findByIdAndUpdate(item.product._id, {
                        $inc: { stock: -item.quantity },
                    }),
                ),
            );

            // clear
            cart.items = [];
            await cart.save();

            console.log("Cart cleared");
        } catch (err) {
            console.error("Error processing order:", err);
            return res.status(500).send("Server error");
        }
    }

    res.json({ received: true });
};
