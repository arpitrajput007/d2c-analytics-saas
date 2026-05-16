import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findStore() {
  const { data, error } = await supabase
    .from('stores')
    .select('id, shopify_domain')
    .limit(1);

  if (error) {
    console.error('Error fetching store:', error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('Found store:', data[0]);
    return data[0].id;
  } else {
    console.log('No stores found in the database.');
    return null;
  }
}

findStore();
