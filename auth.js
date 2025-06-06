const Authflow = require('prismarine-auth').Authflow;
const fs = require('fs');

const username = process.env.MC_EMAIL; // Get from env for safety

const authflow = new Authflow(username, './auth_store', {
  flow: 'msal',
  clientId: '00000000402b5328',
  deviceType: 'Android'
});

async function login() {
  try {
    await authflow.login({
      offline: false,
      onMsaDeviceCode: (data) => {
        console.log('Go to:', data.verificationUri);
        console.log('Enter code:', data.userCode);
        console.log('Expires in:', data.expiresIn, 'seconds');
      }
    });
    console.log('✅ Logged in!');
    fs.writeFileSync('tokens.json', JSON.stringify(authflow.authInfo, null, 2));
  } catch (e) {
    console.error('Login error:', e);
  }
}

login();
