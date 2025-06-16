import mongoose from '../db/mongodb.service.js';
import { Levels } from '../logs/levels.js';

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  level: { type: String, default: Levels.INFO },
  message: String,
  meta: Object
});

export default mongoose.model('Log', logSchema);