var MaxMsg = 100;
function ChatRoom(){
    var self = this;
    var callbacks = [];
    var messages = [];

    this.postMsg = function(nick, type, msg){
        var m = {
            nick: nick,
            type: type,
            msg: msg,
            timestamp: (new Date()).getTime()
        };
        messages.push(m);

        while(callbacks.length > 0){
            callbacks.shift().callback([m]);
        }

        while(messages.length > MaxMsg){
            messages.shift();
        }
    };

    this.readMsg = function(since, callback){
        var msgs = [];
        for(var i=0; i < messages.length; ++i){
            if(messages[i].timestamp > since)
                msgs.push(messages[i]);
        }

        if(msgs.length != 0){
            callback(msgs);
        }else{
            callbacks.push({timestamp:new Date(), callback: callback});
        }
    }
    //Clean old callback (idle time 30 sec)
    setInterval(function(){
        var now = new Date();
        while(callbacks.length > 0 && now - callbacks[0].timestamp > 30*1000){
            callbacks.shift().callback([]);
        }
    }, 3000);
}
var express = require('express');
var app = express.createServer(), port = 51045;
var fs = require('fs');
var qs = require('querystring');

var room = new ChatRoom();

app.use(express.bodyParser());
app.listen(port);

app.get('/', function(req, res){
        res.send('hello world');
});
app.get('/user/:id', function(req, res){
        res.send('user:' + req.params.id);
});
app.post('/chatroom/post/:nick', function(req, res){
    var msg = req.body.msg + '...MOO';
    room.postMsg(req.params.nick, "msg", msg);
    res.json({});
});
app.post('/chatroom/view/', function(req, res){
    if(!req.body.since){
        res.json({error: 'No since value'});
        return;
    }
    var since = parseInt(req.body.since, 10);
    room.readMsg(since, function(msgs){
        res.json({message: msgs});
    });
});
app.get('/static/*', function (req,res){
    filePath = 'static/' + req.params;
    fs.readFile(filePath, 'utf8', function(err, file){
        if(err){
            res.send('404 Not Found', 404);
            return;
        }
        res.contentType(filePath);
        res.send(file);
    });
});
console.log('start express server');
