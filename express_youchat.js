var port = 51045;

var express = require('express');
var app = express();
app.enable('jsonp callback');

var chatroom = require('chatroom');
var youtube = require('youtube');
var login = require('login');
var user = require('user');
var sync = require('sync');
global.config = require('./config');

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret: global.config.session_secret}));
});

app.get('/chatroom/:action/*', chatroom);
app.get('/youtube/:action/*', youtube);
app.get('/login/*', login);
app.get('/user/*', user);
app.get('/sync/', sync);
app.listen(port);
console.log('start express server');
