import mongoose from 'mongoose';

const DEFAULT_MONGO_URI = 'mongodb+srv://Vercel-Admin-atlas-cinereous-anchor:7D8efaAhbv4kdv0d@atlas-cinereous-anchor.ugzqnkw.mongodb.net/?retryWrites=true&w=majority';

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_MONGO_URI;
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB Atlas Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
  }
};
