import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://plovtfvpptwqwbthjnfz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsb3Z0ZnZwcHR3cXdidGhqbmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjEzNzgsImV4cCI6MjA3MjYzNzM3OH0.GP56FrW-u26Og2a7nFZWfqASHZTOw6kFjuqIFe2CW8w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
