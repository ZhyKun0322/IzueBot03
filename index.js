const bedrock = require('bedrock-protocol');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const PASSWORD = "YourSecurePassword"; // for /register and /login

const client = bedrock.createClient({
  host: config.host,
  port: config.port,
  username: config.username,
  offline: true // must be true for cracked servers
});

let loggedIn = false;

client.on('join', () => {
  console.log('✅ Bot joined the server!');

  setTimeout(() => {
    client.queue('text', {
      type: 'chat',
      needs_translation: false,
      source_name: config.username,
      xuid: '',
      platform_chat_id: '',
      message: `/register ${PASSWORD} ${PASSWORD}`
    });
  }, 1000);

  setTimeout(() => {
    client.queue('text', {
      type: 'chat',
      needs_translation: false,
      source_name: config.username,
      xuid: '',
      platform_chat_id: '',
      message: `/login ${PASSWORD}`
    });
  }, 3000);
});

client.on('text', (packet) => {
  const msg = packet.message.toLowerCase();

  if (msg.includes('successfully logged in') || msg.includes('welcome')) {
    loggedIn = true;
    console.log('✅ Auto-login success!');
    client.queue('text', {
      type: 'chat',
      needs_translation: false,
      source_name: config.username,
      xuid: '',
      platform_chat_id: '',
      message: '🤖 Bot is online! Type !help for commands.'
    });
  }

  // Handle chat commands after login
  if (!loggedIn || packet.source_name === config.username) return;

  switch (msg) {
    case '!help':
      sendChat("Commands: !ping, !sleep (demo)");
      break;
    case '!ping':
      sendChat("🏓 Pong!");
      break;
    case '!sleep':
      sendChat("💤 Sleeping... (not implemented)");
      break;
  }
});

function sendChat(text) {
  client.queue('text', {
    type: 'chat',
    needs_translation: false,
    source_name: config.username,
    xuid: '',
    platform_chat_id: '',
    message: text
  });
}
