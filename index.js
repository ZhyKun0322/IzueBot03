require('dotenv').config();
const { MicrosoftAuthFlow } = require('prismarine-auth');
const { createClient } = require('bedrock-protocol');

async function startBot() {
  try {
    console.log('🔐 Waiting for Microsoft login...');

    const flow = new MicrosoftAuthFlow({
      flow: 'msal',
    });

    const auth = await flow.getAuth();

    console.log('✅ Logged in as:', auth.user?.username || 'unknown');

    const client = createClient({
      host: 'your.server.ip',
      port: 19132,
      username: auth.user.username,
      auth
    });

    client.on('connect', () => console.log('✅ Connected to server'));
    client.on('spawn', () => console.log('✅ Spawned in game'));
    client.on('text', packet => console.log('[Server]', packet.message));
    client.on('error', err => console.error('❌ Client error:', err));

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

startBot();
