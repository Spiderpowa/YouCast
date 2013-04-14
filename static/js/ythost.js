var host_yt;
var host_play_list = [];
var host_curr_play_id = -1;
var list = [[],
    ['-YzWlxbg34Y', '4nItudWFWn0', '4HFMEM-cPG8'],
    ['6LMDfouEFAo', '-bTpp8PQSog', 'QH2-TGUlwu4']
];

function host_dosubmit(form){
    var href = "/chatroom/post/?postashost=1&hostid="+$.getUrlVars()['hostid'];
    return cr_dosubmit(form, href);
}

function hostplay(vid){
    setTimeout('play("'+vid+'")', 1000);
    var href = "/youtube/host/?hostid="+$.getUrlVars()["hostid"];
    var post = {};
    post.vid = vid;
    $.post(href, post, function(data){
        host_recv(data);
    }, 'json');
}

function hostplay_id(id){
    id %= host_play_list.length;
    host_curr_play_id = id;
    $('.host_playlist').removeClass('host_nowplay');
    $('#host_playlist_'+id).addClass('host_nowplay');
    hostplay(host_play_list[id]);
}

function host_yt_ready(ytplayer){
    host_yt = ytplayer;
    host_yt.addEventListener("onStateChange", "host_yt_stage_change");
}

function host_yt_stage_change(newState){
//    console.log("state change to "+newState);
    switch(newState){
        case -1: break;//unstarted
        case 0: setTimeout('host_play_next()', 1000);break;//ended
        case 1: break;//playing
        case 2: break;//pause
        case 3: break;//buffering
        case 5: break;//video cued
    }
}

function host_play_next(){
    hostplay_id(++host_curr_play_id);
}

var host_recv = function(data){
    yt_debug(data);
}

var host_get_yt = function(vid, cb){
    var url = 'http://gdata.youtube.com/feeds/api/videos/' + vid + '?v=2&alt=jsonc';
    $.getJSON(url, cb);
}

var host_get_yt_list = function(lid, cb){
    var url = 'http://gdata.youtube.com/feeds/api/playlists/' + lid + '?v=2&alt=jsonc';
    $.getJSON(url, cb);
}

var host_add_list = function(data){
//    console.log(data);
    for(var i=0; i<data.data.items.length; ++i){
        var video = data.data.items[i].video;
        host_add_video({data:video});
    }
}

var none = function(data){
    console.log(data);
}

var host_add_video = function(data){
    var vinfo = data.data;
    if(!vinfo)return false;
    var playlist = $('#playlist');
    var div = $('<div>').appendTo(playlist);
    var a = $('<a>').appendTo(div);
    div.attr('id', 'host_playlist_'+host_play_list.length);
    div.addClass('host_playlist');
    a.text(vinfo.title);
    a.attr('href', 'javascript:hostplay_id("'+host_play_list.length+'")');
    host_play_list.push(vinfo.id);
    return true;
}

var host_add_video_url = function(){
    var url = $('#video_url').val();
    if(!url || !url.length)return false;
    var vid, n;
    if((n = url.indexOf('youtu.be'))!=-1){//short link
        console.log('short link');
        vid = url.substr(n+9, 11);
    }else{
        console.log('long link ' + $.getUrlVars(url));
        vid = $.getUrlVars(url)['v'];
    }
    host_get_yt(vid, host_add_video);
    $('#video_url').val('');
}

var host_add_playlist_url = function(){
    var url = $('#playlist_url').val();
    if(!url || !url.length)return false;
    var listid = $.getUrlVars(url)['list'];
    if(!listid)return false;
    listid = listid.substr(2);//strip first 2 'PL'
    host_get_yt_list(listid, host_add_list);
    $('#playlist_url').val('');
}

$(function(){
    var hostlist = list[$.getUrlVars()['hostid']];
    yt_debug({info: ['Your Host ID '+$.getUrlVars()["hostid"]]});
    $('#video_url').val('http://www.youtube.com/watch?v=4nItudWFWn0');
    $('#playlist_url').val('http://www.youtube.com/playlist?list=PLEEE67656836AE1B1');
    /*
    for(i=0; i < hostlist.length; ++i){
        host_get_yt(hostlist[i], host_add_video);
    }
    host_get_yt_list('CD3A8FE3ED046905', host_add_list);
    */
});

sethost(true);
