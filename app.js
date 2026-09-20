const express = require("express");
const app = express();
const path = require("path");
const port = 100;
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js");
const { reviewSchema } = require("./schema.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
const dotenv = require("dotenv").config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}
main()
  .then((res) => {
    console.log("CONNECTED SUCCESFULLY TO DATABASE");
  })
  .catch((err) => {
    console.log(err);
  });

const sessionOptions = {
  secret: "1695",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
//ROOT ROUTE
app.get("/", (req, res) => {
  res.redirect("/signup");
});

app.use("/listing", listingsRouter);
app.use("/listing/:id/review", reviewsRouter);
app.use("/", userRouter);
//error handling Middlewares
app.all("/*qq", (req, res, next) => {
  next(new expressError(404, "page not found!"));
});
//error handling Middlewares
app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong" } = err;
  res.render("error.ejs", { message });
});
app.listen(port, (req, res) => {
  console.log(`Server Working On ${port}`);
});
