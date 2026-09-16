export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: 'fail', message: 'Method Not Allowed' });
  }

  try {
    const { amount, currency, email, fullName } = req.body || {};

    if (!amount || amount <= 0) {
      return res.status(400).json({ status: 'fail', message: 'Invalid or missing amount' });
    }

    if (!['NGN', 'USD'].includes(currency)) {
      return res.status(400).json({ status: 'fail', message: 'Currency must be NGN or USD' });
    }

    const transactionRef = `PZ_VCL_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return res.status(200).json({
      status: 'success',
      message: 'Payaza transaction initialized via Vercel Edge Serverless',
      data: {
        checkoutUrl: 'https://checkout.payaza.africa/pay/demo',
        reference: transactionRef,
        amount: Number(amount),
        currency,
        recipient: 'LOOM Bespoke Escrow Vault'
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Serverless transaction initialization failed' });
  }
}
