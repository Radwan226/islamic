import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kqetghshistzupuufzva.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxZXRnaHNoaXN0enVwdXVmenZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0Mjg4MTMsImV4cCI6MjA3MjAwNDgxM30.99sHjHYr5TYUGfaHc6sX7sJQeEjiizH5KUSjqz7FSNo'

export const supabase = createClient(supabaseUrl, supabaseKey)

