'use strict';
/**
 * Created by steve on 6/28/16.
 */
const
    port = 8081;

// Load required modules
var
    http = require('http'),
    express = require('express'),           // web framework external module
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    config = {
        port: port,
        form: ''
    },
    form = require('express-form'),
    field = form.field,
    sass = require('node-sass-middleware'), // We're adding the node-sass module
    colors = require('colors');

//add timestamps in front of log messages
require('console-stamp')(console, 'HH:MM:ss.l');

// Read config.json which is filled by information from https://www.google.com/recaptcha/admin#site/321174532?setup
try {
    config = JSON.parse(fs.readFileSync('config.json'));
} catch (e) {
    console.error(e);
}
// console.log(config);

app.set('views', __dirname + '/view/')
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/site/'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
// adding the sass middleware
app.use(
    sass({
        src: __dirname + '/sass',
        dest: __dirname + '/site/css',
        prefix: '/css',
        response: true,
        outputStyle: 'extended',
        debug: false
    })
);

app.get('/', function(req, res) {
    res.render('index', {
        pageTitle: 'D3 and jQuery charts demo'
    });
});

app.get('/list', function(req, res) {
    res.render('list', {
        pageTitle: 'D3 single listener'
    });
});

app.get('/debate', function(req, res) {
    res.render('debate', {
        pageTitle: '1World debate testing'
    });
});

app.get('/popup', function(req, res) {
    // console.log(req.body);
    res.render('popup', {
        secretKey: config.secretKey,
        recaptcha: config.recaptcha,
        apiScript: config.script
    });
});

app.post('/popup', form(
    field('email').trim().isEmail()
), function(req, res) {
    console.info(colors.yellow(req.form));
    var email = '', status = 200;
    if (!req.form.isValid) {
        email = req.form.email;
        console.log('Email: ' + req.form.email);
    } else {
        status = 400;
    }
    // console.log(req.body);
    res.status(status).send({status: status === 200, email: email});
});

config.port = config.port || port;
console.info(colors.green('Starting the server using the port ' + config.port));
// Start Express http server
http.createServer(app).listen(config.port);
