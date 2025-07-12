import express from 'express';
import { body, validationResult } from 'express-validator';
import Swap from '../models/Swap.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create swap request
router.post('/', authenticateToken, [
  body('requestedItemId').notEmpty().withMessage('Requested item ID is required'),
  body('offeredItemId').optional(),
  body('message').optional().trim()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { requestedItemId, offeredItemId, message } = req.body;

    // Get requested item
    const requestedItem = await Item.findById(requestedItemId).populate('owner');
    if (!requestedItem) {
      return res.status(404).json({ message: 'Requested item not found' });
    }

    // Check if item is available
    if (!requestedItem.isAvailable || requestedItem.status !== 'available') {
      return res.status(400).json({ message: 'Item is not available for swap' });
    }

    // Check if user is trying to swap their own item
    if (requestedItem.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot swap your own item' });
    }

    const swapData = {
      requester: req.user._id,
      owner: requestedItem.owner._id,
      requestedItem: requestedItemId,
      type: offeredItemId ? 'swap' : 'points',
      message: message || ''
    };

    if (offeredItemId) {
      const offeredItem = await Item.findById(offeredItemId);
      if (!offeredItem) {
        return res.status(404).json({ message: 'Offered item not found' });
      }

      // Check if user owns the offered item
      if (offeredItem.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only offer items you own' });
      }

      swapData.offeredItem = offeredItemId;
    } else {
      // Points-based swap
      swapData.pointsUsed = requestedItem.pointsValue;
    }

    const swap = new Swap(swapData);
    await swap.save();

    await swap.populate([
      { path: 'requester', select: 'name avatar' },
      { path: 'owner', select: 'name avatar' },
      { path: 'requestedItem', select: 'title images' },
      { path: 'offeredItem', select: 'title images' }
    ]);

    res.status(201).json({
      message: 'Swap request created successfully',
      swap
    });
  } catch (error) {
    next(error);
  }
});

// Get user's swaps
router.get('/user', authenticateToken, async (req, res, next) => {
  try {
    const { status, type } = req.query;

    const filter = {
      $or: [
        { requester: req.user._id },
        { owner: req.user._id }
      ]
    };

    if (status) filter.status = status;
    if (type) filter.type = type;

    const swaps = await Swap.find(filter)
      .populate('requester', 'name avatar')
      .populate('owner', 'name avatar')
      .populate('requestedItem', 'title images pointsValue')
      .populate('offeredItem', 'title images')
      .sort({ createdAt: -1 });

    res.json({ swaps });
  } catch (error) {
    console.error('Error fetching user swaps:', error);
    res.json({ swaps: [] });
  }
});

export default router;