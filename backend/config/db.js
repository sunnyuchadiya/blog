import mongoose from 'mongoose';

const DEFAULT_MONGO_URI = 'mongodb+srv://suchadiya8_db_user:I50ezB0CO5WHHB6n@cluster0.r9poy45.mongodb.net/blog_db?retryWrites=true&w=majority';

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }
    const uri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB Atlas Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
  }
};
