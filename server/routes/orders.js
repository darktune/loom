import express from 'express';
const router = express.Router();

// Standard E-Commerce Order Creation & Payaza Hand-off
router.post('/create', (req, res) => {
  const { garment, priceNaira, customer } = req.body;

  const orderData = {
    success: true,
    orderId: `LOOM-${Math.floor(100000 + Math.random() * 900000)}`,
    amount: priceNaira,
    currency: 'NGN',
    status: 'PENDING_PAYMENT',
    gateway: 'PAYAZA',
    garment,
    createdAt: new Date().toISOString()
  };

  res.status(200).json(orderData);
});

export default router;
