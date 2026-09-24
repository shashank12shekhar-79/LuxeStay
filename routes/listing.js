const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const {storage} = require("../CloudConfig.js")
const multer  = require('multer')
const upload = multer({storage});


router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(validateListing,
    upload.single('listing[image]'), 
    wrapAsync(listingController.addListing));
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);
module.exports = router;
