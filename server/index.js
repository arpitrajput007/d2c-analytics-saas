const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');
const { syncStoreData } = require('./syncService');
const { encrypt } = require('./cryptoUtils');

const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://missing.supabase.co';
// Use the Service Role Key on the server — this bypasses RLS safely
// NEVER expose this key to the frontend/browser
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'MISSING_KEY';
const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://pocketdashboard.app', 'https://www.pocketdashboard.app']
    : '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

/**
 * Registers Webhooks in Shopify automatically
 */
async function registerShopifyWebhooks(domain, accessToken, clientId = null) {
  const backendUrl = process.env.RENDER_EXTERNAL_URL || process.env.VITE_API_URL || 'https://pocket-dashboard-mwjn.onrender.com';
  const webhookUrl = `${backendUrl}/api/webhooks/shopify`;
  const topics = ['orders/create', 'orders/updated'];

  let finalAccessToken = accessToken;
  if (clientId && accessToken.startsWith('shpss_')) {
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('client_id', clientId);
    body.append('client_secret', accessToken);
    try {
      const exchangeRes = await fetch(`https://${domain}.myshopify.com/admin/oauth/access_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      if (exchangeRes.ok) {
        const data = await exchangeRes.json();
        if (data.access_token) finalAccessToken = data.access_token;
      }
    } catch (e) {
      console.warn('Webhook token exchange error:', e.message);
    }
  }

  for (const topic of topics) {
    try {
      const res = await fetch(`https://${domain}.myshopify.com/admin/api/2024-01/webhooks.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': finalAccessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          webhook: { topic, address: webhookUrl, format: 'json' }
        })
      });
      const data = await res.json();
      if (!res.ok) {
        console.warn(`[Webhook] ${topic} warning for ${domain}:`, JSON.stringify(data.errors));
      } else {
        console.log(`[Webhook] ${topic} registered for ${domain}`);
      }
    } catch (err) {
      console.error(`[Webhook] Network error for ${topic}:`, err.message);
    }
  }
}

/**
 * POST /api/store
 * Validates Shopify credentials, then creates a store record in Supabase.
 */
app.post('/api/store', async (req, res) => {
  const { owner_id, store_name, shopify_domain, shopify_client_id, shopify_access_token, primary_color, dashboard_style } = req.body;

  if (!owner_id || !shopify_domain || !shopify_access_token) {
    return res.status(400).json({ error: 'Missing required fields: owner_id, shopify_domain, shopify_access_token' });
  }

  const cleanDomain = shopify_domain.replace('.myshopify.com', '').trim().toLowerCase();

  if (!cleanDomain) {
    return res.status(400).json({ error: 'Invalid Shopify domain' });
  }

  // Trial abuse protection: Check if domain is already registered
  const { data: existingStore } = await supabase
    .from('stores')
    .select('id, owner_id')
    .eq('shopify_domain', cleanDomain)
    .maybeSingle();

  if (existingStore) {
    if (existingStore.owner_id === owner_id) {
      // Same owner reconnecting — return the existing store (idempotent)
      const { data: ownStore } = await supabase.from('stores').select('*').eq('id', existingStore.id).single();
      return res.json(ownStore);
    }
    return res.status(403).json({
      error: 'This Shopify store is already connected to another account.'
    });
  }

  // Validate credentials against Shopify BEFORE saving
  try {
    const testToken = shopify_access_token;
    const verifyRes = await fetch(`https://${cleanDomain}.myshopify.com/admin/api/2024-01/shop.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': testToken,
        'Content-Type': 'application/json'
      }
    });

    if (!verifyRes.ok) {
      const errBody = await verifyRes.text();
      console.error(`[Store Connect] Credential validation failed (${verifyRes.status}):`, errBody.substring(0, 200));
      return res.status(401).json({
        error: `Could not connect to Shopify. Please check your domain and access token. (Status: ${verifyRes.status})`
      });
    }
    console.log(`[Store Connect] Credentials verified for ${cleanDomain}`);
  } catch (verifyErr) {
    console.error('[Store Connect] Network error during credential check:', verifyErr.message);
    return res.status(502).json({
      error: `Network error while connecting to Shopify: ${verifyErr.message}`
    });
  }

  // Encrypt the token
  const encryptedToken = encrypt(shopify_access_token);
  const encryptedClientId = shopify_client_id ? encrypt(shopify_client_id) : null;

  const { data, error } = await supabase
    .from('stores')
    .insert([{
      owner_id,
      store_name: store_name || cleanDomain,
      shopify_domain: cleanDomain,
      shopify_client_id: encryptedClientId,
      shopify_access_token: encryptedToken,
      primary_color: primary_color || '#6366f1',
      dashboard_style: dashboard_style || 'dark-modern'
    }])
    .select()
    .single();

  if (error) {
    console.error('[Store Connect] Failed to create store record:', error);
    return res.status(500).json({ error: error.message });
  }

  // Register webhooks (non-blocking)
  registerShopifyWebhooks(cleanDomain, shopify_access_token, shopify_client_id).catch(err =>
    console.warn('[Store Connect] Webhook registration failed (non-critical):', err.message)
  );

  res.json(data);
});

/**
 * PUT /api/store/:id
 * Edit Store Connection Credentials — validates new creds before saving
 */
app.put('/api/store/:id', async (req, res) => {
  const { id } = req.params;
  const { shopify_domain, shopify_client_id, shopify_access_token } = req.body;

  if (!id) return res.status(400).json({ error: 'Store ID is required' });
  if (!shopify_domain && !shopify_access_token) {
    return res.status(400).json({ error: 'At least shopify_domain or shopify_access_token must be provided' });
  }

  // Fetch current store to merge fields
  const { data: currentStore, error: fetchErr } = await supabase
    .from('stores')
    .select('shopify_domain, shopify_access_token, shopify_client_id')
    .eq('id', id)
    .single();

  if (fetchErr || !currentStore) {
    return res.status(404).json({ error: 'Store not found' });
  }

  const cleanDomain = shopify_domain
    ? shopify_domain.replace('.myshopify.com', '').trim().toLowerCase()
    : currentStore.shopify_domain;

  const plainToken = shopify_access_token ? shopify_access_token.trim() : null;
  const plainClientId = shopify_client_id ? shopify_client_id.trim() : null;

  // Validate credentials if either domain or token changed
  if (shopify_domain || shopify_access_token) {
    // Use new token if provided, else we can't re-validate without decrypting old one
    // Only validate if we have a new plain-text token
    if (plainToken) {
      try {
        const verifyRes = await fetch(`https://${cleanDomain}.myshopify.com/admin/api/2024-01/shop.json`, {
          method: 'GET',
          headers: {
            'X-Shopify-Access-Token': plainToken,
            'Content-Type': 'application/json'
          }
        });

        if (!verifyRes.ok) {
          const errBody = await verifyRes.text();
          console.error(`[Store Edit] Credential validation failed (${verifyRes.status}):`, errBody.substring(0, 200));
          return res.status(401).json({
            error: `Could not connect to Shopify with new credentials. (Status: ${verifyRes.status})`
          });
        }
        console.log(`[Store Edit] New credentials verified for ${cleanDomain}`);
      } catch (verifyErr) {
        console.error('[Store Edit] Network error during credential check:', verifyErr.message);
        return res.status(502).json({
          error: `Network error while validating new credentials: ${verifyErr.message}`
        });
      }
    }
  }

  const updates = {};
  updates.shopify_domain = cleanDomain;
  if (plainToken) updates.shopify_access_token = encrypt(plainToken);
  if (plainClientId) updates.shopify_client_id = encrypt(plainClientId);
  else if (shopify_client_id === '') updates.shopify_client_id = null; // Allow clearing

  const { error: updateErr } = await supabase.from('stores').update(updates).eq('id', id);
  if (updateErr) {
    console.error('[Store Edit] Failed to update store:', updateErr);
    return res.status(500).json({ error: updateErr.message });
  }

  // Register webhooks with new credentials (non-blocking)
  if (plainToken) {
    registerShopifyWebhooks(cleanDomain, plainToken, plainClientId).catch(err =>
      console.warn('[Store Edit] Webhook registration failed (non-critical):', err.message)
    );
  }

  res.json({ success: true });
});

/**
 * DELETE /api/store/:id
 * Disconnect/Delete Store — removes ALL associated data to bypass FK constraints
 */
app.delete('/api/store/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'Store ID is required' });

  console.log(`[Store Delete] Starting delete for store id=${id}`);

  try {
    // Step 1: Delete orders (has store_id FK)
    const { error: ordersErr } = await supabase.from('orders').delete().eq('store_id', id);
    if (ordersErr) {
      console.error('[Store Delete] orders delete error:', JSON.stringify(ordersErr));
      // Don't abort — try to continue
    } else {
      console.log(`[Store Delete] orders cleared for store ${id}`);
    }

    // Step 2: Delete products (has store_id FK)
    const { error: productsErr } = await supabase.from('products').delete().eq('store_id', id);
    if (productsErr) {
      console.error('[Store Delete] products delete error:', JSON.stringify(productsErr));
    } else {
      console.log(`[Store Delete] products cleared for store ${id}`);
    }

    // Step 3: Try any other FK tables (ignore if they don't exist)
    for (const table of ['ad_spends', 'daily_settings']) {
      const { error: tErr } = await supabase.from(table).delete().eq('store_id', id);
      if (tErr && tErr.code !== '42P01') {
        console.warn(`[Store Delete] ${table} delete warning:`, tErr.message);
      }
    }

    // Step 4: Delete the store record itself
    const { error: storeErr, data: storeData } = await supabase
      .from('stores')
      .delete()
      .eq('id', id)
      .select();

    if (storeErr) {
      console.error('[Store Delete] FAILED to delete store record:', JSON.stringify(storeErr));
      return res.status(500).json({
        error: `Failed to delete store: ${storeErr.message}`,
        code: storeErr.code,
        details: storeErr.details,
        hint: storeErr.hint
      });
    }

    console.log(`[Store Delete] ✅ Store ${id} deleted. Rows affected:`, storeData?.length ?? 'unknown');
    res.json({ success: true });

  } catch (err) {
    console.error('[Store Delete] Unexpected exception:', err);
    res.status(500).json({ error: `Unexpected error: ${err.message}` });
  }
});


/**
 * POST /api/webhooks/shopify
 * Listens for orders/create and orders/updated from Shopify
 * Uses the SAME schema as syncService for consistency
 */
app.post('/api/webhooks/shopify', async (req, res) => {
  // Always respond 200 immediately to Shopify
  res.status(200).send('OK');

  try {
    const shopDomain = req.headers['x-shopify-shop-domain'];
    const topic = req.headers['x-shopify-topic'];
    const orderData = req.body;

    console.log(`[Webhook] Received ${topic} from ${shopDomain}`);

    if (!shopDomain || !orderData || !orderData.id) return;

    const cleanDomain = shopDomain.replace('.myshopify.com', '').toLowerCase();
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('shopify_domain', cleanDomain)
      .single();

    if (!store) {
      console.warn(`[Webhook] No store found for domain: ${cleanDomain}`);
      return;
    }

    // Use the SAME schema as syncService
    const toInsert = [{
      store_id: store.id,
      id: orderData.id,                                        // bigint shopify order id
      name: orderData.name,                                    // e.g. "#1001"
      created_at: orderData.created_at,
      total_price: parseFloat(orderData.total_price || 0),
      tags: orderData.tags || '',                              // comma-separated string
      customer_fn: orderData.customer?.first_name || null,
      customer_ln: orderData.customer?.last_name || null,
      line_items: orderData.line_items || []                   // jsonb array
    }];

    const { error } = await supabase.from('orders').upsert(toInsert, { onConflict: 'id' });
    if (error) {
      console.error('[Webhook] Failed to upsert order:', error);
    } else {
      console.log(`[Webhook] ✅ Order ${orderData.id} (${orderData.name}) saved for store ${store.id}`);
    }
  } catch (err) {
    console.error('[Webhook] Error handling webhook:', err);
  }
});

/**
 * POST /api/sync/:storeId
 * Triggers an immediate Shopify → Supabase order sync.
 */
app.post('/api/sync/:storeId', async (req, res) => {
  const { storeId } = req.params;
  if (!storeId) return res.status(400).json({ error: 'storeId is required' });

  console.log(`[Sync API] Triggered for store: ${storeId}`);

  // Run sync in background — respond immediately
  syncStoreData(storeId)
    .then(result => console.log(`[Sync API] Completed for ${storeId}:`, result))
    .catch(err => console.error(`[Sync API] Failed for ${storeId}:`, err.message));

  res.json({ status: 'sync_started', storeId });
});

/**
 * GET /api/store/:id/status
 * Returns live connection status for a store (useful for post-connect verification)
 */
app.get('/api/store/:id/status', async (req, res) => {
  const { id } = req.params;

  const { data: store, error } = await supabase
    .from('stores')
    .select('id, store_name, shopify_domain, created_at')
    .eq('id', id)
    .single();

  if (error || !store) return res.status(404).json({ error: 'Store not found' });

  // Count orders to confirm sync worked
  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', id);

  res.json({
    store,
    orderCount: count || 0,
    connected: true
  });
});

/**
 * POST /api/copilot
 * Handles AI Co-Pilot chat messages with RAG
 */
app.post('/api/copilot', async (req, res) => {
  const { storeId, messages } = req.body;

  if (!storeId || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing storeId or messages' });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, total_price, created_at, tags, line_items')
      .eq('store_id', storeId)
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error) throw error;

    let totalRevenue = 0;
    let totalOrders = orders.length;
    let rtoCount = 0;

    orders.forEach(o => {
      totalRevenue += parseFloat(o.total_price || 0);
      const tags = (o.tags || '').toLowerCase();
      if (tags.includes('rto') || tags.includes('return to origin') || tags.includes('returned')) {
        rtoCount++;
      }
    });

    const rtoRate = totalOrders > 0 ? ((rtoCount / totalOrders) * 100).toFixed(1) : 0;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `You are the AI Co-Pilot for a D2C E-commerce dashboard called "Pocket Dashboard".
You are an expert in D2C e-commerce, specifically in the Indian market (handling COD, RTOs, Net Profit).
Here is the live data context for this user's store over the last 30 days:
- Total Orders: ${totalOrders}
- Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}
- RTO / Returned Orders: ${rtoCount} (${rtoRate}%)

Your job is to answer the user's questions about their business using this context.
Keep your answers concise, highly actionable, and professional. Use formatting (bullet points, bold text) where appropriate.`;

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    res.json({ reply: chatResponse.choices[0].message.content });

  } catch (err) {
    console.error('[Copilot Error]', err);
    res.status(500).json({ error: 'Failed to process AI request.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Pocket Dashboard Sync Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
