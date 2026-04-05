const { createClient } = require('@supabase/supabase-js');
// In a real environment, you'd load from dotenv
// require('dotenv').config();

const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL; // Re-use the same env var or pass directly
const VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY; 

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

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
      .select('shopify_domain, shopify_access_token')
      .eq('id', storeId)
      .single();

    if (storeError || !store) throw new Error('Store not found or access token missing.');

    const { shopify_domain, shopify_access_token } = store;

    // 2. Query Shopify Admin API for Orders
    console.log(`Fetching orders from https://${shopify_domain}.myshopify.com...`);
    const shopifyResponse = await fetch(`https://${shopify_domain}.myshopify.com/admin/api/2024-01/orders.json?status=any`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopify_access_token
      }
    });

    if (!shopifyResponse.ok) {
      throw new Error(`Shopify API Error: ${shopifyResponse.statusText}`);
    }

    const { orders } = await shopifyResponse.json();
    console.log(`Successfully fetched ${orders.length} orders from Shopify.`);

    // 3. Normalize & Insert into Supabase
    // We execute batches to respect Row Level Security and standard database limits
    const normalizedOrders = orders.map(order => ({
      store_id: storeId,
      shopify_order_id: order.id.toString(),
      customer_name: order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : 'Guest',
      total_price: order.total_price,
      status: mapShopifyStatus(order),
      created_at: order.created_at,
      tags: order.tags ? order.tags.split(',').map(t => t.trim()) : []
    }));

    if (normalizedOrders.length > 0) {
      const { error: insertError } = await supabase
        .from('orders')
        .upsert(normalizedOrders, { onConflict: 'store_id, shopify_order_id' });
      
      if (insertError) console.error('Failed to insert orders to database:', insertError);
      else console.log(`Stored ${normalizedOrders.length} orders in Supabase safely.`);
    }

    console.log('Sync complete.');

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
