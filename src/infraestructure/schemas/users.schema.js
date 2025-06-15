import mongoose from 'mongoose';
import { Roles } from '../../domain/users/roles.js';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: [Roles.ADMIN, Roles.USER], default: Roles.USER, required: true },
  token: { type: String },
  expiresIn: { type: Date },
});

export default mongoose.model('User', userSchema);
