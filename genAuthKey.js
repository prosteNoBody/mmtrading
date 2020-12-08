const SteamTotp = require('steam-totp');
const SECRET = require('./server/keys.json').bot_shared_secret;

console.log(SteamTotp.generateAuthCode(SECRET, 1));