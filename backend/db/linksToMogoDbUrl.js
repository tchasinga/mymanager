import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env file
dotenv.config();

const linksToMogoDbUrl = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("🎉 Successfully connected to MongoDB database!");
    } catch (error) {
        console.log("🚨 Alert: MongoDB connection attempt failed.");
    }
};

export default linksToMogoDbUrl