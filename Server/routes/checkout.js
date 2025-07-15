const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const config = require('../config/database');

const prisma = new PrismaClient();

// Middleware to validate cart
const validateCart = (req, res, next) => {
    const { cartItems, total } = req.body;
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Cart items are required'
        });
    }
    
    if (!total || total <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Valid total amount is required'
        });
    }
    
    next();
};

// Process checkout
router.post('/process', validateCart, async (req, res) => {
    try {
        const { 
            cartItems, 
            total, 
            shippingAddress, 
            billingAddress, 
            paymentMethod,
            userId
        } = req.body;
        
        // Validate required fields
        if (!shippingAddress || !billingAddress || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Shipping address, billing address, and payment method are required'
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // If user has no address, save the shipping address to their profile
        if (!user.address) {
            await prisma.user.update({
                where: { id: userId },
                data: { address: shippingAddress }
            });
        }
        
        // Process payment (simulated)
        const paymentResult = processPayment(total, paymentMethod);
        
        // Only keep productId, quantity, price for each item
        const orderItems = cartItems.map(item => ({
            productId: String(item.productId),
            quantity: item.quantity,
            price: item.price
        }));
        
        // Create order
        const order = await prisma.order.create({
            data: {
                userId,
                items: {
                  create: orderItems
                },
                subtotal: total,
                shipping: 10.00, // Fixed shipping cost
                tax: total * 0.08, // 8% tax
                total: total + 10.00 + (total * 0.08),
                shippingAddress,
                billingAddress,
                paymentMethod,
                status: paymentResult.success ? 'confirmed' : 'failed',
                paymentStatus: paymentResult.success ? 'paid' : 'failed',
                paymentId: paymentResult.success ? paymentResult.paymentId : null
            },
            include: {
                items: true
            }
        });
        
        res.json({
            success: true,
            message: 'Order processed successfully',
            data: {
                order: {
                    id: order.id,
                    status: order.status,
                    paymentStatus: order.paymentStatus,
                    total: order.total,
                    items: order.items.length
                }
            }
        });
        
    } catch (error) {
        console.error('Checkout error:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        } else {
            console.error('Error object:', JSON.stringify(error));
        }
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message || error
        });
    }
});

// Simulate payment processing
const processPayment = (amount, paymentMethod) => {
    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
        return {
            success: true,
            paymentId: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            message: 'Payment processed successfully'
        };
    } else {
        return {
            success: false,
            message: 'Payment failed'
        };
    }
};

// Get order by ID
router.get('/order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Order retrieved successfully',
            data: { order }
        });
        
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Get user orders
router.get('/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [orders, totalOrders] = await Promise.all([
            prisma.order.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit),
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.order.count({
                where: { userId }
            })
        ]);
        
        res.json({
            success: true,
            message: 'User orders retrieved successfully',
            data: {
                orders,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalOrders / limit),
                    totalOrders,
                    ordersPerPage: parseInt(limit)
                }
            }
        });
        
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Update order status
router.put('/order/:orderId/status', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        
        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: {
                order: {
                    id: order.id,
                    status: order.status,
                    updatedAt: order.updatedAt
                }
            }
        });
        
    } catch (error) {
        console.error('Update order status error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Calculate shipping cost
router.post('/shipping-cost', (req, res) => {
    try {
        const { address, items } = req.body;
        
        // Simple shipping calculation
        let baseCost = 10.00;
        let additionalCost = 0;
        
        if (items && items.length > 0) {
            // Add $2 for each additional item
            additionalCost = (items.length - 1) * 2.00;
        }
        
        const totalShippingCost = baseCost + additionalCost;
        
        res.json({
            success: true,
            message: 'Shipping cost calculated successfully',
            data: {
                shippingCost: totalShippingCost,
                breakdown: {
                    baseCost,
                    additionalCost,
                    total: totalShippingCost
                }
            }
        });
        
    } catch (error) {
        console.error('Calculate shipping cost error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Validate shipping address
router.post('/validate-address', (req, res) => {
    try {
        const { address } = req.body;
        
        // Simple address validation
        const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
        const missingFields = requiredFields.filter(field => !address[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        
        res.json({
            success: true,
            message: 'Address is valid',
            data: { address }
        });
        
    } catch (error) {
        console.error('Validate address error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

module.exports = router; 