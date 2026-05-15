const { createClient } = require('@supabase/supabase-js');
const { decrypt } = require('./cryptoUtils');
// In a real environment, you'd load from dotenv
// require('dotenv').config();

const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://missing.supabase.co';
// Use Service Role Key on the server — bypasses RLS safely
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'MISSING_KEY'; 

const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Backend Service to sync Shopify Data securely.
 * This should be deployed as a cron-job, edge function, or a secure express.js route.
 */
async function syncStoreData(storeId) {
  try {
    console.log(`Starting sync for Store ID: ${storeId}`);

    // 1. Fetch the store's secure record to get the API Token
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('shopify_domain, shopify_client_id, shopify_access_token')
      .eq('id', storeId)
      .single();

    if (storeError || !store) throw new Error('Store not found or access token missing.');

    const { shopify_domain } = store;
    const shopify_access_token = decrypt(store.shopify_access_token);
    const shopify_client_id = store.shopify_client_id ? decrypt(store.shopify_client_id) : null;

    // 2. Query Shopify Admin API for Orders with Pagination
    console.log(`Fetching orders from https://${shopify_domain}.myshopify.com...`);
    let url = `https://${shopify_domain}.myshopify.com/admin/api/2024-01/orders.json?status=any&limit=250`;
    let totalSynced = 0;

    let finalAccessToken = shopify_access_token;
    if (shopify_client_id && shopify_access_token.startsWith('shpss_')) {
      console.log(`Exchanging shpss_ token for temporary Admin API token via OAuth...`);
      const body = new URLSearchParams();
      body.append('grant_type', 'client_credentials');
      body.append('client_id', shopify_client_id);
      body.append('client_secret', shopify_access_token);

      try {
        const exchangeRes = await fetch(`https://${shopify_domain}.myshopify.com/admin/oauth/access_token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString()
        });
        if (exchangeRes.ok) {
          const data = await exchangeRes.json();
          if (data.access_token) {
            finalAccessToken = data.access_token;
            console.log(`Successfully generated temporary token.`);
          }
        } else {
          console.warn(`OAuth token exchange failed (${exchangeRes.status}). Proceeding with original token as fallback.`);
        }
      } catch (err) {
        console.warn('Error during token exchange:', err.message);
      }
    }

    const headers = { 
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': finalAccessToken
    };

    while (url) {
      const shopifyResponse = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!shopifyResponse.ok) {
        throw new Error(`Shopify API Error: ${shopifyResponse.statusText}`);
      }

      const { orders } = await shopifyResponse.json();
      
      if (orders.length === 0) break;

      // 3. Normalize & Insert into Supabase in Batches
      const normalizedOrders = orders.map(order => ({
        store_id: storeId,
        shopify_order_id: order.id.toString(),
        customer_name: order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : 'Guest',
        total_price: order.total_price,
        status: mapShopifyStatus(order),
        created_at: order.created_at,
        tags: order.tags ? order.tags.split(',').map(t => t.trim()) : []
      }));

      const { error: insertError } = await supabase
        .from('orders')
        .upsert(normalizedOrders, { onConflict: 'store_id, shopify_order_id' });
      
      if (insertError) {
        console.error('Failed to insert orders to database:', insertError);
        throw insertError;
      }

      totalSynced += normalizedOrders.length;
      console.log(`Synced ${totalSynced} orders safely for store ${storeId}...`);

      // 4. Get the next page URL from the Link header
      const linkHeader = shopifyResponse.headers.get('Link');
      const nextMatch = linkHeader ? linkHeader.match(/<([^>]+)>;\s*rel="next"/) : null;
      url = nextMatch ? nextMatch[1] : null;
    }

    console.log(`Sync complete. Total orders processed: ${totalSynced}`);

  } catch (error) {
    console.error('Data Sync Failed:', error.message);
  }
}

function mapShopifyStatus(order) {
  // Advanced logic to map Shopify fulfillment/financial status to the SaaS dashboard tags
  if (order.financial_status === 'refunded') return 'Canceled';
  if (order.fulfillment_status === 'fulfilled') return 'Delivered';
  if (order.financial_status === 'paid' && order.fulfillment_status === null) return 'Unfulfilled';
  return 'Pending';
}

module.exports = { syncStoreData };
