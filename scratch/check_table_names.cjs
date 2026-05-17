const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

const TARGET_SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://avybghwwpjruwydstdou.supabase.co';
const TARGET_SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const targetClient = createClient(TARGET_SUPABASE_URL, TARGET_SUPABASE_KEY);

async function run() {
  const { data, error } = await targetClient
    .rpc('get_tables'); // Or query a dummy to trigger table listings

  if (error) {
    console.error(error);
  }
  
  // Try querying supabase.from('ad_spend') to see if it exists
  const { data: d1, error: e1 } = await targetClient.from('ad_spend').select('*').limit(1);
  console.log('ad_spend check:', e1 ? e1.message : 'Exists!');

  const { data: d2, error: e2 } = await targetClient.from('ad_costs').select('*').limit(1);
  console.log('ad_costs check:', e2 ? e2.message : 'Exists!');
}
run();
