const passport = require('passport'); // The original passport module in node_modules

module.exports = (app) => { // Export the routes so they can be used in index.js to add these methods to the app object

    /* Make a user google login request to Google */
    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email'] // The info of the user we want to get from Google
        })
    );

    /* A user's google login request response will get sent back to this route from Google */
    app.get('/auth/google/callback', passport.authenticate('google'));
}