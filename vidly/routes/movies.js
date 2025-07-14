const express = require('express');
const router = express.Router();
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const validate = require('../middleware/validate');

// USER INTERACTION FUNCTIONS
router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
})

router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send('The movie with the given ID does not exist...');
        res.send(movie);
    } catch (ex) {
        res.status(400).send('Invalid ID format');
    }
})

router.post('/', validate(validateMovie), async (req, res) => {
    try {
        const genre = await Genre.findById(req.body.genreID);
        if (!genre) return res.status(404).send('The genre with the given genreID does not exist...');

        let movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        await movie.save();
        console.log(movie);
        res.send(movie);
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
})

router.put('/:id', validate(validateMovie), async (req, res) => {
    try {
        const genre = await Genre.findById(req.body.genreID);
        if (!genre) return res.status(404).send('The genre with the given genreID does not exist...');

        // const movie = await Movie.findById(req.params.id);
        // if (!movie) return res.status(404).send('The movie with the given ID does not exist...');

        // movie.updateOne({
        //     title:  
        // })

        const movie = await Movie.findByIdAndUpdate(
            req.params.id, 
            {
                title: req.body.title,
                genre: {
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            },
            { new: true }
        )

        if (!movie) return res.status(404).send('The movie with the given ID does not exist...');
        res.send(movie);
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
})

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id, {
        new: true
    });

    if (!movie) return res.status(404).send('The movie with the given ID does not exist...');

    res.send(movie);
})

module.exports = router;