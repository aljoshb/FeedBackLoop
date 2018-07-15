const passport = require('passport');

module.exports = (app) => {

    /* Make a user google login request to Google */
    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email'] // The info of the user we want to get from Google
        })
    );

    /* A user's google login request response will get sent back to this route from Google */
    app.get('/auth/google/callback', passport.authenticate('google'));

    /* Log the user out */
    app.get('/api/logout', (req, res) => {
        req.logout();
        res.send(req.user);
    });

    /* Just testing the authentication flow works */
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
}