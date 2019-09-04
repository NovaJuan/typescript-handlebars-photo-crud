import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(<string>process.env.MONGODB_URI,{useNewUrlParser:true})
    console.log('DB connected');
  } catch (err) {
    console.error(err);
  }
}

export default connectDB;