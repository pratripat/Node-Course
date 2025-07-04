const Joi = require('joi');
const express = require('express');
const genres = require('./routes/genres.js');
const customers = require('./routes/customers.js');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log(err.message));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

app.get('/', (req, res) => {
    res.send('hello guys');
})

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));