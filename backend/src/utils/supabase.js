const { createClient } = require('@supabase/supabase-js')

// Service-role client — bypasses RLS, used for JWT validation + admin operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Anon client — public key, used for signup so Supabase sends real verification emails
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

module.exports = { supabaseAdmin, supabaseAnon }
