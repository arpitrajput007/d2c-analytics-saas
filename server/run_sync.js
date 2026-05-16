const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length) {
    env[key.trim()] = value.join('=').trim();
  }
});

// Mock process.env for syncService
process.env.VITE_SUPABASE_URL = env['VITE_SUPABASE_URL'];
process.env.SUPABASE_SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY'];

const { syncStoreData } = require('./syncService.js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data } = await supabase.from('stores').select('id').limit(1);
  if (data && data.length > 0) {
    console.log('Running sync for store ID:', data[0].id);
    await syncStoreData(data[0].id);
  } else {
    console.log('No store found');
  }
}

run();
