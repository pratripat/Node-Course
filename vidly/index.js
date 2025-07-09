const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const config = require('config');
const error = require('./middleware/error');

const genres = require('./routes/genres.js');
const customers = require('./routes/customers.js');
const movies = require('./routes/movies.js');
const rentals = require('./routes/rentals.js');
const users = require('./routes/users.js');
const auth = require('./routes/auth.js');

const app = express();
const mongoose = require('mongoose');

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly')
    .then(() => {
        console.log('Connected to MongoDB...')
    })
    .catch(err => console.log(err.message));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

app.get('/', (req, res) => {
    res.send('Welcome to vidly...\n');
})

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));