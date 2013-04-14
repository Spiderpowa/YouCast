function cr_dosubmit(form, action){
    var href = action?action:"/chatroom/post/?hostid="+$.getUrlVars()['hostid'];
    var post = {};
    post.msg = form.msg.value;
    post.nick = form.nick.value;
    $.post(href, post, function(data){
    }, 'json');
    form.msg.value = '';
    return false;
}

var last_msg_time = 1;

function cr_polling(){
    var href = "/chatroom/view/?hostid="+$.getUrlVars()['hostid'];
    var post = {since:last_msg_time};
    $.post(href, post, function(data){
        cr_recv(data);
    }, 'json');
}

var cr_recv = function(data){
    if(data && data.error){
        if(yt_debug){
            yt_debug(data);
        }
        setTimeout(cr_polling, 3000);
    }
    if(data && data.message){
        for(var i = 0; i < data.message.length; ++i){
            var msg = data.message[i];
            var div = $('<div>').append('<b>' + msg.user.nick + '</b> : ' + msg.msg);
            if(msg.user.class){
                for(var j in msg.user.class){
                    if(msg.user.class[j]){
                        div.addClass(j);
                        console.log('add class '+j);
                    }
                }
            }
            $('#chatroom').append(div);
            if(msg.timestamp > last_msg_time)
                last_msg_time = msg.timestamp;
        }
        $('#chatroom').scrollTop(9999999999);
        cr_polling();
    }
}

$(function() {
    var username = $.getUrlVars()['nick'];
    $('#myname').text(username);
    $('#username').val(username);
    cr_polling();
});
