const express = require('express');
require('./services/passport'); // passport.js does not actually export anything, we just want it to be here when the server starts up so that it will run

/* Create an instance of the express */
const app = express();

require('./routes/authRoutes')(app); // Instead of doing: const authRoutes = require('./routes/authRoutes'); then authRoutes(app)

/* Set PORT for production vs development environment */
const PORT = process.env.PORT || 5000; // Heroku sets the PORT as an env variable
app.listen(PORT);