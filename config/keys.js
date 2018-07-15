if (process.env.NODE_ENC === 'production') { // Heroku sets this automatically
    /* We are in production, so return the prod set of keys */
    module.exports = require('./prod');
}
else {
    /* We are in development, so return the dev set of keys */
    module.exports = require('./dev');
}