const stripe = require("../config/stripe");
const Cart = require("../models/cart");
const Listing = require("../models/listing");

const getBaseUrl = () => process.env.BASE_URL || "http://localhost:3000";

module.exports.checkout = async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        req.flash("error", "Your cart is empty");
        return res.redirect("/cart");
    }

    const lineItems = cart.items.map((item) => ({
        price_data: {
            currency: "inr",
            product_data: { name: item.product.title },
            unit_amount: item.product.price * 100,
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `${getBaseUrl()}/orders`,
        cancel_url: `${getBaseUrl()}/cart`,
        metadata: { userId: userId.toString() },
    });

    res.redirect(session.url);
};

module.exports.buyNow = async (req, res) => {
    const { id } = req.params;
    const quantity = Math.max(1, parseInt(req.body.quantity, 10) || 1);
    const userId = req.user._id;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Requested product does not exist");
        return res.redirect("/listing");
    }

    if (listing.stock < quantity) {
        req.flash("error", `Only ${listing.stock} quantity in stock!`);
        return res.redirect(`/listing/${id}`);
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: { name: listing.title },
                    unit_amount: listing.price * 100,
                },
                quantity,
            },
        ],
        success_url: `${getBaseUrl()}/orders`,
        cancel_url: `${getBaseUrl()}/listing/${listing._id}`,
        metadata: {
            userId: userId.toString(),
            checkoutType: "buy_now",
            listingId: listing._id.toString(),
            title: listing.title,
            price: String(listing.price),
            quantity: String(quantity),
        },
    });

    res.redirect(session.url);
};
