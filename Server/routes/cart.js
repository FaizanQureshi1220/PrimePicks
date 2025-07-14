const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// In-memory cart storage (replace with database in production)
const carts = {};

// Middleware to get or create cart for user
const getOrCreateCart = (req, res, next) => {
    const userId = req.user?.id || req.body.userId || 'anonymous';
    
    if (!carts[userId]) {
        carts[userId] = {
            id: userId,
            items: [],
            total: 0,
            itemCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
    
    req.cart = carts[userId];
    next();
};

// Get cart with real-time product details
router.get('/', getOrCreateCart, async (req, res) => {
    try {
        // Fetch real-time product details for each cart item
        const cartWithProducts = {
            ...req.cart,
            items: []
        };

        for (const item of req.cart.items) {
            try {
                const product = await productService.getProductById(item.productId);
                cartWithProducts.items.push({
                    ...item,
                    product: {
                        id: product.id,
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                        image: product.image,
                        thumbnail: product.thumbnail,
                        inStock: product.inStock,
                        stock: product.stock
                    }
                });
            } catch (error) {
                console.error(`Error fetching product ${item.productId}:`, error);
                // Add item without product details if fetch fails
                cartWithProducts.items.push(item);
            }
        }

        res.json({
            success: true,
            message: 'Cart retrieved successfully',
            data: {
                cart: cartWithProducts
            }
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Add item to cart
router.post('/add', getOrCreateCart, async (req, res) => {
    try {
        const { productId, quantity = 1, size, color } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }
        
        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be greater than 0'
            });
        }
        
        // Fetch product details from external API
        let product;
        try {
            product = await productService.getProductById(productId);
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Check if item already exists in cart
        const existingItemIndex = req.cart.items.findIndex(item => 
            item.productId === productId && 
            item.size === size && 
            item.color === color
        );
        
        if (existingItemIndex !== -1) {
            // Update existing item quantity
            req.cart.items[existingItemIndex].quantity += quantity;
            req.cart.items[existingItemIndex].subtotal = 
                req.cart.items[existingItemIndex].quantity * req.cart.items[existingItemIndex].price;
        } else {
            // Add new item
            const newItem = {
                id: Date.now().toString(),
                productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity,
                size,
                color,
                subtotal: product.price * quantity
            };
            
            req.cart.items.push(newItem);
        }
        
        // Update cart totals
        req.cart.total = req.cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        req.cart.itemCount = req.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        req.cart.updatedAt = new Date();
        
        res.json({
            success: true,
            message: 'Item added to cart successfully',
            data: {
                cart: req.cart
            }
        });
        
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Update cart item quantity
router.put('/update/:itemId', getOrCreateCart, (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        
        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid quantity is required'
            });
        }
        
        const itemIndex = req.cart.items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }
        
        // Update quantity and subtotal
        req.cart.items[itemIndex].quantity = quantity;
        req.cart.items[itemIndex].subtotal = req.cart.items[itemIndex].price * quantity;
        
        // Update cart totals
        req.cart.total = req.cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        req.cart.itemCount = req.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        req.cart.updatedAt = new Date();
        
        res.json({
            success: true,
            message: 'Cart item updated successfully',
            data: {
                cart: req.cart
            }
        });
        
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Remove item from cart
router.delete('/remove/:itemId', getOrCreateCart, (req, res) => {
    try {
        const { itemId } = req.params;
        
        const itemIndex = req.cart.items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }
        
        // Remove item
        req.cart.items.splice(itemIndex, 1);
        
        // Update cart totals
        req.cart.total = req.cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        req.cart.itemCount = req.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        req.cart.updatedAt = new Date();
        
        res.json({
            success: true,
            message: 'Item removed from cart successfully',
            data: {
                cart: req.cart
            }
        });
        
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Clear cart
router.delete('/clear', getOrCreateCart, (req, res) => {
    try {
        req.cart.items = [];
        req.cart.total = 0;
        req.cart.itemCount = 0;
        req.cart.updatedAt = new Date();
        
        res.json({
            success: true,
            message: 'Cart cleared successfully',
            data: {
                cart: req.cart
            }
        });
        
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Get cart summary
router.get('/summary', getOrCreateCart, (req, res) => {
    try {
        const summary = {
            itemCount: req.cart.itemCount,
            total: req.cart.total,
            itemTypes: req.cart.items.length
        };
        
        res.json({
            success: true,
            message: 'Cart summary retrieved successfully',
            data: { summary }
        });
        
    } catch (error) {
        console.error('Get cart summary error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

module.exports = router; 