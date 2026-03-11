/**
 * ⚠️ LEGACY SUPABASE CLIENT - DEPRECATED
 * 
 * This app now uses PocketBase. This file is kept as a stub to prevent
 * import errors in legacy code that hasn't been migrated yet.
 * 
 * DO NOT USE THIS FILE. Use PocketBase instead:
 * import { pb } from '@/lib/pocketbase/client'
 */

console.warn('⚠️ Supabase client is deprecated. This app uses PocketBase now.');

// Create a stub object that won't throw errors
const createStubSupabaseClient = () => {
  const stub: any = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: { message: 'Supabase is not configured' } })
        })
      })
    })
  };
  return stub;
};

// Export stub instance
export const supabase = createStubSupabaseClient();
export const getSupabaseClient = () => supabase;
export default supabase; 