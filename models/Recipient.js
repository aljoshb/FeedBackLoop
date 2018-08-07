const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
    email: String,
    responded: { type: Boolean, default: false } // Record if this email recipient has responded to the survey or not
});

module.exports = recipientSchema;