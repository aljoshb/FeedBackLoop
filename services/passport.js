const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys')

const User = mongoose.model('users');

/* Set the serializeUser property of passport. This will create the user's cookie/token */
passport.serializeUser((user, done) => {
    done(null, user.id); // user.id is the id assigned to this record using mongo, i.e. -id.$old in the mongo record
});

/* Set the deserializeUser property of passport. This will take a user's cookie/token and get the user */
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        });
});

/* Set up the Google OAuth process */
passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback', // The callback route to send the google oauth response to
        proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
        
        User.findOne({ googleId: profile.id }).then( (existingUser) => {
            if (existingUser) {
                /* We already have a record with the give profile ID */

                /* Call the done() callback to tell passport that we have finished authentication */
                done(null, existingUser);
            }
            else {
                /* We don't have user record with this ID, make a new record */
                new User({ googleId: profile.id })
                    .save()
                    .then( (user) => done(null, user)); // We can't just call done() since query to the databse is asynchronous, so we need to first save, then call done
            }
        });
    }
));