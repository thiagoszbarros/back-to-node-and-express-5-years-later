import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(process.env.MONGO_URI);

export default mongoose;