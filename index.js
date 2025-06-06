require('dotenv').config();
const { createClient } = require('bedrock-protocol');
const prismarineAuth = require('prismarine-auth');

async function startBot() {
  try {
    console.log('🔐 Logging in with Microsoft...');

    // Create an auth flow instance:
    const flow = new prismarineAuth.MicrosoftAuth({
      username: process.env.MC_EMAIL,
      password: process.env.MC_PASSWORD,
    });

    await flow.login();

    console.log('✅ Logged in as:', flow.getUsername());

    const client = createClient({
      host: 'your.server.ip',
      port: 19132,
      username: flow.getUsername(),
      auth: flow.getAuth(),
    });

    client.on('connect', () => console.log('✅ Connected to server'));
    client.on('spawn', () => console.log('✅ Spawned in game'));
    client.on('text', packet => console.log('[Server]', packet.message));

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

startBot();
