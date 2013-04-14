var ytplayer;
var ishost = false;
function onYouTubePlayerReady(playerId){
    ytplayer = document.getElementById('myytplayer');
    ytplayer.setPlaybackQuality('hd720');
//    ytplayer.playVideo();
    if(!ishost){
        $('#playlist').css('display', 'block');
        yt_polling();
    }else{
        host_yt_ready(ytplayer);
    }
}

function play(vid){
    console.log(ytplayer.getPlaybackQuality());
    ytplayer.loadVideoById(vid, 0, 'hd720');
    var url = 'http://gdata.youtube.com/feeds/api/videos/' + vid + '?v=2&alt=jsonc';
    $.getJSON(url, update_nowplay);
}

var update_nowplay = function(data){
    var vinfo = data.data;
    var nowplay = $('#nowplay');
    nowplay.text('Now Playing - ' + vinfo.title);
};

function sethost(h){
    ishost = h;
}

var last_msg_time = 1;

function yt_polling(){
    var href = "/youtube/view/?hostid=" +$.getUrlVars()["hostid"];
    var post = {since:last_msg_time};
    $.post(href, post, function(data){
        yt_recv(data);
    }, 'json');
}

var yt_recv = function(data){
    yt_debug(data);
    if(data && data.error){
        setTimeout(yt_polling, 3000);
    }
    if(data && data.message){
        var vid;
        for(var i = 0; i < data.message.length; ++i){
            var msg = data.message[i];
            vid = msg.msg;
            $('#debug').append('<b>' + msg.user.nick + '</b> : ' + msg.msg + '<br />');
            if(msg.timestamp > last_msg_time)
                last_msg_time = msg.timestamp;
        }
        $('#debug').scrollTop(99999999999);
        play(vid);
        yt_polling();
    }
}

var yt_debug = function(data){
    if(data){
        if(data.error){
            for(var i = 0; i < data.error.length; ++i){
                $('#debug').append('<div style="font-weight:bold; color:red">ERROR: ' + data.error[i] + '</div>');
            }
        }
        if(data.info){
            for(var i = 0; i < data.info.length; ++i){
                $('#debug').append('<div><span style="font-weight:bold;">INFO: </span>' + data.info[i] + '</div>');
            }
        }
    }
    $('#debug').scrollTop(9999999999);
}

$(function(){
    yt_debug({info: ['Your Host ID '+$.getUrlVars()["hostid"]]});
});
