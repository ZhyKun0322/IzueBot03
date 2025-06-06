const { microsoftDeviceCode } = require('prismarine-auth');
const { createClient } = require('bedrock-protocol');

async function startBot() {
  console.log('🔐 Waiting for Microsoft login...');

  const flow = await microsoftDeviceCode({
    flow: 'msal' // Important: use 'msal' flow to skip needing Azure client ID
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
}

startBot();
