import mongoose from 'mongoose';

const pizzaToppingSchema = new mongoose.Schema({
  pizza_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza',
    required: true
  },
  topping_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topping',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.PizzaTopping || mongoose.model('PizzaTopping', pizzaToppingSchema);