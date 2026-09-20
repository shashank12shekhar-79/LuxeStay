const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const {
  isLoggedIn,
  isReviewAuthor,
  validateReviews,
} = require("../middleware.js");
const reviewController = require("../controller/review.js");
//Implementing Routes for Reviews
//Add route
router.post(
  "/",
  validateReviews,
  isLoggedIn,
  wrapAsync(reviewController.createReview),
);
//Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview),
);

module.exports = router;
