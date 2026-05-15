const express = require('express');
const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config();

const app = express();
// Shopify Webhooks are sent as raw JSON, often needing HMAC verification via raw-body.
app.use(express.json());

// Use Service Role Key on the server — bypasses RLS safely, never expose to frontend
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Endpoint to receive real-time updates from Shopify.
 * In a real SaaS setup, you configure this URL in the User's Shopify Admin Webhook settings.
 */
app.post('/webhooks/shopify/orders/create', async (req, res) => {
  try {
    const shopifyDomain = req.headers['x-shopify-shop-domain'];
    const orderData = req.body;

    console.log(`[Webhook] Real-time order received from ${shopifyDomain} - Order ID: ${orderData.id}`);

    // 1. Identify the Store
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('shopify_domain', shopifyDomain.replace('.myshopify.com', ''))
      .single();

    if (storeError || !store) {
      console.warn(`[Webhook] Ignoring payload, store ${shopifyDomain} not found attached to SaaS.`);
      return res.status(200).send('Ignored'); // Still return 200 so Shopify doesn't retry infinitely
    }

    // 2. Map and Insert Order in Real-Time
    const normalizedOrder = {
      store_id: store.id,
      shopify_order_id: orderData.id.toString(),
      customer_name: orderData.customer ? `${orderData.customer.first_name} ${orderData.customer.last_name}` : 'Guest',
      total_price: orderData.total_price,
      status: mapShopifyWebhookStatus(orderData),
      created_at: orderData.created_at,
      tags: orderData.tags ? orderData.tags.split(',').map(t => t.trim()) : []
    };

    const { error: insertError } = await supabase
      .from('orders')
      .upsert(normalizedOrder, { onConflict: 'store_id, shopify_order_id' });

    if (insertError) {
      console.error('[Webhook] Failed to insert real-time order:', insertError);
      return res.status(500).send('Database Error');
    }

    console.log(`[Webhook] ✨ Order ${orderData.id} synced magically into SaaS in real-time.`);
    res.status(200).send('Webhook Processed Successfully');

  } catch (error) {
    console.error('[Webhook] Core Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

function mapShopifyWebhookStatus(order) {
  if (order.financial_status === 'refunded') return 'Canceled';
  if (order.fulfillment_status === 'fulfilled') return 'Delivered';
  if (order.financial_status === 'paid' && order.fulfillment_status === null) return 'Unfulfilled';
  return 'Pending';
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Real-Time Shopify Webhook Receiver Running on Port ${PORT}`);
});
