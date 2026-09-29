const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),

    description: Joi.string().required(),

    price: Joi.number().required().min(0),

    image: Joi.object({
      url: Joi.string().allow(""),
      filename: Joi.string().allow("")
    }).optional(),

    location: Joi.object({
      houseNumber: Joi.string().required(),
      street: Joi.string().required(),
      locality: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      pincode: Joi.number().required()
    }).required(),

    category: Joi.string().valid(
      "Trending",
      "Rooms",
      "Iconic cities",
      "Mountains",
      "Castles",
      "Amazing pools",
      "Camping",
      "Farms",
      "Arctic"
    ).required()

  }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .required()
            .min(1)
            .max(5),

        comment: Joi.string()
            .required()
    }).required()
});


module.exports = {
    listingSchema,
    reviewSchema
};