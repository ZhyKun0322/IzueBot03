require('dotenv').config();
const prismarineAuth = require('prismarine-auth');

async function testLogin() {
  try {
    console.log('🔐 Logging in with Microsoft...');
    // Create a Microsoft auth flow with your credentials:
    const flow = prismarineAuth('microsoft', {
      username: process.env.MC_EMAIL,
      password: process.env.MC_PASSWORD
    });

    // Perform authentication (fetch tokens)
    await flow.authenticate();

    console.log('✅ Logged in as:', flow.profile.name);
  } catch (err) {
    console.error('❌ Login failed:', err);
  }
}

testLogin();
