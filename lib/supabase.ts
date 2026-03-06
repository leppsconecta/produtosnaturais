import { createClient } from '@supabase/supabase-js';

// Dummy client for frontend dev without a real project yet
// Later this will be replaced by the Node API calls
export const supabase = createClient(
    'https://xyzcompany.supabase.co',
    'public-anon-key-dummy'
);
