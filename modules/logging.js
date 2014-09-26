var colors = require('colors');

colors.setTheme({
	error: 'red',
	info: 'grey',
	init: 'cyan',
	initinfo: 'yellow'
});

function logDate() {
	return new Date().toISOString();
}

exports.write = function (message, level, req) {
	var msg = '';
	if (req && req.connection && req.connection.remoteAddress) {
		msg = 'fusorsoft.com: ' + logDate() + ' (' + req.connection.remoteAddress + '): ' + message;
	} else {
		msg = 'fusorsoft.com: ' + logDate() + ': ' + message;
	}

	console.log(msg[level]);
};