const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.renderPage(
        "user/signup.ejs",
        {},
        {
            title: "Sign Up | Marketplace",
            bodyClass: "auth-page",
            containerClass: "",
            mainClass: "auth-page-main",
            styles: ["/css/pages/auth.css"],
            scripts: ["/js/pages/auth.js"],
        },
    );
};

module.exports.registerUser = async (req, res, next) => {
    try {
        let { username, email, phone_no, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            req.flash("error", "Passwords do not match");
            return res.redirect("/signup");
        }

        const newUser = new User({ email, phone_no, username });

        const registeredUser = await User.register(newUser, password);
        //login after signup
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "New User Registered Successfully");
            res.redirect("/listing");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req, res) => {
    res.renderPage(
        "user/login.ejs",
        {},
        {
            title: "Login | Marketplace",
            bodyClass: "auth-page",
            containerClass: "",
            mainClass: "auth-page-main",
            styles: ["/css/pages/auth.css"],
            scripts: ["/js/pages/auth.js"],
        },
    );
};

module.exports.loginUser = async (req, res) => {
    req.flash("success", "You are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.loginDemoUser = async (req, res, next) => {
    try {
        const demoCredentials = {
            username: "demo",
            password: "demo123456",
            email: "demo@example.com",
            phone_no: "9999999999",
        };

        let demoUser = await User.findOne({
            username: demoCredentials.username,
        });

        if (!demoUser) {
            demoUser = await User.register(
                new User({
                    username: demoCredentials.username,
                    email: demoCredentials.email,
                    phone_no: demoCredentials.phone_no,
                }),
                demoCredentials.password,
            );
        }

        req.login(demoUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Logged in with demo account");
            const redirectUrl = req.session.redirectUrl || "/listing";
            delete req.session.redirectUrl;
            return res.redirect(redirectUrl);
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/login");
    }
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listing");
    });
};
