import app from '../index.mjs';
import request from 'supertest';


describe('Movie api', () => {
    it('should create a movie', async () => {
        const response = await request(app).post('/movie').send({
            title: "October",
            director: "Shoojit Sircar",
            genre: "Romance/Drama",
            releaseYr: "2018"
        });
  
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('post')
    }, 50000);
})