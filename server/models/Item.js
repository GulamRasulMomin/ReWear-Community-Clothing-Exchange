import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'other']
  },
  type: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size']
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'like-new', 'good', 'fair']
  },
  images: [{
    type: String,
    required: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  pointsValue: {
    type: Number,
    required: true,
    min: 1,
    default: 50
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'available', 'swapped', 'redeemed', 'rejected'],
    default: 'available'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for search functionality
itemSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Item', itemSchema);