import express from 'express';
import bodyParser from 'body-parser';
import movie from './model/movie.mjs';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));




//Create a new movie
app.post('/movie', async (req, res) => {
    try {
        const existingMovie = await movie.findOne({ title: req.body.title })
        if (existingMovie) {
            return res.status(409).json("Movie with this name already exist !");
        }

        const newMovie = new movie(req.body);
        const saveMovie = await newMovie.save();
        res.status(201).json(saveMovie);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Read operation to fetch all movie
app.get('/movie', async (req, res) => {
    try {
        const findMovies = await movie.find();
        res.json(findMovies);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);

    }
});

//Read operation to fetch only one movie
app.get('/movie/:id', async (req, res) => {
    const ID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(ID)) {
        return res.status(400).json({ error: "Invalid movie ID" })
    }
    try {
        const Movie = await movie.findById(ID);
        res.json(Movie);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);

    }
});

//update operation using movie id
app.put('/movie/:id', async (req, res) => {
    const ID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(ID)) {
        return res.status(400).json({ error: "Invalid movie ID" })
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "At least one field is required to update." });
    }
    try {
        const updateMovie = await movie.findByIdAndUpdate(ID, req.body, ({ new: true }));
        res.json(updateMovie);

        if (!updateMovie) {
            return res.status(400).json({ error: "movie not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})



//delete operation using movie id
app.delete('/movie/:id', async (req, res) => {
    try {
        const deleteMovie = await movie.findByIdAndDelete(req.params.id);
        res.status(200).json(deleteMovie);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
})


export default app;







