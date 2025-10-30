const mongoose = require("mongoose")
    // imports mongoose library

const memberSchema = new mongoose.Schema({
    name: String,
    currentlyEnrolled: Boolean,
})
    // defines the schema for the member model

const Member = mongoose.model("Member", memberSchema)
    // creates the member model

module.exports = Member
    // exports the member model to grant access to the rest of the app

