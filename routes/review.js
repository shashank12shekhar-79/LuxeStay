const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const {listingSchema}=require("../schema.js");
const {reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js")
const Review=require("../models/review.js");
const {isLoggedIn} = require("../middleware.js");
const validateReviews = (req, res, next) => {
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
//Implementing Routes for Reviews
//Add route
router.post("/",validateReviews,isLoggedIn,wrapAsync(async(req,res)=>{
console.log(req.body)
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
console.log("Review Saved")
req.flash("success","Review Added!");
res.redirect(`/listing/${listing.id}`);
})) 
//Delete Route
router.delete("/:reviewId",isLoggedIn,wrapAsync(async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`);
}))

module.exports=router;