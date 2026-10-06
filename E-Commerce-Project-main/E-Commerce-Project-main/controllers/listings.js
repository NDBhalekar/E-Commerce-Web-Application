const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const categories = [
        "All",
        "Home Office",
        "Furniture",
        "Electronics",
        "Kitchen",
        "Stationery",
    ];
    const requestedCategory = req.query.category?.trim();
    const searchQuery = req.query.q?.trim() || "";
    const matchedCategory = categories.find(
        (category) =>
            category.toLowerCase() === requestedCategory?.toLowerCase(),
    );
    const selectedCategory = matchedCategory || "All";
    const filter = {};

    if (selectedCategory !== "All") {
        filter.category = selectedCategory;
    }

    if (searchQuery) {
        const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            { title: { $regex: escapedSearchQuery, $options: "i" } },
            { description: { $regex: escapedSearchQuery, $options: "i" } },
            { category: { $regex: escapedSearchQuery, $options: "i" } },
        ];
    }

    const allListings = await Listing.find(filter);

    res.renderPage(
        "listings/index.ejs",
        { allListings, categories, selectedCategory, searchQuery },
        {
            title: "Listings | Marketplace",
            bodyClass: "listing-page",
            containerClass: "container px-3 px-sm-2 py-4",
            styles: ["/css/pages/listings/index.css"],
        },
    );
};

module.exports.renderNewForm = (req, res) => {
    res.renderPage(
        "listings/new.ejs",
        {},
        {
            title: "Create Listing | Marketplace",
            bodyClass: "listing-form-page",
            containerClass: "container py-4",
            styles: ["/css/pages/listings/form.css"],
            scripts: ["/js/pages/listings/form.js"],
        },
    );
};

module.exports.postNewListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image.url = url;
    newListing.image.filename = filename;
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listing");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const findListing = await Listing.findById(id);
    if (!findListing) {
        req.flash("error", "Requested resource does not exist!");
        return res.redirect("/listing");
    }
    res.renderPage(
        "listings/edit.ejs",
        { findListing },
        {
            title: "Edit Listing | Marketplace",
            bodyClass: "listing-form-page",
            containerClass: "container py-4",
            styles: ["/css/pages/listings/form.css"],
            scripts: ["/js/pages/listings/form.js"],
        },
    );
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const formData = req.body;

    let listing = await Listing.findByIdAndUpdate(id, { ...formData.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    res.redirect(`/listing/${id}`);
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Requested resource does not exist!");
        return res.redirect("/listing");
    }
    res.renderPage(
        "listings/show.ejs",
        { listing },
        {
            title: `${listing.title} | Marketplace`,
            bodyClass: "listing-details-page",
            containerClass: "container py-3 py-lg-4",
            styles: ["/css/pages/listings/show.css"],
            scripts: ["/js/pages/listings/show.js"],
        },
    );
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Requested listing deleted!");
    res.redirect("/listing");
};
