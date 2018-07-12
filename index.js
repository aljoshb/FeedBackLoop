const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send({
        bye: 'buddy'
    });
});

/* Set PORT for development vs production environment */
const PORT = process.env.PORT || 5000; /* Heroku sets the PORT as an env variable*/
app.listen(PORT);