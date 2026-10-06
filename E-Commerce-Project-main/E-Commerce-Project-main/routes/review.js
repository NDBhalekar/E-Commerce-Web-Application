const express = require("express");
const router = express.Router({ mergeParams: true }); //To pass ID from app.js to this file, there are other options like this, refer doc
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {
    validateReview,
    isLoggedIn,
    isReviewAuthor,
} = require("../middlewares.js");
const reviewController = require("../controllers/reviews.js");

//Create review -> /listing/:id/reviews ---- /listing/<%= listing._id %>/reviews
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview),
);

//review delete -> /listing/:id/reviews/:reviewId
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview),
);

module.exports = router;
