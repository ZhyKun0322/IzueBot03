require('dotenv').config();
const { createClient } = require('bedrock-protocol');
const { microsoft } = require('prismarine-auth');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

async function startBot() {
  console.log('🔐 Logging in with Microsoft...');
  try {
    const flow = await microsoft({
      username: process.env.MC_EMAIL,
      password: process.env.MC_PASSWORD
    });

    const client = createClient({
      host: config.host,
      port: config.port,
      username: flow.user.username,
      auth: flow.getAuth(),
      deviceType: 'Android',  // or your device type
    });

    client.on('connect', () => {
      console.log('✅ Connected to server');
    });

    client.on('spawn', () => {
      console.log('✅ Spawned in the world');
      setTimeout(() => client.queue('chat', { message: `/register ${config.password} ${config.password}` }), 2000);
      setTimeout(() => client.queue('chat', { message: `/login ${config.password}` }), 5000);
      setTimeout(() => client.queue('chat', { message: '✅ Bot is online! Type !help' }), 7000);
    });

    client.on('chat', (packet) => {
      const message = packet.message.toLowerCase();
      if (!message.includes('!')) return;

      if (message.includes('!help')) {
        client.queue('chat', { message: 'Commands: !start, !stop, !sleep, !pvp, !armor, !removearmor' });
      }
      if (message.includes('!start')) {
        client.queue('chat', { message: '⏳ Starting...' });
      }
      if (message.includes('!stop')) {
        client.queue('chat', { message: '🛑 Stopping...' });
      }
      if (message.includes('!sleep')) {
        client.queue('chat', { message: '💤 Sleeping...' });
      }
      if (message.includes('!pvp')) {
        client.queue('chat', { message: '⚔️ PvP mode enabled!' });
      }
      if (message.includes('!armor')) {
        client.queue('chat', { message: '🛡️ Putting on armor...' });
      }
      if (message.includes('!removearmor')) {
        client.queue('chat', { message: '❌ Removing armor...' });
      }
    });

  } catch (err) {
    console.error('❌ Error logging in:', err);
  }
}

startBot();
