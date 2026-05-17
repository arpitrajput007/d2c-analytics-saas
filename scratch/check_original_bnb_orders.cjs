const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yxjfccuxpwncqzawgnhn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4amZjY3V4cHduY3F6YXdnbmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTQ3MjUsImV4cCI6MjA4OTE3MDcyNX0.QTl55kYFAz5mFc-muxxZFWlAPdxEmFm9F55F5R5fz3U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, name, created_at')
    .order('created_at', { ascending: true })
    .limit(10);

  if (error) {
    console.error(error);
  } else {
    console.log('Earliest orders in original Bnb-dashboard:', orders);
  }

  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true });
  console.log('Total orders in original Bnb-dashboard:', count);
}
run();
