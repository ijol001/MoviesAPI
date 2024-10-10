import app from '../index.mjs';
import request from 'supertest';
import mongoose from 'mongoose';
import movie from '../model/movie.mjs';

beforeAll(async ()=>{
    mongoose.connect('mongodb+srv://daisysarma20:WZqayT7Twe9hjPDP@cluster0.juzlr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async()=>{
    await movie.deleteMany({});
})

afterAll(async()=>{
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

    it('should return a error if the movie already exist', async() =>{
        const response = await request(app).post('/movie').send({
            title: "October",
            director: "Shoojit Sircar",
            genre: "Romance/Drama",
            releaseYr: "2018"
        });
       
        expect(response.statusCode).toBe(409);
        expect(response.text).toBe("this movie already exist")
    }, 30000);
});