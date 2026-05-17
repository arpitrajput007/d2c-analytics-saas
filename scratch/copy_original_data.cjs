const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const ORIGIN_SUPABASE_URL = 'https://yxjfccuxpwncqzawgnhn.supabase.co';
const ORIGIN_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4amZjY3V4cHduY3F6YXdnbmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTQ3MjUsImV4cCI6MjA4OTE3MDcyNX0.QTl55kYFAz5mFc-muxxZFWlAPdxEmFm9F55F5R5fz3U';

const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

const TARGET_SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://avybghwwpjruwydstdou.supabase.co';
const TARGET_SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const originClient = createClient(ORIGIN_SUPABASE_URL, ORIGIN_SUPABASE_ANON_KEY);
const targetClient = createClient(TARGET_SUPABASE_URL, TARGET_SUPABASE_KEY);

const STORE_ID = '4bbf3573-ff43-4ef4-946d-33766586693d';

async function copyOrders() {
  console.log('Fetching orders from original database...');
  let allOrders = [], from = 0, step = 1000, hasMore = true;
  while (hasMore) {
    const { data, error } = await originClient
      .from('orders')
      .select('*')
      .order('created_at', { ascending: true })
      .range(from, from + step - 1);
    if (error) throw error;
    allOrders = allOrders.concat(data || []);
    if ((data || []).length < step) hasMore = false; else from += step;
  }
  console.log(`Retrieved ${allOrders.length} orders from original database.`);

  const mapped = allOrders.map(o => ({
    id: o.id,
    store_id: STORE_ID,
    name: o.name,
    created_at: o.created_at,
    total_price: parseFloat(o.total_price || 0),
    tags: o.tags,
    fulfillment_status: o.fulfillment_status || null,
    financial_status: o.financial_status || null,
    cancelled_at: o.cancelled_at || null,
    shipping_title: o.shipping_title || '',
    customer_fn: o.customer_fn || null,
    customer_ln: o.customer_ln || null,
    line_items: [] // Empty fallback for old orders
  }));

  console.log('Upserting orders into Pocket-Dashboard...');
  // Chunk inserts by 200 to avoid request body size limitations
  const chunkSize = 200;
  for (let i = 0; i < mapped.length; i += chunkSize) {
    const chunk = mapped.slice(i, i + chunkSize);
    const { error } = await targetClient
      .from('orders')
      .upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error('Failed to upsert order chunk:', error);
      throw error;
    }
    console.log(`Upserted ${i + chunk.length}/${mapped.length} orders...`);
  }
  console.log('✅ Orders copy complete!');
}

async function copyAdSpend() {
  console.log('Fetching ad spend from original database...');
  const { data: adSpend, error: errAd } = await originClient
    .from('ad_spend')
    .select('*');
  if (errAd) throw errAd;
  console.log(`Retrieved ${adSpend.length} ad spend records.`);

  const mapped = adSpend.map(a => ({
    store_id: STORE_ID,
    date: a.date,
    amount: parseFloat(a.amount || 0)
  }));

  console.log('Upserting ad costs into Pocket-Dashboard...');
  const { error: errInsert } = await targetClient
    .from('ad_costs')
    .upsert(mapped, { onConflict: 'date,store_id' });
  if (errInsert) {
    console.error('Failed to upsert ad costs:', errInsert);
    throw errInsert;
  }
  console.log('✅ Ad costs copy complete!');
}

async function run() {
  try {
    await copyOrders();
    await copyAdSpend();
    console.log('🎉 Database migration complete!');
  } catch (e) {
    console.error('Migration failed:', e);
  }
}
run();
