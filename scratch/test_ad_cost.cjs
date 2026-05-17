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
    .from('ad_costs')
    .upsert({
      store_id: '4bbf3573-ff43-4ef4-946d-33766586693d',
      date: '2026-05-17',
      amount: 100
    });

  if (error) {
    console.error('ad_costs upsert error:', error);
  } else {
    console.log('ad_costs upsert success!');
  }
}
run();
