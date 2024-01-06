let CORS_PROXY = require('cors-anywhere');
CORS_PROXY.createServer({
	originWhitelist: [],
	removeHeaders: ['cookie', 'cookie2']
}).listen();