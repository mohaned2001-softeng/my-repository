import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://crxucqlqdwkznodeufam.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjFkMTc4MDgwLTdjZGUtNDBjZS1hZDYxLWY2ODhjOTc3NDgxZiJ9.eyJwcm9qZWN0SWQiOiJjcnh1Y3FscWR3a3pub2RldWZhbSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY0NTAzOTM1LCJleHAiOjIwNzk4NjM5MzUsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.cfwA3_AMltf0hX5KAls2aNVDVzazO1rDo5BeQVFMf9c';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };