import mongoose from 'mongoose';
import { Roles } from './roles.js';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: [Roles.ADMIN, Roles.USER], default: Roles.USER, required: true },
});

export default mongoose.model('User', userSchema);
