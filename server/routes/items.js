import express from 'express';
import { body, validationResult } from 'express-validator';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all approved items with filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      size,
      condition,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query;

    const filter = { status: 'available', isAvailable: true };

    // Apply filters
    if (category && category !== 'all') filter.category = category;
    if (size && size !== 'all') filter.size = size;
    if (condition && condition !== 'all') filter.condition = condition;

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const items = await Item.find(filter)
      .populate('owner', 'name avatar location')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Item.countDocuments(filter);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    // Return empty result instead of error for better UX
    res.json({
      items: [],
      totalPages: 0,
      currentPage: 1,
      total: 0
    });
  }
});

// Get item by ID
router.get('/:id', async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name avatar location bio')
      .populate('swapRequests.user', 'name avatar')
      .populate('swapRequests.offeredItem', 'title images');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Increment view count
    item.views += 1;
    await item.save();

    res.json(item);
  } catch (error) {
    next(error);
  }
});

// Create new item
router.post('/', authenticateToken, [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'other']),
  body('type').trim().notEmpty().withMessage('Type is required'),
  body('size').isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size']),
  body('condition').isIn(['new', 'like-new', 'good', 'fair']),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Calculate points based on condition
    const pointValues = {
      'new': 100,
      'like-new': 80,
      'good': 60,
      'fair': 40
    };

    const itemData = {
      ...req.body,
      owner: req.user._id,
      pointsValue: pointValues[req.body.condition] || 50,
      status: 'available' // Skip approval for demo
    };

    const item = new Item(itemData);
    await item.save();

    // Add points to user and add item to user's itemsListed array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { itemsListed: item._id },
      $inc: { points: 10 } // Bonus points for listing
    });

    res.status(201).json({
      message: 'Item created successfully',
      item
    });
  } catch (error) {
    next(error);
  }
});

// Get user's items
router.get('/user/my-items', authenticateToken, async (req, res, next) => {
  try {
    const items = await Item.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.json({ items: [] });
  }
});

// Redeem item with points
router.post('/:id/redeem', authenticateToken, async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot redeem your own item' });
    }

    if (item.status !== 'available') {
      return res.status(400).json({ message: 'Item is not available' });
    }

    if (req.user.points < item.pointsValue) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Deduct points from user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: -item.pointsValue }
    });

    // Add points to item owner
    await User.findByIdAndUpdate(item.owner, {
      $inc: { points: item.pointsValue }
    });

    // Mark item as redeemed
    item.status = 'redeemed';
    item.isAvailable = false;
    await item.save();

    res.json({
      message: 'Item redeemed successfully',
      item
    });
  } catch (error) {
    next(error);
  }
});

export default router;