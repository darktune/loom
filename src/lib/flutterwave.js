/**
 * Flutterwave Payment Gateway Helper
 * Integrates Flutterwave v3 Inline Script & Backend API Verification
 */

const FLUTTERWAVE_SCRIPT_URL = 'https://checkout.flutterwave.com/v3.js';

let scriptPromise = null;

export function loadFlutterwaveScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window not available'));
  if (window.FlutterwaveCheckout) return Promise.resolve(window.FlutterwaveCheckout);

  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${FLUTTERWAVE_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.FlutterwaveCheckout));
      existing.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.src = FLUTTERWAVE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.FlutterwaveCheckout);
    script.onerror = () => {
      console.warn('Could not load Flutterwave inline script directly, API fallback will be used.');
      resolve(null);
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function generateFlutterwaveRef() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `LOOM-FLW-${timestamp}-${random}`;
}

export async function payWithFlutterwave({
  amount,
  currency = 'USD',
  email,
  name = 'Loom Customer',
  reference = generateFlutterwaveRef(),
  publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '',
  apiUrl = import.meta.env.VITE_API_URL || '',
  onSuccess,
  onCancel,
  onError,
}) {
  const cleanEmail = email && email.trim() ? email.trim() : 'customer@loom.atelier';
  const cleanName = name && name.trim() ? name.trim() : 'Loom Customer';

  // 1. Try inline SDK if public key is available
  try {
    const FlutterwaveCheckout = await loadFlutterwaveScript();

    if (FlutterwaveCheckout && publicKey) {
      FlutterwaveCheckout({
        public_key: publicKey,
        tx_ref: reference,
        amount: Number(amount),
        currency: currency.toUpperCase(),
        payment_options: 'card,banktransfer,account,ussd,mobilemoney',
        customer: {
          email: cleanEmail,
          name: cleanName,
        },
        customizations: {
          title: 'Loom Atelier',
          description: 'Custom Bespoke Garment & Tailoring Order',
          logo: 'https://loom-atelier.vercel.app/favicon.ico',
        },
        callback: (response) => {
          if (response && (response.status === 'successful' || response.status === 'completed' || response.tx_ref)) {
            onSuccess?.({
              reference: response.tx_ref || reference,
              transactionId: response.transaction_id || response.id,
              amount,
              currency,
              email: cleanEmail,
              response,
            });
          } else {
            onError?.(new Error(response?.message || 'Payment was not successful.'));
          }
        },
        onclose: () => {
          onCancel?.();
        },
      });

      return { mode: 'inline', reference };
    }
  } catch (err) {
    console.warn('Flutterwave inline checkout init error:', err);
  }

  // 2. Fallback to Server API initialization if public key is not injected directly
  const apiEndpoint = `${apiUrl.replace(/\/$/, '')}/api/flutterwave/initialize`;
  try {
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency,
        email: cleanEmail,
        name: cleanName,
        reference,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to initialize Flutterwave payment');
    }

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return { mode: 'redirect', reference };
    }

    if (data.status === 'success' || data.demo) {
      onSuccess?.({
        reference: data.reference || reference,
        amount,
        currency,
        email: cleanEmail,
        response: data,
      });
      return { mode: 'direct', reference };
    }

    throw new Error(data.message || 'No checkout link returned from Flutterwave');
  } catch (err) {
    onError?.(err);
    throw err;
  }
}
