'use strict';
/**
 * Created by steve on 6/28/16.
 */
// Load required modules
const
    http = require('http'),
    port = 8081,
    express = require('express'),           // web framework external module
    httpApp = express(),
    colors = require('colors');

//add timestamps in front of log messages
require('console-stamp')(console, 'HH:MM:ss.l');

httpApp.use(express.static(__dirname + '/site/'));

console.info(colors.green('Starting the server using the port ' + port));
// Start Express http server
http.createServer(httpApp).listen(port);
