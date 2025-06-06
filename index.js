const bedrock = require('bedrock-protocol');
const { Authflow } = require('prismarine-auth');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

(async () => {
  let xblAuth;

  if (config.authMode === 'microsoft') {
    console.log('🔐 Logging in with Microsoft...');
    const flow = new Authflow(config.username, './auth_store', {
      flow: 'msal',
      authTitle: '00000000402b5328',
      deviceType: 'Android'
    });

    xblAuth = await flow.getXboxToken();
  }

  const client = bedrock.createClient({
    host: config.host,
    port: config.port,
    username: config.username,
    profilesFolder: './auth_store',
    offline: config.authMode !== 'microsoft',
    xuid: xblAuth?.userXuid,
    authTitle: 'Minecraft',
    authToken: xblAuth?.token
  });

  client.on('join', () => {
    console.log('✅ Connected to server');
  });

  client.on('spawn', () => {
    console.log('✅ Spawned in the world');

    // 🔐 Handle server login security (SimpleAuth, etc)
    if (config.autoRegister) {
      setTimeout(() => sendChat(`/register ${config.loginPassword} ${config.loginPassword}`), 2000);
    } else {
      setTimeout(() => sendChat(`/login ${config.loginPassword}`), 2000);
    }

    setTimeout(() => sendChat('✅ Bot is online! Type !help'), 4000);
  });

  client.on('text', (packet) => {
    const msg = packet.message.toLowerCase();
    if (!msg.includes('!')) return;

    if (msg.includes('!help')) sendChat('Commands: !start, !stop, !sleep, !pvp, !armor, !removearmor');
    if (msg.includes('!start')) sendChat('⏳ Starting...');
    if (msg.includes('!stop')) sendChat('🛑 Stopping...');
    if (msg.includes('!sleep')) sendChat('💤 Sleeping...');
    if (msg.includes('!pvp')) sendChat('⚔️ PvP mode enabled!');
    if (msg.includes('!armor')) sendChat('🛡️ Putting on armor...');
    if (msg.includes('!removearmor')) sendChat('❌ Removing armor...');
  });

  function sendChat(message) {
    client.queue('text', {
      type: 'chat',
      needs_translation: false,
      source_name: config.username,
      message: message,
      xuid: '',
      platform_chat_id: ''
    });
  }
})();
