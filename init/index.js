require("dotenv").config();

const mongoose = require("mongoose");

const Listing = require("../models/listing");
const User = require("../models/user");
const Review = require("../models/review");

const initData = require("./data");


const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

// =========================
// MONGODB CONNECTION
// =========================

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

// =========================
// INITIALIZE DATABASE
// =========================

async function initDB() {
    try {
        // Connect to MongoDB
        await connectDB();

        // =========================
        // CLEAR EXISTING DATA
        // =========================

        await Review.deleteMany({});
        await Listing.deleteMany({});
        await User.deleteMany({});

        console.log("🗑️ Existing data cleared");

        // =========================
        // CREATE USERS
        // =========================

        const userData = [
            {
                username: "rahul123",
                email: "rahul@example.com"
            },
            {
                username: "ananya456",
                email: "ananya@example.com"
            },
            {
                username: "arjun789",
                email: "arjun@example.com"
            }
        ];

        const users = [];

        for (const data of userData) {
            const user = new User(data);

            // Password will be hashed by Passport-Local-Mongoose
            await User.register(user, "1234");

            users.push(user);
        }

        console.log(`✅ ${users.length} users created`);

        // =========================
        // PREPARE LISTING DATA
        // =========================

        const listings = initData.data;

        // Assign owners
        listings[0].owner = users[0]._id;
        listings[1].owner = users[1]._id;
        listings[2].owner = users[2]._id;
        listings[3].owner = users[0]._id;
        listings[4].owner = users[1]._id;
        listings[5].owner = users[2]._id;

        // =========================
        // CREATE LISTINGS
        // =========================

        const createdListings = await Listing.insertMany(listings);

        console.log(
            `✅ ${createdListings.length} listings inserted successfully`
        );

        // =========================
        // CREATE REVIEWS
        // =========================

        const reviewData = [
            {
                comment:
                    "Amazing place and very clean. Would definitely stay here again.",
                rating: 5,
                author: users[1]._id,
                listing: createdListings[0]._id
            },

            {
                comment:
                    "Great location and comfortable rooms.",
                rating: 4,
                author: users[2]._id,
                listing: createdListings[0]._id
            },

            {
                comment:
                    "Beautiful property with excellent views.",
                rating: 5,
                author: users[0]._id,
                listing: createdListings[1]._id
            },

            {
                comment:
                    "The property was good but could improve the service.",
                rating: 3,
                author: users[2]._id,
                listing: createdListings[1]._id
            },

            {
                comment:
                    "Really peaceful and perfect for a weekend trip.",
                rating: 5,
                author: users[0]._id,
                listing: createdListings[2]._id
            },

            {
                comment:
                    "Very nice experience. The host was helpful.",
                rating: 4,
                author: users[1]._id,
                listing: createdListings[3]._id
            }
        ];

        // =========================
        // INSERT REVIEWS
        // =========================

        const createdReviews = await Review.insertMany(reviewData);

        console.log(
            `✅ ${createdReviews.length} reviews inserted successfully`
        );

        // =========================
        // LINK REVIEWS TO LISTINGS
        // =========================

        for (const review of createdReviews) {
            await Listing.findByIdAndUpdate(
                review.listing,
                {
                    $push: {
                        reviews: review._id
                    }
                }
            );
        }

        console.log("✅ Reviews linked to listings");

        // =========================
        // COMPLETE
        // =========================

        console.log("🎉 Database initialization completed!");

    } catch (error) {
        console.error("❌ Database initialization failed:");
        console.error(error);

    } finally {
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed");
    }
}

// =========================
// RUN INITIALIZATION
// =========================

initDB();