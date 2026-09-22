const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { string, number, ref } = require("joi");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model("User", userSchema);