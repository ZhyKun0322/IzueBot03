require('dotenv').config();
const { AuthFlow } = require('prismarine-auth');

async function testLogin() {
  try {
    console.log('🔐 Logging in with Microsoft...');
    const flow = new AuthFlow('microsoft', {
      username: process.env.MC_EMAIL,
      password: process.env.MC_PASSWORD
    });

    await flow.authenticate();

    console.log('✅ Logged in as:', flow.profile.name);
  } catch (err) {
    console.error('❌ Login failed:', err);
  }
}

testLogin();
