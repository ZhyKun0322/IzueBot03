require('dotenv').config();
const { createClient } = require('bedrock-protocol');
const { AuthFlow } = require('prismarine-auth');  // <-- import AuthFlow class
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

async function startBot() {
  console.log('🔐 Logging in with Microsoft...');

  try {
    // Create AuthFlow instance for Microsoft login
    const flow = new AuthFlow('microsoft', {
      username: process.env.MC_EMAIL,
      password: process.env.MC_PASSWORD
    });

    // Perform authentication
    await flow.authenticate();

    const client = createClient({
      host: config.host,
      port: config.port,
      username: flow.profile.name, // your Minecraft username
      auth: flow.getAuth(),
      deviceType: 'Android',
      profilesFolder: './',
      skipPing: true,
      connectTimeout: 10000,
      authTitle: 'Minecraft'
    });

    client.on('connect', () => {
      console.log('✅ Connected to server');
    });

    client.on('spawn', () => {
      console.log('✅ Spawned in the world');
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
