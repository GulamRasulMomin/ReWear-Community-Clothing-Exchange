import express from 'express';
import Item from '../models/Item.js';
import User from '../models/User.js';
import Swap from '../models/Swap.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get admin dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalItems,
      pendingItems,
      totalSwaps
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Item.countDocuments(),
      Item.countDocuments({ status: 'pending' }),
      Swap.countDocuments()
    ]);

    res.json({
      totalUsers,
      totalItems,
      pendingItems,
      totalSwaps
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.json({
      totalUsers: 0,
      totalItems: 0,
      pendingItems: 0,
      totalSwaps: 0
    });
  }
});

// Get pending items for moderation
router.get('/pending-items', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const items = await Item.find({ status: 'pending' })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Item.countDocuments({ status: 'pending' });

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching pending items:', error);
    res.json({ items: [] });
  }
});

// Approve item
router.patch('/items/:id/approve', async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.status = 'available';
    await item.save();

    res.json({
      message: 'Item approved successfully',
      item
    });
  } catch (error) {
    next(error);
  }
});

// Reject item
router.patch('/items/:id/reject', async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.status = 'rejected';
    await item.save();

    res.json({
      message: 'Item rejected successfully',
      item
    });
  } catch (error) {
    next(error);
  }
});

export default router;