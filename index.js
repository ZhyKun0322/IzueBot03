const { AuthFlow } = require('prismarine-auth');
const { createClient } = require('bedrock-protocol');

async function startBot() {
  try {
    console.log('🔐 Waiting for Microsoft login...');

    const flow = new AuthFlow('microsoft', {
      flow: 'msal',
      deviceType: 'terminal',
      authTitle: 'Bedrock Bot',
      authDescription: 'Login to Minecraft'
    });

    await flow.login(); // opens a link with a code to paste in the browser

    console.log('✅ Logged in as:', flow.profile.name);

    const client = createClient({
      host: 'KingdomOfYggdrasil.aternos.me',
      port: 52364,
      username: flow.profile.name,
      auth: flow.getAuth()
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
