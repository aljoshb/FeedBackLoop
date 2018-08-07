const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
    title: String,
    body: String,
    subject: String,
    recipients: [RecipientSchema], // An array of the Recipient
    yes: { type: Number, default:0 }, // Records the number of yes gotten for this survey
    no: { type: Number, default:0 }, // Records the number of no gotten for this survey
    _user: { type: Schema.Types.ObjectId, ref: 'User' }, // Associate this survey to a particular user. This doesn't have to be _user it can be user, the underscore just helps tell someone else that this is a relation
    dateSent: Date, // The date the last response was received
    lastResponded: Date // The most recent date a survey response was received
});

mongoose.model('surveys', surveySchema);