const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys')

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