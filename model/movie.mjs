import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title : {
        type: String , required: true, unique: true,
    },
    director: {
        type: String , required: true,
    },
    genre: {
        type: String , required: true,
    },
    releaseYr: {
        type: Number , required: true,
    }
});

const movie = mongoose.model('movie', movieSchema);
export default movie;