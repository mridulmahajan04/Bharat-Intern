import express, { Request, Response } from 'express';
import Order from '../models/Order';
import { authenticateUser, isAdmin } from '../middleware/auth';

const router = express.Router();

// Get all orders (admin only)
router.get('/', authenticateUser, isAdmin, async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error fetching orders:", errMsg);
    res.status(500).json({ message: 'Error fetching orders', error: errMsg });
  }
});

// Get orders by customer
router.get('/my-orders', authenticateUser, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const orders = await Order.find({ customerId: user.firebaseUid })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error fetching customer's orders:", errMsg);
    res.status(500).json({ message: 'Error fetching orders', error: errMsg });
  }
});

// Get single order
router.get('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem');
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    // Check if user is admin or the order owner
    if (user.role !== 'admin' && order.customerId !== user.firebaseUid) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    res.json(order);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error fetching single order:", errMsg);
    res.status(500).json({ message: 'Error fetching order', error: errMsg });
  }
});

// Create new order
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    console.log("ORDER REQUEST BODY:", req.body);
    const user = (req as any).user;
    console.log("ORDER USER:", user);
    const order = new Order({
      ...req.body,
      customerId: user.firebaseUid
    });
    console.log("ORDER BEFORE SAVE:", order);
    const savedOrder = await order.save();
    console.log("ORDER SAVED:", savedOrder);
    res.status(201).json(savedOrder);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("ORDER CREATION ERROR:", errMsg);
    res.status(400).json({ 
      message: 'Error creating order', 
      error: errMsg
    });
  }
});

// Update order status (admin only)
router.patch('/:id/status', authenticateUser, isAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.menuItem');
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error updating order status:", errMsg);
    res.status(400).json({ message: 'Error updating order status', error: errMsg });
  }
});

// Update payment status
router.patch('/:id/payment', authenticateUser, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    // Check if user is admin or the order owner
    if (user.role !== 'admin' && order.customerId !== user.firebaseUid) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    order.paymentStatus = paymentStatus;
    await order.save();
    res.json(order);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error updating payment status:", errMsg);
    res.status(400).json({ message: 'Error updating payment status', error: errMsg });
  }
});

export default router;
