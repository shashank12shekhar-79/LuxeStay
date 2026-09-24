require("dotenv").config();

const mongoose = require("mongoose");

const Listing = require("../models/listing");
const User = require("../models/user");
const initData = require("./data");

// MongoDB connection
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection failed:");
        console.error(error.message);
        process.exit(1);
    }
}

// Initialize database
async function initDB() {
    try {
        // Connect to database
        await connectDB();

        // Owner ID
        const ownerId = "6a89f3ba2e61309d5b2a81d6";

        // Check owner exists
        const owner = await User.findById(ownerId);

        if (!owner) {
            console.error("❌ Owner user not found!");
            console.error(`User ID: ${ownerId}`);
            return;
        }

        console.log(`✅ Owner found: ${owner.username || owner._id}`);

        // Delete existing listings
        await Listing.deleteMany({});
        console.log("🗑️ Existing listings deleted");

        // Prepare listing data
        const listings = initData.data.map((listing) => ({
            ...listing,

            // Convert old image URL format to new schema format
            image:
                typeof listing.image === "string"
                    ? {
                          url: listing.image,
                          filename: "listing-image",
                      }
                    : listing.image,

            // Add owner
            owner: owner._id,

            // Ensure reviews starts as an empty array
            reviews: [],
        }));

        // Insert listings
        await Listing.insertMany(listings);

        console.log(`✅ ${listings.length} listings inserted successfully`);
        console.log("🎉 Database initialization completed!");
    } catch (error) {
        console.error("❌ Database initialization failed:");
        console.error(error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed");
    }
}

// Run initialization
initDB();