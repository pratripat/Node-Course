const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const logger = require('./middleware/logger');
const express = require('express');
const debug = require('debug')('app:db');
const home = require('./routes/home');
const courses = require('./routes/courses');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json()); // middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(logger);
app.use('/', home);
app.use('api/courses/', courses);

// configuration
console.log('Application name: ' + config.get('name'));
console.log('Mail server: ' + config.get('mail.host'));
console.log('Mail password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny')); // logs all sorts of requests
    debug('Morgan enabled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening to port 3000...'));