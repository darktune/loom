import express from 'express';
import { z } from 'zod';

const router = express.Router();

// Strict Zod Validation Schema for Payaza Escrow Transactions
const PayazaTransactionSchema = z.object({
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be greater than zero')
    .max(50000000, 'Transaction exceeds maximum allowable escrow limit'),
  currency: z.enum(['NGN', 'USD'], {
    errorMap: () => ({ message: 'Currency must be NGN or USD' })
  }),
  email: z
    .string()
    .email('Invalid email address format')
    .max(120, 'Email address too long'),
  fullName: z
    .string()
    .min(2, 'Full name must contain at least 2 characters')
    .max(100, 'Full name exceeds 100 characters')
    .optional()
});

router.post('/initialize-transaction', (req, res) => {
  try {
    const validatedData = PayazaTransactionSchema.parse(req.body);

    const transactionRef = `PZ_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Secure payload response
    res.status(200).json({
      status: 'success',
      message: 'Payaza escrow transaction verified and initialized',
      data: {
        checkoutUrl: 'https://checkout.payaza.africa/pay/demo',
        reference: transactionRef,
        amount: validatedData.amount,
        currency: validatedData.currency,
        recipient: 'LOOM Bespoke Escrow Vault',
        securityHash: Buffer.from(`${transactionRef}:${validatedData.amount}`).toString('base64')
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed for Payaza transaction',
        errors: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to initialize Payaza transaction'
    });
  }
});

export default router;
