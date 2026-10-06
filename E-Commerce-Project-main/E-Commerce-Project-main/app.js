if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const flash = require("connect-flash");

const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const cartRouter = require("./routes/cart.js");
const orderRouter = require("./routes/order.js");
const paymentRouter = require("./routes/payment.js");
const webhookRouter = require("./routes/webhook");

const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const Cart = require("./models/cart.js");

const passport = require("passport");
const localStrategy = require("passport-local");

const MONGO_URL = process.env.MONGODB_URL;
const port = process.env.PORT || 3000;

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/payment/webhook", webhookRouter);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

//session middlewares
const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3, //if we dont set expiry for cookie, web browser generally delete em after closing
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true, //for cross-Scripting attack
    },
};

app.use(session(sessionOptions));
app.use(flash()); //should be before routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware for flash and cart
app.use(async (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.searchQuery = req.query.q?.trim() || "";

    if (!req.user) {
        res.locals.cartCount = 0;
        return next();
    }

    const cart = await Cart.findOne({ user: req.user._id }).select(
        "items.quantity",
    );
    res.locals.cartCount =
        cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

    next();
});

app.use((req, res, next) => {
    const defaultPage = {
        title: "Marketplace",
        bodyClass: "",
        mainClass: "",
        containerClass: "container",
        styles: [],
        scripts: [],
        showNavbar: true,
        showFooter: true,
    };

    res.locals.page = defaultPage;
    res.renderPage = (view, locals = {}, page = {}) => {
        const styles = page.styles || [];
        const scripts = page.scripts || [];

        return res.render(view, {
            ...locals,
            page: {
                ...defaultPage,
                ...page,
                styles,
                scripts,
            },
        });
    };

    next();
});

//middleware logger
app.use((req, res, next) => {
    req.responseTime = new Date(Date.now()).toString();
    console.log(req.method, req.path, req.responseTime, req.hostname);
    // console.log(req);
    next();
});

//Routes
app.get("/", async (req, res) => {
    const allListings = await Listing.find();
    res.renderPage(
        "landing.ejs",
        { allListings },
        {
            title: "Store | Home",
            bodyClass: "landing-page",
            containerClass: "container py-3 py-lg-4",
            styles: ["/css/pages/landing.css"],
        },
    );
});

app.get("/about", (req, res) => {
    res.renderPage(
        "about.ejs",
        {},
        {
            title: "About | Lumina",
            bodyClass: "about-page",
            containerClass: "container",
            styles: ["/css/pages/about.css"],
        },
    );
});

app.get("/listings", (req, res) => {
    const queryString = req.originalUrl.includes("?")
        ? req.originalUrl.slice(req.originalUrl.indexOf("?"))
        : "";
    res.redirect(`/listing${queryString}`);
});

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);
app.use("/payment", paymentRouter);

// To handle non existing page
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not Found"));
});

// error handler middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Unexpected error ocurred" } = err;

    console.log(err);
    res.status(statusCode);
    res.renderPage(
        "error.ejs",
        { err },
        {
            bodyClass: "error-page",
            styles: ["/css/pages/error.css"],
        },
    );
});

app.listen(port, () => {
    console.log(`The server has started on port http://localhost:${port}`);
});
