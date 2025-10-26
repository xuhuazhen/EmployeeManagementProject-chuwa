import mongoose from 'mongoose';

const { DATABASE, DATABASE_PASSWORD } = process.env;
const DB_URL = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);

mongoose.set('strictQuery', false);

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(DB_URL);
        console.log('DB connection connect successful!');
        return mongoose.connection;
    } catch (error) {
        console.error('DB connection error:', error);
        process.exit(1); //exit program if error
    }
}

export default connectDB;