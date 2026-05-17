const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

const VITE_SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://avybghwwpjruwydstdou.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: store, error: errStore } = await supabase
    .from('stores')
    .select('*')
    .ilike('store_name', '%BnB%')
    .single();

  if (errStore || !store) {
    console.error('Store BnB not found:', errStore);
    return;
  }
  console.log('Store:', JSON.stringify(store, null, 2));
}
run();
