const Bot = require('mcbe-bot');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const bot = new Bot(config);

let pvpMode = false;
let botActive = false;
let loggedIn = false;

// Set your password here (for auto-register/login)
const PASSWORD = "YourSecurePassword";

bot.on('spawn', () => {
  console.log('✅ Bot joined the server');
  bot.chat('🤖 Hello! Starting auto login/register...');

  // Auto-register and login sequence - adjust commands to your server plugin
  setTimeout(() => {
    // Usually registration commands look like this, change if yours differ:
    bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
  }, 1000);

  setTimeout(() => {
    bot.chat(`/login ${PASSWORD}`);
  }, 4000);
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  const msg = message.toLowerCase();

  // Detect login success message — change this according to your server's messages!
  if (msg.includes('logged in') || msg.includes('login successful')) {
    loggedIn = true;
    bot.chat('Login successful! Ready for commands.');
    return;
  }

  if (!loggedIn) return; // ignore commands until logged in

  switch (msg) {
    case '!help':
      bot.chat('Commands: !start, !stop, !pvp, !pvpstop, !armor, !removearmor, !sleep');
      break;

    case '!start':
      botActive = true;
      bot.chat('✅ Bot activated.');
      break;

    case '!stop':
      botActive = false;
      pvpMode = false;
      bot.chat('🛑 Bot deactivated.');
      break;

    case '!pvp':
      if (!botActive) {
        bot.chat('❗ Use !start first.');
        break;
      }
      pvpMode = true;
      bot.chat('⚔️ PvP mode ON.');
      attackLoop();
      break;

    case '!pvpstop':
      pvpMode = false;
      bot.chat('✋ PvP mode OFF.');
      break;

    case '!armor':
      bot.chat('🛡️ Equipping armor... (simulated)');
      break;

    case '!removearmor':
      bot.chat('❌ Removing armor... (simulated)');
      break;

    case '!sleep':
      bot.chat('💤 Sleeping... (placeholder)');
      break;

    default:
      break;
  }
});

function attackLoop() {
  if (!pvpMode || !botActive) return;

  const target = bot.nearestEntity(
    (entity) => entity.type === 'player' && entity.username !== bot.username
  );

  if (target) {
    bot.attack(target);
    console.log(`⚔️ Attacking ${target.username}`);
  }

  setTimeout(attackLoop, 2000);
}
