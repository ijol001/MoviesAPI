import app from '../MoviesAPI/index.mjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' })

mongoose.connect(process.env.DB).then(() => console.log("Database connected successfully")).catch((err) => console.log("Database is not connected", err));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});