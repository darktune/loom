import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const PayazaTransactionSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be greater than zero')
    .max(50000000, 'Transaction exceeds maximum limit'),
  currency: z.enum(['NGN', 'USD']),
  email: z.string().email('Invalid email address format'),
  fullName: z.string().min(2).max(100).optional()
});

describe('Payaza Transaction Security Validation', () => {
  it('accepts valid transaction payloads', () => {
    const valid = {
      amount: 697500,
      currency: 'NGN',
      email: 'patron@loom.fashion',
      fullName: 'Babatunde Sterling'
    };
    expect(() => PayazaTransactionSchema.parse(valid)).not.toThrow();
  });

  it('rejects negative or zero payment amounts', () => {
    const negative = { amount: -500, currency: 'NGN', email: 'test@loom.fashion' };
    expect(() => PayazaTransactionSchema.parse(negative)).toThrow();

    const zero = { amount: 0, currency: 'NGN', email: 'test@loom.fashion' };
    expect(() => PayazaTransactionSchema.parse(zero)).toThrow();
  });

  it('rejects unauthorized currency codes', () => {
    const invalidCurrency = { amount: 5000, currency: 'EUR', email: 'test@loom.fashion' };
    expect(() => PayazaTransactionSchema.parse(invalidCurrency)).toThrow();
  });

  it('rejects malformed email addresses', () => {
    const badEmail = { amount: 5000, currency: 'USD', email: 'not-an-email' };
    expect(() => PayazaTransactionSchema.parse(badEmail)).toThrow();
  });
});
