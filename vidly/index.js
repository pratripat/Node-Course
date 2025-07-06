const Joi = require('joi');
const express = require('express');

const genres = require('./routes/genres.js');
const customers = require('./routes/customers.js');
const movies = require('./routes/movies.js');
const rentals = require('./routes/rentals.js');

const app = express();
const mongoose = require('mongoose');

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

app.get('/', (req, res) => {
    res.send('Welcome to vidly...');
})

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));