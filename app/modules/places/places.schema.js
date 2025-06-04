import mongoose from 'mongoose';
const { Schema } = mongoose;

const placeSchema = new Schema({
  name: String, 
  address: String,
});

export default mongoose.model('Place', placeSchema);