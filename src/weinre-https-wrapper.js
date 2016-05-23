var fs = require('fs');
var httpProxy = require('http-proxy');
var weinre = require('weinre');
var Config = require('../config.js');

var weinreOptions = {
	httpPort: 29189,
	boundHost: 'localhost',
	verbose: false,
	debug: false,
	readTimeout: 30,
	deathTimeout: 30
};
weinre.run(weinreOptions);

var options = {
	target: {
		https: true
	}
};
var proxy = httpProxy.createServer({
	target: {
		host: 'localhost',
		port: 29189
	},
	ssl: {
		key: fs.readFileSync(Config.sslKey, 'utf8'),
		cert: fs.readFileSync(Config.sslCert, 'utf8')
	}
}).listen(Config.port);

proxy.on('error', function(error) {
	if (error.code !== 'ECONNRESET') {
		throw error;
	}
	//Swallow socket hang up messages
});