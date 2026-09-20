const User = require("../models/user.js");
module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body.user;
    const newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "Logged In Successfully!");
      res.redirect("/listing");
    });
    console.log(registeredUser);
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};
module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to LUXESTAY");
  let redirecturl = res.locals.redirectUrl || "listing";
  res.redirect(redirecturl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Account logged out!");
    res.redirect("/listing");
  });
};
