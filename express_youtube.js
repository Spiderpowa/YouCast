var express = require('express');
var app = express.createServer(), port = 51045;

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'papapa'}));
app.listen(port);

app.get('/', function(req, res){
        res.send('hello world');
});
app.get('/user/:id', function(req, res){
        res.send('user:' + req.params.id);
});

app.post('/youtube/:action/*', require('youtube'));
app.post('/login/*', require('login'));
app.get('/static/*', require('static_loader'));
console.log('start express server');
