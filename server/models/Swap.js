import mongoose from 'mongoose';

const swapSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  offeredItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  type: {
    type: String,
    enum: ['swap', 'points'],
    required: true
  },
  pointsUsed: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    default: ''
  },
  meetingDetails: {
    location: String,
    date: Date,
    notes: String
  },
  rating: {
    requesterRating: {
      type: Number,
      min: 1,
      max: 5
    },
    ownerRating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  completedAt: Date
}, {
  timestamps: true
});

export default mongoose.model('Swap', swapSchema);