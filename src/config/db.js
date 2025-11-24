import mongoose from "mongoose";
import { config } from './index.js'

export default async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URL)
        console.log('MongoDB connected!');
    } catch (error) {
        console.log('DB connect error: ', error);
    }
} 