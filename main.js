var http = require('http');
var fs = require('fs');
var net = require('net');

var controller = require('./controller.js');
var view = require('./view.js');
var environment = require('./environment.js');

/* HTTP Server */

http.createServer(function(req, res)
{
    var controllerName = 'main';
    var actionName = 'index';
    
    if(req.url.match(/^\/\w+\/\w+$/i))
    {
        var parts = req.url.split('/');
        
        if(controller[parts[1]] && controller[parts[1]][parts[2]])
        {
            controllerName = parts[1];
            actionName = parts[2];
        }
        else
        {
            throw 'Page does not exist! (' + req.url + ')';
        }
    }
    var vars = controller[controllerName][actionName]();
    
    view.load(controllerName, actionName, vars, res);
    
}).listen(1337, "0.0.0.0");

/* TCP Server */

net.createServer(function(socket)
{
    environment.players.push(
    {
        socket: socket,
        active: false,
        points: 0,
        name: 'Guest'
    });
    
    socket.on('data', function(d)
    {
        for(var i = 0; i < environment.players.length; i++)
        {
            if(!environment.players[i].active)
            {
                //continue;
            }
            if(environment.players[i].socket != socket || 1)
            {
                environment.players[i].socket.write(d);
            }
        }
    });
    socket.on('end', function(d)
    {
        for(var i = 0; i < environment.players.length; i++)
        {
            if(!environment.players[i].active)
            {
                continue;
            }
            if(environment.players[i].socket == socket)
            {
                environment.players.splice(i, 1);
                
                return;
            }
        }
    });

}).listen(1338, "0.0.0.0");

/* Hello world */

console.log('Server running at http://127.0.0.1:1337/');