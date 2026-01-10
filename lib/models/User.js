import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  avatar_url: {
    type: String,
    default: null
  },
  role: {
    type: String,
    default: 'customer'
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema);