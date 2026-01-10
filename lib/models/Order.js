import mongoose from 'mongoose';

const orderPizzaSchema = new mongoose.Schema({
  pizza_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  toppings: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  customizations: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
});

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  total_price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  delivery_address: {
    type: String,
    default: null
  },
  contact_phone: {
    type: String,
    default: null
  },
  payment_method: {
    type: String,
    default: null
  },
  payment_status: {
    type: String,
    default: 'pending'
  },
  special_instructions: {
    type: String,
    default: null
  },
  delivery_method: {
    type: String,
    default: null
  },
  pizzas: [orderPizzaSchema]
}, {
  timestamps: true
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);