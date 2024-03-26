import { createServer } from 'http';

globalThis.catServerFactory = (handle) => {
    let port = 0;
    const server = createServer((req, res) => {
        handle(req, res);
    });
    server.on('listening', () => {
        port = server.address().port;
        console.log('Run on ' + port);
    });
    server.on('close', () => {
        console.log('Close on ' + port);
    });
    return server;
};

globalThis.catDartServerPort = () => {
    return 0;
};

import { start } from './index.js';

import * as config from './index.config.js';

start(config.default);
