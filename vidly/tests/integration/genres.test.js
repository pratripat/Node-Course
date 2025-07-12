const request = require('supertest');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        await Genre.deleteMany({});

        if (server) {
            await server.close(); 
        }
    });
    afterAll(async() => {
        await mongoose.disconnect();
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre with a valid id', async () => {
            const genre = new Genre({ name: 'genre' });
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id.toHexString()}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return a 400 status if the given id has invalid format', async () => {
            const res = await request(server).get(`/api/genres/1234`);
            expect(res.status).toBe(400);
        });

        it('should return a 404 status if the given id is valid, but does not exist', async () => {
            const res = await request(server).get(`/api/genres/${new mongoose.Types.ObjectId()}`);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is invalid (genre.name is less than 5 characters)', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is invalid (genre.name is more than 50 characters)', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();
            
            const genre = Genre.find({ name });

            expect(res.status).toBe(201);
            expect(genre).not.toBeNull();
        });     

        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });        
    });
});