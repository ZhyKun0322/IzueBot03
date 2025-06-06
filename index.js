require('dotenv').config();
const prismarineAuth = require('prismarine-auth');
const { createClient } = require('bedrock-protocol');

async function startBot() {
  try {
    console.log('🔐 Waiting for Microsoft login...');

    const auth = await prismarineAuth.microsoftDeviceCode({
      flow: 'msal',
      deviceType: 'terminal',
      authTitle: 'Bedrock Bot',
      authDescription: 'Login to Minecraft'
    });

    console.log('✅ Logged in as:', auth.user.username);

    const client = createClient({
      host: 'KingdomOfYggdrasil.aternos.me',
      port: 52364,
      username: auth.user.username,
      auth: auth.getAuth()
    });

    client.on('connect', () => console.log('✅ Connected to server'));
    client.on('spawn', () => console.log('✅ Spawned in game'));
    client.on('text', (packet) => console.log('[Server]', packet.message));
    client.on('error', (err) => console.error('❌ Client error:', err));

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

startBot();
