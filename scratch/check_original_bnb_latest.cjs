const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yxjfccuxpwncqzawgnhn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4amZjY3V4cHduY3F6YXdnbmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTQ3MjUsImV4cCI6MjA4OTE3MDcyNX0.QTl55kYFAz5mFc-muxxZFWlAPdxEmFm9F55F5R5fz3U';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  const { data: firstOrder } = await supabase
    .from('orders')
    .select('id, name, created_at')
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  const { data: lastOrder } = await supabase
    .from('orders')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  console.log('Original earliest:', firstOrder);
  console.log('Original latest:', lastOrder);
}
run();
