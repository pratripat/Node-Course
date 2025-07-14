const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const validate = require('../middleware/validate');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if (!rental) return res.status(404).send('Rental does not exist for the corresponding customer or movie');

    // rental has already been processed
    if (rental.dateReturned) {
        return res.status(400).send('The following rental has already been processed');
    };

    rental.return();
    await rental.save();

    await Movie.findByIdAndUpdate(req.body.movieId, {
        $inc: { numberInStock: 1 }
    });

    return res.send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });

    return schema.validate(req);
}

module.exports = router;