const { createClient } = require('bedrock-protocol');
const { microsoftAuth } = require('prismarine-auth');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

async function startBot() {
  try {
    console.log('🔐 Logging in with Microsoft...');
    const { accessToken } = await microsoftAuth(config.username, config.password);

    const client = createClient({
      host: config.host,
      port: config.port,
      username: config.username,
      offline: false,
      authTitle: 'minecraft',
      profilesFolder: './profiles',
      auth: 'microsoft',
      accessToken
    });

    client.on('join', () => {
      console.log('✅ Joined the server');
      setTimeout(() => client.queue('chat', { message: `/register ${config.loginPass} ${config.loginPass}` }), 3000);
      setTimeout(() => client.queue('chat', { message: `/login ${config.loginPass}` }), 5000);
      setTimeout(() => client.queue('chat', { message: '✅ Bot is online! Type !help' }), 7000);
    });

    client.on('text', (packet) => {
      const msg = packet.message.toLowerCase();

      if (msg.includes('!help')) client.queue('chat', { message: 'Commands: !start, !stop, !sleep, !pvp, !armor, !removearmor' });
      if (msg.includes('!start')) client.queue('chat', { message: '⏳ Starting...' });
      if (msg.includes('!stop')) client.queue('chat', { message: '🛑 Stopping...' });
      if (msg.includes('!sleep')) client.queue('chat', { message: '💤 Sleeping...' });
      if (msg.includes('!pvp')) client.queue('chat', { message: '⚔️ PvP mode enabled!' });
      if (msg.includes('!armor')) client.queue('chat', { message: '🛡️ Putting on armor...' });
      if (msg.includes('!removearmor')) client.queue('chat', { message: '❌ Removing armor...' });
    });

  } catch (err) {
    console.error('❌ Error logging in:', err);
  }
}

startBot();
