/* $.getUrlVars(); $.getUrlVars()["id"] */
$.extend({ getUrlVars: function(url){ var vars = [], hash, href=url?url:window.location.href;{var n;if((n = href.indexOf('#'))!=-1)href=href.substr(0, n);}; var hashes = href.slice(href.indexOf('?') + 1).split('&'); for(var i = 0; i < hashes.length; i++) { hash = hashes[i].split('='); vars.push(hash[0]); vars[hash[0]] = hash[1]; } return vars; }, getUrlVar: function(name){ return $.getUrlVars()[name]; } });
