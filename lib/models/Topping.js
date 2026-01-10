import mongoose from 'mongoose';

const toppingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  is_veg: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Topping || mongoose.model('Topping', toppingSchema);