const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("index.ejs", { allListing });
};

module.exports.renderNewForm = async (req, res) => {
  console.log(req.user);
  res.render("new.ejs");
};

module.exports.showListing = async (req, res) => {
  let data = req.params;
  let property = await Listing.findById(data.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!property) {
    req.flash("error", "Property Doesn't Exist!");
    res.redirect("/");
  } else {
    console.log(property.reviews);
    res.render("show.ejs", { property });
  }
};

module.exports.addListing = async (req, res) => {
  let data = req.body;
  const newListing = new Listing(data.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  console.log(data);
  req.flash("success", "New Listing Added!");
  res.redirect("/listing");
};

module.exports.renderEditForm = async (req, res) => {
  let data = await Listing.findById(req.params.id);
  if (!data) {
    req.flash("error", "Property Doesn't Exist!");
    res.redirect("/");
  } else {
    res.render("edit.ejs", { data });
  }
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Updated Successfully!");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted Successfully!");
  res.redirect("/");
};
