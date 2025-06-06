const bedrock = require('minecraft-protocol-bedrock');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const client = bedrock.createClient({
  host: config.host,
  port: config.port,
  username: config.username,
  offline: true
});

client.on('connect', () => {
  console.log('✅ Connected to server');
});

client.on('spawn', () => {
  console.log('✅ Spawned in the world');
  // Send register and login commands
  setTimeout(() => client.write('chat', { message: `/register ${config.password} ${config.password}` }), 2000);
  setTimeout(() => client.write('chat', { message: `/login ${config.password}` }), 5000);
  setTimeout(() => client.write('chat', { message: '✅ Bot is online! Type !help' }), 7000);
});

client.on('chat', (packet) => {
  const message = packet.message.toLowerCase();
  if (!message.includes('!')) return;

  if (message.includes('!help')) {
    client.write('chat', { message: 'Commands: !start, !stop, !sleep, !pvp, !armor, !removearmor' });
  }
  if (message.includes('!start')) {
    client.write('chat', { message: '⏳ Starting...' });
  }
  if (message.includes('!stop')) {
    client.write('chat', { message: '🛑 Stopping...' });
  }
  if (message.includes('!sleep')) {
    client.write('chat', { message: '💤 Sleeping...' });
  }
  if (message.includes('!pvp')) {
    client.write('chat', { message: '⚔️ PvP mode enabled!' });
  }
  if (message.includes('!armor')) {
    client.write('chat', { message: '🛡️ Putting on armor...' });
  }
  if (message.includes('!removearmor')) {
    client.write('chat', { message: '❌ Removing armor...' });
  }
});
