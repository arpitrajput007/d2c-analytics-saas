const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { syncStoreData } = require('./syncService');
const { encrypt } = require('./cryptoUtils');

const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL; 
const VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY; 
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/**
 * POST /api/store
 * Securely creates a store and encrypts the shopify token before saving it to the database
 */
app.post('/api/store', async (req, res) => {
  const { owner_id, store_name, shopify_domain, shopify_access_token, primary_color, dashboard_style } = req.body;
  
  if (!owner_id || !shopify_domain || !shopify_access_token) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Encrypt the token
  const encryptedToken = encrypt(shopify_access_token);

  const { data, error } = await supabase
    .from('stores')
    .insert([{
      owner_id,
      store_name,
      shopify_domain: shopify_domain.replace('.myshopify.com', ''),
      shopify_access_token: encryptedToken,
      primary_color,
      dashboard_style
    }])
    .select()
    .single();

  if (error) {
    console.error('Failed to create store:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

/**
 * POST /api/webhooks/shopify
 * Listens for orders/create and orders/updated from Shopify
 */
app.post('/api/webhooks/shopify', async (req, res) => {
  try {
    const shopDomain = req.headers['x-shopify-shop-domain'];
    const topic = req.headers['x-shopify-topic']; // e.g. orders/create
    const orderData = req.body;

    console.log(`[Webhook] Received ${topic} from ${shopDomain}`);

    if (!shopDomain || !orderData || !orderData.id) {
      return res.status(200).send('OK'); // Always return 200 to Shopify
    }

    const cleanDomain = shopDomain.replace('.myshopify.com', '');
    const { data: store } = await supabase.from('stores').select('id').eq('shopify_domain', cleanDomain).single();

    if (store) {
      const toInsert = [{
        store_id: store.id,
        id: orderData.id,
        name: orderData.name,
        created_at: orderData.created_at,
        total_price: orderData.total_price,
        tags: orderData.tags || '',
        customer_fn: orderData.customer?.first_name || null,
        customer_ln: orderData.customer?.last_name || null,
        line_items: orderData.line_items || []
      }];
      
      const { error } = await supabase.from('orders').upsert(toInsert, { onConflict: 'id' });
      if (error) console.error('[Webhook] Failed to insert order:', error);
      else console.log(`[Webhook] Successfully saved order ${orderData.id}`);
    }
  } catch (err) {
    console.error('[Webhook] Error handling webhook:', err);
  }
  
  res.status(200).send('OK');
});

/**
 * POST /api/sync/:storeId
 * Triggers an immediate Shopify → Supabase order sync for the given store.
 * Called automatically when a user connects their store, and available for manual use.
 */
app.post('/api/sync/:storeId', async (req, res) => {
  const { storeId } = req.params;
  if (!storeId) return res.status(400).json({ error: 'storeId is required' });

  console.log(`[auto-sync] Triggered for store: ${storeId}`);

  // Run sync in background so the response returns immediately
  syncStoreData(storeId).catch(err =>
    console.error(`[auto-sync] Failed for ${storeId}:`, err.message)
  );

  res.json({ status: 'sync_started', storeId });
});

/**
 * GET /api/health
 * Simple health check
 */
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Pocket Dashboard Sync Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
