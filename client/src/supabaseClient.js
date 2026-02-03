
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tjkeljhcebmvokjjuvfv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqa2VsamhjZWJtdm9ramp1dmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzkzNTQsImV4cCI6MjA4NTcxNTM1NH0.EYrkM2iKhViU_IkTIgnFaHTUXCsRNcZgad4gprkZAxY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
