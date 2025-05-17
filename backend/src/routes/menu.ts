import express, { Request, Response } from 'express';
import Menu from '../models/Menu';
import { authenticateUser, isAdmin } from '../middleware/auth';

const router = express.Router();

// Get all menu items
router.get('/', async (req: Request, res: Response) => {
  try {
    const menuItems = await Menu.find({ isAvailable: true });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

// Get menu items by category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const menuItems = await Menu.find({
      category: req.params.category,
      isAvailable: true
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

// Admin routes
// Add new menu item
router.post('/', authenticateUser, isAdmin, async (req: Request, res: Response) => {
  try {
    const menuItem = new Menu(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ message: 'Error creating menu item' });
  }
});

// Update menu item
router.put('/:id', authenticateUser, isAdmin, async (req: Request, res: Response) => {
  try {
    const menuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!menuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ message: 'Error updating menu item' });
  }
});

// Delete menu item (soft delete)
router.delete('/:id', authenticateUser, isAdmin, async (req: Request, res: Response) => {
  try {
    const menuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      { isAvailable: false },
      { new: true }
    );
    if (!menuItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting menu item' });
  }
});

export default router; 