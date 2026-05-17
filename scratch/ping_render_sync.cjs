async function run() {
  const storeId = '4bbf3573-ff43-4ef4-946d-33766586693d';
  const url = `https://pocket-dashboard-mwjn.onrender.com/api/sync/${storeId}`;
  console.log('Pinging Render sync endpoint:', url);
  try {
    const res = await fetch(url, { method: 'POST' });
    const text = await res.text();
    console.log(`Response (${res.status}):`, text);
  } catch (e) {
    console.error('Fetch error:', e);
  }
}
run();
