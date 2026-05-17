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
  const { data, error } = await supabase.from('stores').select('*').limit(5);
  if (error) {
    console.error(error);
  } else {
    console.log('Rows:', data.map(r => ({ id: r.id, name: r.store_name, features: r.dashboard_features, feat_type: typeof r.dashboard_features })));
  }
}
run();
