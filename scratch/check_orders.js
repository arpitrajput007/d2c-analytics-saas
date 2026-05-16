import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = fs.readFileSync(path.join(__dirname, '../.env'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.join('=').trim();
  }
});

const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'].split('SHOPIFY_CLIENT_ID')[0].trim();

const supabase = createClient(
  env['VITE_SUPABASE_URL'],
  serviceRoleKey
);

async function checkOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, name, fulfillment_status, financial_status, cancelled_at, shipping_title, tags')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching orders:', error);
    return;
  }
  
  console.log('Latest 5 orders from Supabase (bypassing RLS):');
  console.log(JSON.stringify(data, null, 2));
}

checkOrders();
