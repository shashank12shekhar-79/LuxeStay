const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({ 
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    url: String,
    filename: String
  },

  price: Number,

  location: {
    houseNumber: String,
    street: String,
    locality: String,
    city: String,
    state: String,
    country: String,
    pincode: Number
  },

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Iconic cities",
      "Mountains",
      "Castles",
      "Amazing pools",
      "Camping",
      "Farms",
      "Arctic",
    ],
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

// 2dsphere index for geospatial search
listingSchema.index({ geometry: "2dsphere" });

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;