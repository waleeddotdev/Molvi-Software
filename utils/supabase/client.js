// utils/supabase/client.js

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        // Use the correct variable name here
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
}