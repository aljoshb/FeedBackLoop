const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
require('./models/user');
require('./models/Survey');
require('./services/passport'); // passport.js does not actually export anything, we just want it to be here when the server starts up so that it will run

/* Connect to the MongoDB database using mongoose */
mongoose.connect(keys.mongoURI);

/* Create an instance of express */
const app = express();

/* Set up the middlewares */
app.use(bodyParser.json()); // Middleware to parse the request and make it accessible as a json object like: req.body.<whatever>
app.use( // Middleware to set the cookie
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds. This is how long the cookie can be used in the browser before it expires
        keys: [keys.cookieKey] // Used to sign/encrypt the cookie, so that someone else does not give us this cookie
    })
);
app.use(passport.initialize()); // Middleware to add the current user to the request object
app.use(passport.session());

/* Handle all the routes */
require('./routes/authRoutes')(app); // Instead of doing: const authRoutes = require('./routes/authRoutes'); then: authRoutes(app)
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

/* To ensure that the express app handles the React app routes correctly in production (the create React app server does not exist in production) */
if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // like our main.js file. or main.css file
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

/* Set PORT for production vs development environment */
const PORT = process.env.PORT || 5000; // Heroku sets the PORT as an env variable. If PORT env doesn't exist, we are in development so use 5000
app.listen(PORT);