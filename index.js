const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys')

/* Create an instance of the express */
const app = express();

/* Set up the Google OAuth process */
passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback' // The callback route to send the google oauth response to
    },
    (accessToken, refreshToken, profile, done) => {
        console.log('accessToken', accessToken);
        console.log('refresh Token', refreshToken);
        console.log('profile', profile);
    }
));

/* Make a user google login request to Google */
app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'] // The info of the user we want to get from Google
    })
);

/* A user's google login request response will get sent back to this route from Google */
app.get('/auth/google/callback', passport.authenticate('google'));

/* Set PORT for production vs development environment */
const PORT = process.env.PORT || 5000; // Heroku sets the PORT as an env variable
app.listen(PORT);