const express = require('express');
const logger = require('./middleware/logger');

const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.port || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));