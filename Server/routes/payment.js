const express = require('express');
const router = express.Router();

// Require Stripe and load secret key from environment
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /create-checkout-session
 * Body: { cartItems: [{ productId, name, price, quantity }], successUrl, cancelUrl }
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { cartItems, successUrl, cancelUrl } = req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }
    // Map cart items to Stripe line items
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    res.json({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ success: false, message: 'Stripe session creation failed', error: error.message });
  }
});

module.exports = router; 