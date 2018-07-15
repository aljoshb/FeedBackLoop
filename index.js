const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/user');
require('./services/passport'); // passport.js does not actually export anything, we just want it to be here when the server starts up so that it will run

/* Connect to the MongoDB database using mongoose */
mongoose.connect(keys.mongoURI);

/* Create an instance of the express */
const app = express();

/* Enable cookies inside the application, set the Cookie-Session header */
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds. This is how long the cookie can be used in the browser before it expires
        keys: [keys.cookieKey] // Used to sign/encrypt the cookie, so that someone else does not give us this cookie
    })
);

/* Tell passport to use cookies to handle authentication */
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app); // Instead of doing: const authRoutes = require('./routes/authRoutes'); then: authRoutes(app)

/* Set PORT for production vs development environment */
const PORT = process.env.PORT || 5000; // Heroku sets the PORT as an env variable
app.listen(PORT);