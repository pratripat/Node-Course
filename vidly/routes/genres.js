const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre')

// DATABASE HANDLING FUNCTIONS
async function getGenres() {
    const genres = await Genre.find().sort('name');
    return genres;
}

async function createGenre(body) {
    let genre = Genre({
        name: body.name
    });

    try {
        genre = await genre.save();
        return genre;
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
}

// USER INTERACTION FUNCTIONS
router.get('/', async (req, res) => {
    const genres = await getGenres();
    res.send(genres);
})

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('The genre with the given ID does not exist...');
    res.send(genre);
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await createGenre(req.body);

    res.status(201).send(genre);
})

router.put('/:id', validateObjectId, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    })

    if (!genre) return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
})

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id, {
        new: true
    })

    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    res.send(genre);
})

module.exports = router;