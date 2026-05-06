const express = require('express');
const cors = require('cors');
const { syncStoreData } = require('./syncService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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
    console.log(`PocketDashboard Sync Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
