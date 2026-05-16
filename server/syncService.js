const { createClient } = require('@supabase/supabase-js');
const { decrypt } = require('./cryptoUtils');

const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://missing.supabase.co';
// Use Service Role Key on the server — bypasses RLS safely
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'MISSING_KEY';

const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Backend Service to sync Shopify Data securely.
 * IMPORTANT: The orders schema in Supabase must match the columns used in the dashboard:
 *   id (bigint - shopify order id), store_id, name, created_at, total_price,
 *   tags (text), customer_fn, customer_ln, line_items (jsonb)
 */
async function syncStoreData(storeId) {
  try {
    console.log(`[Sync] Starting sync for Store ID: ${storeId}`);

    // 1. Fetch the store's secure record to get the API Token
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('shopify_domain, shopify_client_id, shopify_access_token')
      .eq('id', storeId)
      .single();

    if (storeError || !store) {
      throw new Error(`Store not found (id=${storeId}). Error: ${storeError?.message}`);
    }

    const { shopify_domain } = store;
    const shopify_access_token = decrypt(store.shopify_access_token);
    const shopify_client_id = store.shopify_client_id ? decrypt(store.shopify_client_id) : null;

    // 2. Resolve final access token (handle shpss_ client-secret token exchange)
    let finalAccessToken = shopify_access_token;
    if (shopify_client_id && shopify_access_token.startsWith('shpss_')) {
      console.log(`[Sync] Exchanging shpss_ token for temporary Admin API token...`);
      try {
        const body = new URLSearchParams();
        body.append('grant_type', 'client_credentials');
        body.append('client_id', shopify_client_id);
        body.append('client_secret', shopify_access_token);

        const exchangeRes = await fetch(`https://${shopify_domain}.myshopify.com/admin/oauth/access_token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString()
        });

        if (exchangeRes.ok) {
          const data = await exchangeRes.json();
          if (data.access_token) {
            finalAccessToken = data.access_token;
            console.log(`[Sync] Successfully generated temporary token.`);
          }
        } else {
          const errText = await exchangeRes.text();
          console.warn(`[Sync] OAuth token exchange failed (${exchangeRes.status}): ${errText}. Using original token as fallback.`);
        }
      } catch (err) {
        console.warn('[Sync] Error during token exchange:', err.message);
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': finalAccessToken
    };

    // 3. First, verify credentials work by hitting the shop endpoint
    console.log(`[Sync] Verifying credentials for ${shopify_domain}.myshopify.com...`);
    const verifyRes = await fetch(`https://${shopify_domain}.myshopify.com/admin/api/2024-01/shop.json`, {
      method: 'GET',
      headers
    });

    if (!verifyRes.ok) {
      const errText = await verifyRes.text();
      throw new Error(`Shopify credentials invalid (${verifyRes.status}): ${errText.substring(0, 200)}`);
    }
    console.log(`[Sync] Credentials verified. Starting order fetch...`);

    // 4. Paginate through all orders
    let url = `https://${shopify_domain}.myshopify.com/admin/api/2024-01/orders.json?status=any&limit=250`;
    let totalSynced = 0;

    while (url) {
      const shopifyResponse = await fetch(url, { method: 'GET', headers });

      if (!shopifyResponse.ok) {
        const errText = await shopifyResponse.text();
        throw new Error(`Shopify API Error (${shopifyResponse.status}): ${errText.substring(0, 300)}`);
      }

      const { orders } = await shopifyResponse.json();
      if (!orders || orders.length === 0) break;

      // 5. Normalize orders to match the EXACT schema the dashboard reads from
      //    Dashboard reads: id, name, created_at, total_price, tags (text), customer_fn, customer_ln, line_items (jsonb)
      const normalizedOrders = orders.map(order => ({
        store_id: storeId,
        id: order.id,                                          // bigint shopify order id (used as PK conflict)
        name: order.name,                                      // e.g. "#1001"
        created_at: order.created_at,
        total_price: parseFloat(order.total_price || 0),
        tags: order.tags || '',                                // comma-separated string
        customer_fn: order.customer?.first_name || null,
        customer_ln: order.customer?.last_name || null,
        line_items: order.line_items || []                     // jsonb array
      }));

      // Upsert using the 'id' field as conflict key (Shopify order ID is globally unique)
      const { error: insertError } = await supabase
        .from('orders')
        .upsert(normalizedOrders, { onConflict: 'id' });

      if (insertError) {
        console.error('[Sync] Failed to upsert orders to database:', JSON.stringify(insertError));
        throw insertError;
      }

      totalSynced += normalizedOrders.length;
      console.log(`[Sync] Upserted ${totalSynced} orders so far for store ${storeId}...`);

      // 6. Paginate via Link header
      const linkHeader = shopifyResponse.headers.get('Link');
      const nextMatch = linkHeader ? linkHeader.match(/<([^>]+)>;\s*rel="next"/) : null;
      url = nextMatch ? nextMatch[1] : null;
    }

    console.log(`[Sync] ✅ Complete. Total orders synced: ${totalSynced} for store ${storeId}`);
    return { success: true, totalSynced };

  } catch (error) {
    console.error('[Sync] ❌ Data Sync Failed:', error.message);
    throw error; // Re-throw so the caller can handle it
  }
}

module.exports = { syncStoreData };
