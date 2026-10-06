const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing, isAdmin } = require("../middlewares.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// INDEX + CREATE
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.postNewListing),
    );

// NEW
router.get("/new", isLoggedIn, isAdmin, listingController.renderNewForm);

//EDIT
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm),
);

// SHOW + UPDATE + DELETE
router
    .route("/:id")
    .get(listingController.showListing)
    .put(
        validateListing,
        isOwner,
        upload.single("listing[image]"),
        wrapAsync(listingController.updateListing),
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
