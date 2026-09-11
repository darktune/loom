import express from 'express';
const router = express.Router();

router.post('/initialize-transaction', (req, res) => {
  const { amount, currency, email } = req.body;
  res.status(200).json({
    status: 'success',
    message: 'Payaza transaction initialized',
    data: {
      checkoutUrl: 'https://checkout.payaza.africa/pay/demo',
      reference: `PZ_${Date.now()}`
    }
  });
});

export default router;
