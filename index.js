require('dotenv').config();
const { microsoft } = require('prismarine-auth');
const { createClient } = require('bedrock-protocol');

async function startBot() {
  try {
    console.log('🔐 Logging in with Microsoft...');
    
    // Step 1: Authenticate with Microsoft & Minecraft
    const flow = await microsoft({
      username: process.env.MC_EMAIL,
      password: process.env.MC_PASSWORD
    });
    console.log('✅ Logged in as:', flow.user.username);
    
    // Step 2: Connect to the Minecraft Bedrock server using the token
    const client = createClient({
      host: 'KingdomOfYggdrasil.aternos.me',  // replace with your server IP
      port: 52364,             // default Bedrock port
      username: flow.user.username,
      auth: flow.getAuth()
    });
    
    client.on('connect', () => {
      console.log('✅ Connected to server');
    });
    
    client.on('spawn', () => {
      console.log('✅ Spawned in game');
    });
    
    client.on('text', packet => {
      console.log('[Server]', packet.message);
    });
    
    client.on('error', (err) => {
      console.error('❌ Client error:', err);
    });
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

startBot();
