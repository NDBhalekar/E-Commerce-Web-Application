const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default:
                "https://fastly.picsum.photos/id/237/300/200.jpg?hmac=WSdbBEXvCVSqNN1HnCzm7ohp6DhAJfl9t3TcqBNDn_Q",
            set: (x) =>
                x === ""
                    ? "https://fastly.picsum.photos/id/237/300/200.jpg?hmac=WSdbBEXvCVSqNN1HnCzm7ohp6DhAJfl9t3TcqBNDn_Q"
                    : x,
        },
    },
    price: Number,
    stock: Number,
    category: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

//Middleware to delete reviews associated with listing; mongoose middleware
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

//https://picsum.photos/300/200
const Listing = mongoose.model("Listings", listingSchema);
module.exports = Listing;
