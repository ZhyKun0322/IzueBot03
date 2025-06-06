const { authenticate } = require('prismarine-auth');
const bedrock = require('bedrock-protocol');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

async function startBot() {
  console.log('🔐 Logging in with Microsoft...');
  
  const auth = await authenticate(
    {
      flow: 'msal', // Use device code login (suitable for Termux/phones)
      authTitle: '00000000402b5328', // Minecraft client ID
      deviceType: 'Android'
    },
    (data) => {
      // This function shows the login URL and user code in console
      console.log(`[Login] Visit: ${data.verification_uri}`);
      console.log(`[Login] Enter Code: ${data.user_code}`);
    }
  );

  const client = bedrock.createClient({
    host: config.host,
    port: config.port,
    username: auth.profile.name,
    authTitle: '00000000402b5328',
    deviceType: 'Android',
    profilesFolder: './auth', // saves token for re-use
    offline: false,
    skinData: auth.profile.skinData
  });

  client.on('connect', () => {
    console.log('✅ Connected to server');
  });

  client.on('spawn', () => {
    console.log('✅ Spawned in the world');
    // Auto register/login
    setTimeout(() => client.queue('text', { message: `/register ${config.password} ${config.password}`, needsTranslation: false }), 2000);
    setTimeout(() => client.queue('text', { message: `/login ${config.password}`, needsTranslation: false }), 5000);
    setTimeout(() => client.queue('text', { message: '✅ Bot is online! Type !help' }), 7000);
  });

  client.on('text', (packet) => {
    const msg = packet.message.toLowerCase();
    if (!msg.includes('!')) return;

    if (msg.includes('!help')) {
      client.queue('text', { message: 'Commands: !start, !stop, !sleep, !pvp, !armor, !removearmor', needsTranslation: false });
    }
    if (msg.includes('!start')) {
      client.queue('text', { message: '⏳ Starting...', needsTranslation: false });
    }
    if (msg.includes('!stop')) {
      client.queue('text', { message: '🛑 Stopping...', needsTranslation: false });
    }
    if (msg.includes('!sleep')) {
      client.queue('text', { message: '💤 Sleeping...', needsTranslation: false });
    }
    if (msg.includes('!pvp')) {
      client.queue('text', { message: '⚔️ PvP mode enabled!', needsTranslation: false });
    }
    if (msg.includes('!armor')) {
      client.queue('text', { message: '🛡️ Putting on armor...', needsTranslation: false });
    }
    if (msg.includes('!removearmor')) {
      client.queue('text', { message: '❌ Removing armor...', needsTranslation: false });
    }
  });

  client.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', reason);
  });
}

startBot().catch(console.error);
