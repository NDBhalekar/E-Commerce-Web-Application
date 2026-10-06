const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    phone_no: {
        type: Number,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    }
});

userSchema.plugin(passportLocalMongoose); //passport local mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value

module.exports = mongoose.model("User", userSchema);
