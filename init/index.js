const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");
const initData = require("./data");


main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({
    ...obj,owner:"6a89f3ba2e61309d5b2a81d6"
    
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized with synthetic reviews");
};

initDB();