require('dotenv').config();
const { microsoftDeviceCode } = require('prismarine-auth');
const { createClient } = require('bedrock-protocol');

async function startBot() {
  try {
    console.log('🔐 Waiting for Microsoft login...');

    const flow = await microsoftDeviceCode({
      flow: 'msal', // Use MSAL device code login
    });

    console.log('✅ Logged in as:', flow.user?.username || 'Unknown');

    const client = createClient({
      host: 'KingdomOfYggdrasil.aternos.me',
      port: 52364,
      username: flow.user.username,
      auth: flow.getAuth(),
    });

    client.on('connect', () => console.log('✅ Connected to server'));
    client.on('spawn', () => console.log('✅ Spawned in game'));
    client.on('text', packet => console.log('[Chat]', packet.message));
    client.on('error', err => console.error('❌ Client error:', err));

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

startBot();
