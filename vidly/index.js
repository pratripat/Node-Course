const express = require('express');
const logger = require('./middleware/logger');

const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.port || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));


module.exports = server;