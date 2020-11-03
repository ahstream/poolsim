
require('console-stamp')(console, '[HH:MM:ss.l]');

const fs = require('fs');

exports.debug = (message, ...args) => console.log(message, ...args);
exports.error = (message, ...args) => console.error(`ERROR: ${message}`, ...args);

exports.debugToFile = (data, filepath = 'debug.txt') => fs.writeFileSync(filepath, data, 'utf8');
