import app from '../MoviesAPI/index.mjs';
import mongoose, { isValidObjectId } from 'mongoose';

mongoose.connect('mongodb+srv://daisysarma20:WZqayT7Twe9hjPDP@cluster0.juzlr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Database connected successfully")).catch((err) => console.log("Database is not connected", err));


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})