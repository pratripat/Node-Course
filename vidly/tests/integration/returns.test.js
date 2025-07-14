const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');

describe('/api/returns', () => {
    let server;
    let token;
    let customerId;
    let movieId;
    let rental;
    let movie;

    beforeEach(async () => {
        server = require('../../index');

        token = new User().generateAuthToken();

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: '12345' },
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });

        await rental.save();
    });
    afterEach(async () => {
        await Movie.deleteMany();
        await Rental.deleteMany();
        if (server) {
            await server.close(); 
        }
    });
    afterAll(async() => {
        await mongoose.disconnect();
    });

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    }

    it('should return 401 if client is not logged in', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if the customerId is not provided', async () => {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if the movieId is not provided', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental is found for the corresponding customer or movie', async () => {
        await Rental.deleteOne({});
        
        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental is already processed', async () => {     
        rental.dateReturned = new Date();
        await rental.save();
        
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if we have a valid request', async () => {     
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the returnDate if input is valid', async () => {     
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);

        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set the rentalFee if input is valid', async () => {     
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase the stock of the movie if input is valid', async () => {
        const res = await exec();

        const movieInDb = await Movie.findById(movieId);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if input is valid', async () => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])
        )
    });
})