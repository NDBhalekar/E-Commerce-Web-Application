const Order = require("../models/order");

module.exports.index = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({
        createdAt: -1,
    });

    const orderStats = {
        totalOrders: orders.length,
        totalSpent: orders.reduce(
            (sum, order) => sum + (order.totalAmount || 0),
            0,
        ),
        itemsPurchased: orders.reduce(
            (sum, order) =>
                sum +
                order.items.reduce(
                    (itemSum, item) => itemSum + (item.quantity || 0),
                    0,
                ),
            0,
        ),
    };

    res.renderPage(
        "order/index.ejs",
        { orders, orderStats },
        {
            title: "My Orders | Marketplace",
            bodyClass: "orders-page",
            containerClass: "container py-4 py-lg-5",
            styles: ["/css/pages/orders.css"],
        },
    );
};
