// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cunotrmhwkntlzfodwzd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bm90cm1od2tudGx6Zm9kd3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNjI5MDUsImV4cCI6MjA2MjYzODkwNX0.B0Lcenkty-Ql3V5B_3Was_uu7-EN9J3F-YAP5pWkCYo'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
