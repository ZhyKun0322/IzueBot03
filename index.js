require('dotenv').config();
const { Authflow } = require('prismarine-auth');
const { createClient } = require('bedrock-protocol');

async function startBot() {
  try {
    console.log('🔐 Waiting for Microsoft login...');

    // This will start the device code login flow
    const authflow = new Authflow('BotName', './auth_files', {
      flow: 'msal' // This tells it to use the Microsoft device code flow
    });

    const bedrockAuth = await authflow.getXboxToken(); // fetches auth tokens

    const client = createClient({
      host: 'KingdomOfYggdrasil.aternos.me', // your server
      port: 52364,
      username: bedrockAuth.profile.name,
      authTitle: bedrockAuth.authTitle,
      authChain: bedrockAuth.chain
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
