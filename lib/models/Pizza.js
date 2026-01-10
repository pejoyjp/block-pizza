import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  veg: {
    type: Boolean,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  quantity: {
    type: Number,
    default: 1
  },
  img: {
    type: String,
    default: null
  },
  is_popular: {
    type: Boolean,
    default: false
  },
  sizeandcrust: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.models.Pizza || mongoose.model('Pizza', pizzaSchema);