module.exports = {
  DOMAIN: 'http://localhost:3000',
  SESSION_SECRET: "sup3rs3cr3tk3y",
  // Control debug level for modules using visionmedia/debug
  DEBUG: '',
  STORMPATH_API_KEY_ID: process.env.HOME + '/.stormpath/apiKey.id',
  STORMPATH_API_KEY_SECRET: process.env.HOME + '/.stormpath/apiKey.secret',
  STORMPATH_APP_HREF: process.env.HOME + '/.stormpath/apiKey.href'
};