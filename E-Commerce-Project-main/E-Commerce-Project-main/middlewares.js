const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

//Middleware for schema validation
module.exports.validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
};

//Middleware for review validation
module.exports.validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
};
//req.session.redirectUrl = req.originalUrl; --> directly will not work, because passport resets request object once logged in, therefore we use locals to store with the help of middlewares
//req.isAuthenticated -- method provided by passport and info of user gets stored in req.user

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit the listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to delete the review");
        return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (res.locals.currUser.role !== "admin") {
        req.flash("error", "You don't have permission to access the requested admin page");
        return res.redirect("/listing");
    }
    next();
};
