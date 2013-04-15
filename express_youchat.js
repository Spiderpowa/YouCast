var express = require('express');
var app = express.createServer(), port = 51045;
app.enable('jsonp callback');

var chatroom = require('chatroom');
var youtube = require('youtube');
var login = require('login');
var user = require('user');
var static_loader = require('static_loader');
var jade_loader = require('jade_loader');
global.config = require('./config');

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret: global.config.session_secret}));
    /*
    app.use(function(req, res, next){
        req.lang = req.header('Accept-Language').split(',')[0];
        if(!data[req.lang]){
            req.lang = alllang.default;
        }
        next();
    });
    app.use(app.router);
    app.use(express.static(__dirname + '/static'));
    */
});

var fs = require("fs");
var alllang = JSON.parse(fs.readFileSync('routes/lang.json'));
var data = new Object();
for(i in alllang.item){
    data[alllang.item[i].lang] = JSON.parse(fs.readFileSync('routes/'+alllang.item[i].file));
}
var routes = JSON.parse(fs.readFileSync('routes/router.json'));

var start_router = function(path){
    app.get(path, function(req, res){
        var page = data[req.lang][routes[path].data];
        res.render(routes[path].template, page);
    });
}

for(route in routes){
    start_router(route);
}

/*
app.get('/user/:id', function(req, res){
    console.log('lang ' + req.lang);
    res.send('user:' + req.params.id);
});
*/
app.get('/chatroom/:action/*', chatroom);
app.get('/youtube/:action/*', youtube);
app.get('/login/*', login);
app.get('/user/*', user);
app.get('/views/:page', jade_loader);
app.get('/static/*', static_loader);
app.listen(port);
console.log('start express server');
