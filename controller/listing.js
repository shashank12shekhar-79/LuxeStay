const { Query } = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapTokens = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapTokens });

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
  const location = property.location;

        // Create one complete address string
        const address = [
            location.houseNumber,
            location.street,
            location.locality,
            location.city,
            location.state,
            location.pincode,
        ]
            .filter(Boolean)
            .join(", ");
  if (!property) {
    req.flash("error", "Property Doesn't Exist!");
    res.redirect("/");
  } else {
    res.render("show.ejs", { property,address });
  }
};

module.exports.addListing = async (req, res) => {
  let data = req.body;
  const location = data.listing.location;

        // Create one complete address string
        const address = [
            location.houseNumber,
            location.street,
            location.locality,
            location.city,
            location.state,
            location.pincode,
            location.country
        ]
            .filter(Boolean)
            .join(", ");
  let response = await geocodingClient.forwardGeocode({
    query : address,
    limit : 1,
  }).send();
  const newListing = new Listing(data.listing);
  newListing.owner = req.user._id;
  newListing.image.url = req.file.path;
  newListing.image.filename = req.file.filename;
  newListing.geometry = response.body.features[0].geometry;
  console.log(req.file.path)
  await newListing.save();
  
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
  const location = req.body.listing.location;

        // Create one complete address string
        const address = [
            location.houseNumber,
            location.street,
            location.locality,
            location.city,
            location.state,
            location.pincode,
            location.country
        ]
            .filter(Boolean)
            .join(", ");
  let response = await geocodingClient.forwardGeocode({
    query : address,
    limit : 1,
  }).send();
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing},
    { new: true }

  );
  listing.geometry = response.body.features[0].geometry;
  if(typeof req.file !== "undefined")
  {
    listing.image.url = req.file.path;
    listing.image.filename = req.file.filename;
    console.log(listing)
  }
  await listing.save();
  req.flash("success", "Updated Successfully!");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted Successfully!");
  res.redirect("/");
};
module.exports.filterListing = async (req,res)=>{
  if(req.query.location){
    const response = await geocodingClient
    .forwardGeocode({
        query: req.query.location,
        limit: 1
    })
    .send();
    const coordinates =response.body.features[0].center;
    const allListing = await Listing.find({
      geometry: {
          $near: {
              $geometry: {
                  type: "Point",
                  coordinates: coordinates
              },
              $maxDistance: 50000
          }
      }
  });
  res.render("index.ejs",{allListing});
    console.log(req.query)
  }
  else{
    let allListing = await Listing.find(req.query);
    res.render("index.ejs",{allListing});
  }
}
