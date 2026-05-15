import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config();
const { syncStoreData } = require('./server/syncService.js');
const storeId = '3b79f709-28c2-42f6-b33a-8ca235f2c051';
syncStoreData(storeId).then(() => console.log('Done test sync')).catch(console.error);
