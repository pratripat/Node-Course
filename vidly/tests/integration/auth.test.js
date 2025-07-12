const request = require('supertest');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');

describe('auth middleware', () => {
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

    let token;

    beforeEach(() => {
        token = new User().generateAuthToken();
    })
    
    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if invalid token is provided', async () => {
        token = 'a';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 201 if no token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(201);
    });
});