const express = require('express');
const router = express.Router();

genres = [
    { id: 1, genre: 'action' },
    { id: 2, genre: 'horror' },
    { id: 3, genre: 'comedy' }
];

router.get('/', (req, res) => {
    res.send(genres);
})

router.get('/:id', (req, res) => {
    genre = getGenre(parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
})

router.post('/', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        genre: req.body.genre
    };

    genres.push(genre);
    res.status(201).send(genre);
})

router.put('/:id', (req, res) => {
    genre = getGenre(parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genre.genre = req.body.genre;
    res.send(genre);
})

router.delete('/:id', (req, res) => {
    genre = getGenre(parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    let index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
})

function getGenre(id) {
    return genres.find(c => c.id == id);
}

function validateGenre(genre) {
    schema = Joi.object({
        genre: Joi.string().required()
    });

    return schema.validate(genre);
}

module.exports = router;