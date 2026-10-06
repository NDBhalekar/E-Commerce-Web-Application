const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require("../controllers/user.js");

//REGISTER
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.registerUser);

//LOGIN - https://www.npmjs.com/package/passport (login options)
router
    .route("/login")
    .get(userController.loginForm)
    .post(
        saveRedirectUrl, //post login
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.loginUser,
    );

router.post("/login/demo", userController.loginDemoUser);

//Logout
router.get("/logout", userController.logoutUser);

//req.logout() has parameter which acts as callback

module.exports = router;
