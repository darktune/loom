import { describe, it, expect } from 'vitest';

describe('LOOM Currency & Pricing Logic', () => {
  const exchangeRate = 1600;

  const formatPrice = (priceNGN, currency = 'NGN') => {
    const ngn = priceNGN || 697500;
    if (currency === 'USD') {
      const usd = Math.round(ngn / exchangeRate);
      return `$${usd.toLocaleString()}`;
    }
    return `₦${ngn.toLocaleString()}`;
  };

  it('formats Naira currency correctly with commas and ₦ symbol', () => {
    expect(formatPrice(697500, 'NGN')).toBe('₦697,500');
    expect(formatPrice(1000000, 'NGN')).toBe('₦1,000,000');
    expect(formatPrice(520000, 'NGN')).toBe('₦520,000');
  });

  it('converts and formats USD accurately using the exchange rate', () => {
    // 697500 / 1600 = 435.9375 -> rounded to 436
    expect(formatPrice(697500, 'USD')).toBe('$436');
    // 1600000 / 1600 = 1000
    expect(formatPrice(1600000, 'USD')).toBe('$1,000');
  });

  it('handles fallback amounts gracefully', () => {
    expect(formatPrice(0, 'NGN')).toBe('₦697,500');
    expect(formatPrice(null, 'USD')).toBe('$436');
  });
});
