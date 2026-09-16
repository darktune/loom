import { createClient } from '@supabase/supabase-js';

// Read Supabase credentials from Vite client environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

/**
 * LOOM Supabase Client
 * Handles customer authentication, digital twin 3D measurements persistence,
 * order tracking, and bespoke artisan escrow states.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Service: Digital Twin Biometric Sync
 */
export const syncPatronMeasurements = async (userId, measurements) => {
  if (!isSupabaseConfigured) {
    console.info('ℹ️ Supabase not configured: Saving digital twin measurements locally.');
    localStorage.setItem('loom_measurements_backup', JSON.stringify(measurements));
    return { data: measurements, error: null };
  }

  const { data, error } = await supabase
    .from('patron_profiles')
    .upsert({
      user_id: userId,
      measurements,
      updated_at: new Date().toISOString()
    })
    .select();

  return { data, error };
};

/**
 * Service: Create Bespoke Escrow Order Record
 */
export const recordEscrowOrder = async (orderPayload) => {
  if (!isSupabaseConfigured) {
    console.info('ℹ️ Supabase not configured: Recording order in local session cache.');
    const existing = JSON.parse(localStorage.getItem('loom_orders_cache') || '[]');
    existing.push(orderPayload);
    localStorage.setItem('loom_orders_cache', JSON.stringify(existing));
    return { data: orderPayload, error: null };
  }

  const { data, error } = await supabase
    .from('bespoke_orders')
    .insert([orderPayload])
    .select();

  return { data, error };
};
