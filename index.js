require('dotenv').config();
const { microsoft } = require('prismarine-auth');
const { createClient } = require('bedrock-protocol');

async function startBot() {
  try {
    console.log('🔐 Logging in with Microsoft...');
    const flow = await microsoft({
      username: process.env.MC_EMAIL,
      password: process.env.MC_PASSWORD
    });

    console.log('✅ Logged in as:', flow.user.username);

    const client = createClient({
      host: 'your.server.ip',
      port: 19132,
      username: flow.user.username,
      auth: flow.getAuth()
    });

    client.on('connect', () => console.log('✅ Connected to server'));
    client.on('spawn', () => console.log('✅ Spawned in game'));
    client.on('text', packet => console.log('[Server]', packet.message));
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

startBot();
