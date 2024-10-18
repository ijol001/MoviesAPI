import app from '../index.mjs';
import request from 'supertest';
import mongoose from 'mongoose';
import movie from '../model/movie.mjs';
import dotenv from 'dotenv';

dotenv.config({ path: '/.env' });

beforeAll(async () => {
    mongoose.connect(process.env.DB_URL);
});

beforeEach(async () => {
    await movie.deleteMany({});
})

afterAll(async () => {
    await mongoose.connection.close();
})

describe('Movie api', () => {
    it('should create a movie', async () => {
        const response = await request(app).post('/movie').send({
            title: "October",
            director: "Shoojit Sircar",
            genre: "Romance/Drama",
            releaseYr: "2018"
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe("October")
    }, 50000);

    it('should return a error if the movie already exist', async () => {
        await request(app).post('/movie').send({
            title: "Shutter Island",
            director: "Martin Scorsese",
            genre: "Thriller/Mystery ",
            releaseYr: "2010"
        });

        const response = await request(app).post('/movie').send({
            title: "Shutter Island",
            director: "Martin Scorsese",
            genre: "Thriller/Mystery ",
            releaseYr: "2010"
        });
        expect(response.status).toBe(409);
        expect(response.body).toBe("Movie with this name already exist !");
    }, 30000);

    it('should return all the movies', async () => {
        await request(app).post('/movie').send({
            title: "Asian Island",
            director: "Martin Scorsese",
            genre: "Thriller/Mystery ",
            releaseYr: "2010"
        });
        const response = await request(app).get('/movie');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
    });

    test('should return a movie by ID', async () => {
        const createResponse = await request(app).post('/movie').send({
            title: "Aamir",
            director: "Raj Kumar Gupta",
            genre: "Thriller/Action",
            releaseYr: "2008"
        });

        expect(createResponse.status).toBe(201);
        const movieId = createResponse.body._id;

        const response = await request(app).get(`/movie/${movieId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', movieId);
        expect(response.body.title).toBe("Aamir");


    }, 5000);

    it('should return 400 error for invalid movie id', async () => {
        await request(app).post('/movie').send({
            title: "Asian Island",
            director: "Martin Scorsese",
            genre: "Thriller/Mystery ",
            releaseYr: "2010"
        });

        const invalidID = "12bjkhaos1";

        const response = await request(app).get(`/movie/${invalidID}`);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', "Invalid movie ID")
    });

    it('should update a movie by movie id', async () => {
        const createResponse = await request(app).post('/movie').send({
            title: "Love Money",
            director: "Vishal Mahadkar",
            genre: "Action/Thriller",
            releaseYr: "2012"
        });

        expect(createResponse.status).toBe(201);
        const movieId = createResponse.body._id;

        const response = await request(app).put(`/movie/${movieId}`).send({
            title: "Blood Money"
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', movieId);
        expect(response.body.title).toBe("Blood Money");
    });

    it('should return an 400 error while trying to update movie data using invalid movie id', async () => {
        await request(app).post('/movie').send({
            title: "Love Money",
            director: "Vishal Mahadkar",
            genre: "Action/Thriller",
            releaseYr: "2012"
        });

        const invalidId = "13bhou3kh3oiue908efih";
        const response = await request(app).put(`/movie/${invalidId}`).send({
            title: "Blood Money"
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', "Invalid movie ID");

    });

    it('should return an 400 error while trying to update movie data with missing fields', async () => {
        const createResponse = await request(app).post('/movie').send({
            title: "Blood Money",
            director: "Vishal Mahadkar",
            genre: "Action/Thriller",
            releaseYr: "2012"
        });

        expect(createResponse.status).toBe(201);
        const movieId = createResponse.body._id;

        const response = await request(app).put(`/movie/${movieId}`).send();

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', "At least one field is required to update.");

    });

    it('should delete movie using movie id', async () => {
        const createResponse = await request(app).post('/movie').send({
            title: "Blood Money",
            director: "Vishal Mahadkar",
            genre: "Action/Thriller",
            releaseYr: "2012"
        });

        expect(createResponse.status).toBe(201);
        const movieId = createResponse.body._id;

        const response = await request(app).delete(`/movie/${movieId}`).send();

        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe('movie deleted');
    });

    it('should return an 400 error while trying to delete a movie using invalid movie id', async () => {
        await request(app).post('/movie').send({
            title: "Blood Money",
            director: "Vishal Mahadkar",
            genre: "Action/Thriller",
            releaseYr: "2012"
        });

        const invalidId = "13bhou3kh3oiue908efih";
        const response = await request(app).delete(`/movie/${invalidId}`).send();

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', "Invalid movie ID");

    });

    it('should return 404 non- existence routes', async () => {
        const response = await request(app).get('/routes');
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', "Routes not found");
    });


}); 