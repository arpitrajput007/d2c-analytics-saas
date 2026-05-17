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
  const tables = ['ad_costs', 'ad_spend', 'orders', 'stores', 'product_pricing', 'ad_costs_new'];
  for (const t of tables) {
    const { data, error } = await targetClient.from(t).select('*').limit(1);
    if (error) {
      console.log(`Table '${t}': ERROR`, error.code, error.message);
    } else {
      console.log(`Table '${t}': EXISTS! Sample data:`, data);
    }
  }
}
run();
