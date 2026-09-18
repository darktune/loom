/**
 * Payaza Payment Gateway Client Helper
 * Handles dynamic script loading for Payaza Inline Checkout & Backend API integration
 */

const PAYAZA_SCRIPT_URL = 'https://checkout.payaza.africa/v1/payaza-checkout.js';

let scriptPromise = null;

export function loadPayazaScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window not available'));
  if (window.PayazaCheckout) return Promise.resolve(window.PayazaCheckout);
  
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${PAYAZA_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.PayazaCheckout));
      existing.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.src = PAYAZA_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      resolve(window.PayazaCheckout);
    };
    script.onerror = () => {
      console.warn('Could not load Payaza inline script directly, API fallback will be used.');
      resolve(null);
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function generatePayazaRef() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `LOOM-${timestamp}-${random}`;
}

export async function payWithPayaza({
  amount,
  currency = 'NGN',
  email,
  name = 'Loom Customer',
  reference = generatePayazaRef(),
  publicKey = import.meta.env.VITE_PAYAZA_PUBLIC_KEY || '',
  apiUrl = import.meta.env.VITE_API_URL || '',
  onSuccess,
  onCancel,
  onError,
}) {
  const cleanEmail = email && email.trim() ? email.trim() : 'customer@loom.atelier';
  const names = name.trim().split(' ');
  const firstName = names[0] || 'Loom';
  const lastName = names.slice(1).join(' ') || 'Customer';

  // Try inline SDK first if public key is available
  try {
    const PayazaCheckout = await loadPayazaScript();
    
    if (PayazaCheckout && publicKey) {
      const handler = new PayazaCheckout({
        key: publicKey,
        email: cleanEmail,
        amount: amount,
        currency: currency.toUpperCase(),
        reference: reference,
        merchant_name: 'Loom 3D Atelier',
        first_name: firstName,
        last_name: lastName,
        connection_mode: import.meta.env.PROD ? 'Live' : 'Test',
        callback: (response) => {
          if (response && (response.status === 'success' || response.status === 'completed' || response.transaction_reference)) {
            onSuccess?.({
              reference: response.transaction_reference || reference,
              amount,
              currency,
              email: cleanEmail,
              response,
            });
          } else {
            onError?.(new Error(response?.message || 'Payment was not completed'));
          }
        },
        onClose: () => {
          onCancel?.();
        },
      });

      if (typeof handler.open === 'function') {
        handler.open();
        return { mode: 'inline', reference };
      }
    }
  } catch (err) {
    console.warn('Payaza inline checkout init notice:', err);
  }

  // Fallback to Backend API initialization
  const apiEndpoint = `${apiUrl.replace(/\/$/, '')}/api/payaza/initialize`;
  try {
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency,
        email: cleanEmail,
        firstName,
        lastName,
        reference,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to initialize Payaza transaction');
    }

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return { mode: 'redirect', reference };
    }

    // Direct simulated/test success if configured in demo mode
    if (data.status === 'success' || data.success) {
      onSuccess?.({
        reference: data.reference || reference,
        amount,
        currency,
        email: cleanEmail,
        response: data,
      });
      return { mode: 'direct', reference };
    }

    throw new Error(data.message || 'No checkout URL returned from Payaza');
  } catch (err) {
    onError?.(err);
    throw err;
  }
}
