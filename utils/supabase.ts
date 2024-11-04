import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://djzgrnnehtmnpypnbrve.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqemdybm5laHRtbnB5cG5icnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3ODUwMTIsImV4cCI6MjA0NTM2MTAxMn0.BwLjvvAZdC-UJFYW0Kgg_4x-6EWy51EuEHDP-MUDfdY';

export const supabase = createClient(supabaseUrl, supabaseKey);