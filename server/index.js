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
    : '*', // Allow all in dev, strict in prod
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

/**
 * Registers Webhooks in Shopify automatically
 */
async function registerShopifyWebhooks(domain, accessToken) {
  const backendUrl = process.env.RENDER_EXTERNAL_URL || process.env.VITE_API_URL || 'https://pocket-dashboard-mwjn.onrender.com';
  const webhookUrl = `${backendUrl}/api/webhooks/shopify`;
  const topics = ['orders/create', 'orders/updated'];

  for (const topic of topics) {
    try {
      const res = await fetch(`https://${domain}.myshopify.com/admin/api/2024-01/webhooks.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          webhook: { topic, address: webhookUrl, format: 'json' }
        })
      });
      const data = await res.json();
      if (!res.ok) {
        // "Address has already been taken" is a common safe error
        console.warn(`[Webhook Registration] ${topic} warning for ${domain}:`, JSON.stringify(data.errors));
      } else {
        console.log(`[Webhook Registration] ${topic} registered successfully for ${domain}`);
      }
    } catch (err) {
      console.error(`[Webhook Registration] Network error for ${topic}:`, err.message);
    }
  }
}

/**
 * POST /api/store
 * Securely creates a store and encrypts the shopify token before saving it to the database
 */
app.post('/api/store', async (req, res) => {
  const { owner_id, store_name, shopify_domain, shopify_client_id, shopify_access_token, primary_color, dashboard_style } = req.body;
  
  if (!owner_id || !shopify_domain || !shopify_access_token) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const cleanDomain = shopify_domain.replace('.myshopify.com', '');

  // Trial abuse protection: Check if domain is already registered
  const { data: existingStore } = await supabase
    .from('stores')
    .select('id, owner_id')
    .eq('shopify_domain', cleanDomain)
    .maybeSingle();

  if (existingStore) {
    // If it's the SAME owner reconnecting their own store, just return it (idempotent)
    if (existingStore.owner_id === owner_id) {
      const { data: ownStore } = await supabase.from('stores').select('*').eq('id', existingStore.id).single();
      return res.json(ownStore);
    }
    // Different owner trying same domain → block
    return res.status(403).json({ 
      error: 'This Shopify store is already connected to another account.' 
    });
  }

  // Encrypt the token
  const encryptedToken = encrypt(shopify_access_token);
  const encryptedClientId = shopify_client_id ? encrypt(shopify_client_id) : null;

  const { data, error } = await supabase
    .from('stores')
    .insert([{
      owner_id,
      store_name,
      shopify_domain: cleanDomain,
      shopify_client_id: encryptedClientId,
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

  // Automatically register webhooks so the user doesn't have to
  await registerShopifyWebhooks(cleanDomain, shopify_access_token);

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
 * POST /api/copilot
 * Handles AI Co-Pilot chat messages with RAG (Retrieval-Augmented Generation)
 */
app.post('/api/copilot', async (req, res) => {
  const { storeId, messages } = req.body;
  
  if (!storeId || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing storeId or messages' });
  }

  try {
    // 1. Fetch recent store context from Supabase to feed the AI
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, total_price, created_at, financial_status, fulfillment_status, tags, line_items')
      .eq('store_id', storeId)
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error) throw error;

    // Aggregate some quick stats so we don't blow up the prompt size
    let totalRevenue = 0;
    let totalOrders = orders.length;
    let rtoCount = 0;
    
    orders.forEach(o => {
      totalRevenue += parseFloat(o.total_price || 0);
      const tags = (o.tags || '').toLowerCase();
      if (tags.includes('rto') || tags.includes('return to origin') || o.financial_status === 'refunded') {
        rtoCount++;
      }
    });

    const rtoRate = totalOrders > 0 ? ((rtoCount / totalOrders) * 100).toFixed(1) : 0;

    // 2. Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 3. Construct the system prompt with the live data context
    const systemPrompt = `You are the AI Co-Pilot for a D2C E-commerce dashboard called "Pocket Dashboard". 
You are an expert in D2C e-commerce, specifically in the Indian market (handling COD, RTOs, Net Profit).
Here is the live data context for this user's store over the last 30 days:
- Total Orders: ${totalOrders}
- Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}
- RTO / Returned Orders: ${rtoCount} (${rtoRate}%)

Your job is to answer the user's questions about their business using this context. 
Keep your answers concise, highly actionable, and professional. Use formatting (bullet points, bold text) where appropriate. 
If they ask for specific products and you don't have the granular line_item data here, tell them you can see the high-level metrics but recommend checking the "Products" tab for SKU-level breakdowns.`;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    res.json({ 
      reply: chatResponse.choices[0].message.content 
    });

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
