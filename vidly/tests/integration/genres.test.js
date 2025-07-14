const request = require('supertest');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const { update } = require('lodash');
let server;

describe('/api/genres', () => {
    beforeEach(() => { 
        server = require('../../index'); 
    });
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
            // Insert genres into the database
            await Genre.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);
    
            // Make the GET request
            const res = await request(server).get('/api/genres');
    
            // Assertions
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

        const exec = () => {
            return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

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

            expect(genre).not.toBeNull();
        });     

        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });        
    });

    describe('PUT /:id', () => {
        let id;
        let name;
        let token;
        let genre;

        // happy case
        const exec =  () => {
            return request(server)
                .put(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(async () => {
            genre = new Genre({ name: 'genre' });
            await genre.save();

            token = new User().generateAuthToken();
            id = genre._id.toHexString();
            name = 'new genre';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it.each([
            '1234',
            new Array(52).join('a')
        ])('should return 400 if genre is less than 5 or more than 50 characters', async (input) => {
            name = input;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if genre with the given id was not found', async () => {
            id = new mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should update the genre if input is valid', async () => {
            await exec();

            const updatedGenre = await Genre.findById(genre._id);

            expect(updatedGenre.name).toBe(name);
        });

        it('should return the updated genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });
    });

    describe('DELETE /:id', () => {
        let id;
        let token;

        const exec =  () => {
            return request(server)
                .delete(`/api/genres/${id}`)
                .set('x-auth-token', token);
        };

        beforeEach(async () => {
            token = new User({ isAdmin: true }).generateAuthToken();
            
            const genre = new Genre({ name: 'genre' });
            await genre.save();

            id = genre._id.toHexString();
        });

        it('should delete the genre from the db', async () => {
            const res = await exec();

            const genre = await Genre.findById(id);

            expect(res.status).toBe(200);
            expect(genre).toBeNull();
        });

        it('should return the deleted genre', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id', id);
        });

        it('should give validation error if invalid token provided', async () => {
            token = '123';

            const res = await exec();

            expect(res.status).toBe(400)
        });
        
        it('should give authorisation error if user is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should give admin error if the user is not an admin', async () => {
            token = new User().generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should give error if we give a valid id but no corresponding genre exists', async () => {
            id = new mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should give 404 error if id is not valid', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(400);
        })
    })
});