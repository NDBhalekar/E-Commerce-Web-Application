const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.MONGODB_URL;

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

const initDB = async () => {
    await Listing.deleteMany();
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "69c983a10566fcc288718bc1",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data in DB was initialized");
};

initDB();
