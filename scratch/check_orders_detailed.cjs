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
  const storeId = '4bbf3573-ff43-4ef4-946d-33766586693d';
  
  const { data: firstOrder } = await supabase
    .from('orders')
    .select('id, name, created_at')
    .eq('store_id', storeId)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  const { data: lastOrder } = await supabase
    .from('orders')
    .select('id, name, created_at')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  console.log('Pocket-Dashboard earliest:', firstOrder);
  console.log('Pocket-Dashboard latest:', lastOrder);
}
run();
