require('dotenv').config();
const { createClient } = require('bedrock-protocol');
const prismarineAuth = require('prismarine-auth');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

async function startBot() {
  console.log('🔐 Logging in with Microsoft...');
  try {
    const flow = await prismarineAuth.microsoft({
      username: process.env.MC_EMAIL,
      password: process.env.MC_PASSWORD
    });

    const client = createClient({
      host: config.host,
      port: config.port,
      username: flow.user.username,
      auth: flow.getAuth(),
      profilesFolder: './',
      skipPing: true,
      connectTimeout: 10000,
      deviceType: 'Android',
      authTitle: 'Minecraft',
      onMsaCode: (data) => {
        console.log(`🔑 Visit ${data.verification_uri} and enter code ${data.user_code}`);
      }
    });

    client.on('connect', () => {
      console.log('✅ Connected to server');
    });

    client.on('spawn', () => {
      console.log('✅ Spawned in the world');
      // Auto register/login commands - adjust timing if needed
      setTimeout(() => client.queue('text', { message: `/register ${config.password} ${config.password}` }), 2000);
      setTimeout(() => client.queue('text', { message: `/login ${config.password}` }), 5000);
      setTimeout(() => client.queue('text', { message: '✅ Bot is online! Type !help' }), 7000);
    });

    client.on('text', (packet) => {
      const message = packet.message.toLowerCase();
      if (!message.includes('!')) return;

      if (message.includes('!help')) {
        client.queue('text', { message: 'Commands: !start, !stop, !sleep, !pvp, !armor, !removearmor' });
      }
      if (message.includes('!start')) {
        client.queue('text', { message: '⏳ Starting...' });
      }
      if (message.includes('!stop')) {
        client.queue('text', { message: '🛑 Stopping...' });
      }
      if (message.includes('!sleep')) {
        client.queue('text', { message: '💤 Sleeping...' });
      }
      if (message.includes('!pvp')) {
        client.queue('text', { message: '⚔️ PvP mode enabled!' });
      }
      if (message.includes('!armor')) {
        client.queue('text', { message: '🛡️ Putting on armor...' });
      }
      if (message.includes('!removearmor')) {
        client.queue('text', { message: '❌ Removing armor...' });
      }
    });

  } catch (err) {
    console.error('❌ Error logging in:', err);
  }
}

startBot();
