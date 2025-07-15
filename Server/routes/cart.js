const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

const DUMMYJSON_BASE = 'https://dummyjson.com/products';

// Helper to fetch product details from DummyJSON
async function fetchProductDetails(productId) {
  const res = await axios.get(`${DUMMYJSON_BASE}/${productId}`);
  return res.data;
}

// Helper to get or create a cart for a user
async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({ where: { userId }, include: { items: true } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
}

// Get cart with real-time product details
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const cart = await getOrCreateCart(userId);
    const items = await prisma.cartItem.findMany({ where: { cartId: cart.id } });
    // Fetch product details for each cart item
    const detailedItems = await Promise.all(items.map(async (item) => {
      let product = null;
      try {
        product = await fetchProductDetails(item.productId);
      } catch (e) {}
      return {
        ...item,
        product,
      };
    }));
    res.json({
      success: true,
      message: 'Cart retrieved successfully',
      data: {
        cart: {
          id: cart.id,
          userId: cart.userId,
          items: detailedItems,
        },
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { productId, quantity = 1 } = req.body;
    if (!productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Product ID and valid quantity required' });
    }
    const cart = await getOrCreateCart(userId);
    // Upsert cart item
    const productIdStr = String(productId); // Ensure string type
    const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId: productIdStr } });
    if (existing) {
      await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } });
    } else {
      await prisma.cartItem.create({ data: { cartId: cart.id, productId: productIdStr, quantity } });
    }
    // Return updated cart
    const items = await prisma.cartItem.findMany({ where: { cartId: cart.id } });
    const detailedItems = await Promise.all(items.map(async (item) => {
      let product = null;
      try {
        product = await fetchProductDetails(item.productId);
      } catch (e) {}
      return {
        ...item,
        product,
      };
    }));
    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        cart: {
          id: cart.id,
          userId: cart.userId,
          items: detailedItems,
        },
      },
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update cart item quantity
router.put('/update/:itemId', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Valid quantity is required' });
    }
    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    // Return updated cart
    const cart = await prisma.cart.findUnique({ where: { id: item.cartId } });
    const items = await prisma.cartItem.findMany({ where: { cartId: cart.id } });
    const detailedItems = await Promise.all(items.map(async (item) => {
      let product = null;
      try {
        product = await fetchProductDetails(item.productId);
      } catch (e) {}
      return {
        ...item,
        product,
      };
    }));
    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: {
        cart: {
          id: cart.id,
          userId: cart.userId,
          items: detailedItems,
        },
      },
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { itemId } = req.params;
    const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    await prisma.cartItem.delete({ where: { id: itemId } });
    // Return updated cart
    const cart = await prisma.cart.findUnique({ where: { id: item.cartId } });
    const items = await prisma.cartItem.findMany({ where: { cartId: cart.id } });
    const detailedItems = await Promise.all(items.map(async (item) => {
      let product = null;
      try {
        product = await fetchProductDetails(item.productId);
      } catch (e) {}
      return {
        ...item,
        product,
      };
    }));
    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        cart: {
          id: cart.id,
          userId: cart.userId,
          items: detailedItems,
        },
      },
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Clear cart
router.delete('/clear', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return res.json({ success: true, message: 'Cart cleared', data: { cart: { items: [] } } });
    }
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.json({ success: true, message: 'Cart cleared', data: { cart: { id: cart.id, userId: cart.userId, items: [] } } });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router; 