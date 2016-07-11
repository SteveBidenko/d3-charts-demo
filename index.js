'use strict';
/**
 * Created by steve on 6/28/16.
 */
// Load required modules
const
    port = 8081;

var
    http = require('http'),
    express = require('express'),           // web framework external module
    httpApp = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    colors = require('colors');

//add timestamps in front of log messages
require('console-stamp')(console, 'HH:MM:ss.l');

httpApp.use(express.static(__dirname + '/site/'));
httpApp.use(bodyParser.json()); // for parsing application/json
httpApp.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
httpApp.post('/promotionalpopup/index/view', function(req, res, next) {
    var template = fs.readFileSync('site/view/popup.html');
    // console.log(req.body);
    res.status(200).send(template);
    next();
});

console.info(colors.green('Starting the server using the port ' + port));
// Start Express http server
http.createServer(httpApp).listen(port);
