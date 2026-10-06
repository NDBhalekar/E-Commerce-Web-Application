const Listing = require("../models/listing");
const Cart = require("../models/cart");

module.exports.getCart = async (req, res) => {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    let cartItems = cart?.items || [];
    let total = 0;

    cartItems.forEach((item) => {
        total += item.product.price * item.quantity;
    });

    res.renderPage(
        "cart/cart.ejs",
        { cartItems, total },
        {
            title: "Your Cart | Marketplace",
            bodyClass: "cart-page",
            styles: ["/css/pages/cart.css"],
        },
    );
    // res.send(cartItems);
};

module.exports.addToCart = async (req, res) => {
    const { id } = req.params;
    const quantity = Math.max(1, parseInt(req.body.quantity, 10) || 1);
    const userId = req.user._id;

    const product = await Listing.findById(id);
    if (product.stock < quantity) {
        req.flash("error", `Only ${product.stock} quantity in stock!`);
        return res.redirect(`/listing/${id}`);
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
        (item) => item.product.toString() === id,
    );

    if (existingItem) {
        if (product.stock < existingItem.quantity + quantity) {
            req.flash("error", `Only ${product.stock} quantity in stock!`);
            return res.redirect(`/listing/${id}`);
        }

        existingItem.quantity += quantity;
    } else {
        cart.items.push({ product: id, quantity });
    }

    await cart.save();
    req.flash("success", "Item added to cart successfully!");

    res.redirect(`/listing/${id}`);
};

module.exports.removeFromCart = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        req.flash("error", "Cart not found");
        return res.redirect("/cart");
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== id);
    await cart.save();
    req.flash("success", "Item removed from cart successfully!");

    res.redirect(`/cart`);
};
