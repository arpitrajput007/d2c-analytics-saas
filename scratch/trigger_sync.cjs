const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

// Set env variables before requiring syncService
process.env.VITE_SUPABASE_URL = env.VITE_SUPABASE_URL;
process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const { syncStoreData } = require('../server/syncService');

async function run() {
  const storeId = '4bbf3573-ff43-4ef4-946d-33766586693d';
  console.log('Starting sync for BnB Toys...');
  try {
    const result = await syncStoreData(storeId);
    console.log('Sync complete!', result);
  } catch (e) {
    console.error('Sync failed:', e);
  }
}
run();
