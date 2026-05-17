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
    .from('stores')
    .select('id')
    .limit(1);

  console.log('Stores table connection:', error ? error.message : 'OK');

  // Let's do a raw sql query if we can or check common table names like ad_spend
  const tables = ['ad_costs', 'ad_spend', 'orders', 'stores', 'product_pricing', 'ad_costs_new'];
  for (const t of tables) {
    const { error: e } = await targetClient.from(t).select('count', { count: 'exact', head: true });
    console.log(`Table '${t}' existence:`, e ? `NOT EXISTS (${e.message})` : 'EXISTS!');
  }
}
run();
