const express = require('express');
const router = express.Router();
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const mongoose = require('mongoose');

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

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const customer = await Customer.findById(req.body.customerID).session(session);
        if (!customer) {
            await session.abortTransaction();
            return res.status(400).send('The customer with the given customerID does not exist...');
        }

        const movie = await Movie.findById(req.body.movieID).session(session);
        if (!movie) {
            await session.abortTransaction();
            return res.status(400).send('The movie with the given movieID does not exist...');
        }

        if (movie.numberInStock === 0) {
            await session.abortTransaction();
            return res.status(400).send('Movie not in stock...');
        }

        let rental = new Rental({
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