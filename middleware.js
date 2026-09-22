const wrapAsync = require("./utils/wrapAsync");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {reviewSchema,listingSchema}=require("./schema.js");
const expressError = require("./utils/expressError.js")
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    console.log(error);
    const errMsg = error.details.map((el) => el.message).join(", ");

    return next(new expressError(400, errMsg));
  }

  next();
};
module.exports.validateReviews = (req, res, next) => {
const { error } = reviewSchema.validate(req.body);
if (error) {
    const errMsg = error.details
        .map((el) => `${el.path.join(".")}: ${el.message}`)
        .join(", ");

    console.log("Joi Error:", errMsg);

    return next(new expressError(400, errMsg));
}
next();
};
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Login Your Acccount!");
    return res.redirect("/login");
  }
  next();
};
module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner = wrapAsync(async (req, res, next) => {
  let { id } = req.params;

  let listing_data = await Listing.findById(id);

  if (!listing_data.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have authority to update!");
    return res.redirect(`/listing/${id}`);
  }

  next();
});
module.exports.isReviewAuthor = wrapAsync(async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have authority to update!");
    return res.redirect(`/listing/${id}`);
  }
  next();
});
