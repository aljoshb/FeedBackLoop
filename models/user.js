const mongoose = require('mongoose');
const { Schema } = mongoose; // instead of: const Schema = mongoose.Schema;
                             // while mongoDB is schemaless, mongoose requires a schema to know what property each record will have

/* Create a user Schema: describes what a user will look like */
const userSchema = new Schema({
    googleId: String,
    credits: { type: Number, default: 0 }
});

/* Create an actual model class and tell mongoose that the user collection needs to be created */
mongoose.model('users', userSchema);