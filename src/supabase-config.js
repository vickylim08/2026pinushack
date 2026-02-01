import { createClient } from '@supabase/supabase-js';

// These details are from your Supabase project settings > API
const supabaseUrl = 'https://qodcklmnmranomfnrhat.supabase.co';
const supabaseAnonKey = 'sb_publishable_Kgo5tAJJmfJci63azRotyA_m9NnZQAY';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
