const express = require('express');
const router = express.Router();
const { Rental, validateRental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const mongoose = require('mongoose');
const validate = require('../middleware/validate');

//USER INTERACTION FUNCTIONS
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
})

router.get('/:id', async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).send('The rental with the given ID does not exist...'); 
        res.send(rental);
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
})

router.post('/', validate(validateRental), async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const customer = await Customer.findById(req.body.customerId).session(session);
        if (!customer) {
            await session.abortTransaction();
            return res.status(400).send('The customer with the given customerId does not exist...');
        }

        const movie = await Movie.findById(req.body.movieId).session(session);
        if (!movie) {
            await session.abortTransaction();
            return res.status(400).send('The movie with the given movieId does not exist...');
        }

        if (movie.numberInStock === 0) {
            await session.abortTransaction();
            return res.status(400).send('Movie not in stock...');
        }

        const rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });

        await rental.save({ session });

        movie.numberInStock--;
        await movie.save({ session });

        await session.commitTransaction();
        res.send(rental);
    } catch (ex) {
        await session.abortTransaction();
        // Log the error for debugging
        console.error('Transaction error:', ex);
        res.status(500).send('Something failed during the transaction.');
    } finally {
        session.endSession();
    }
});

module.exports = router;