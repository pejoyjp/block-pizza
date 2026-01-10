import mongoose from 'mongoose';

const userContactSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.UserContact || mongoose.model('UserContact', userContactSchema);