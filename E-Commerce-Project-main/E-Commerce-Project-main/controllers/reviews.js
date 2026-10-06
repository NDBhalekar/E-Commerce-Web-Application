const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listing_review = await Listing.findById(id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing_review.reviews.push(newReview);

    await newReview.save();
    await listing_review.save();

    res.redirect(`/listing/${id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //reviews is array inside Listing
    await Review.findByIdAndDelete(reviewId);
    console.log(`Review (${reviewId}) Deleted`);

    res.redirect(`/listing/${id}`);
};
