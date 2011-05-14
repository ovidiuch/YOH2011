var fs = require('fs');
var net = require('net');
var sys = require('sys');
var http = require('http');

var controller = require('./controller.js');
var view = require('./view.js');
var environment = require('./environment.js');
var client = require('./client.js');

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

/*net.createServer(function(socket)
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
                continue;
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
            if(environment.players[i].socket == socket)
            {
                environment.players.splice(i, 1);
                
                return;
            }
        }
    });

}).listen(1338, "0.0.0.0");*/

/* Web socket server */

var ws = require('./vendor/websocket-server/lib/ws/server.js');
 
var server = ws.createServer();

server.addListener('listening', function()
{
    console.log('Socket server listening for connections....');
});
 
server.addListener('connection', function(conn)
{
    console.log('New socket connection, ID: ' + conn.id);
    
    environment.players.push(
    {
        conn: conn,
        active: false,
        points: 0,
        name: 'Guest'
    });
    
    conn.addListener('close', function()
    {
        console.log('Socket server connection closed, ID: ' + conn.id);
        
        for(var i = 0; i < environment.players.length; i++)
        {
            if(environment.players[i].conn == conn)
            {
                environment.players.splice(i, 1);
                
                return;
            }
        }
    });
    
    conn.addListener('message', function(message)
    {
        console.log('Socket server message received from ID: ' + conn.id);
        console.log(message);
        
        try
        {
            message = JSON.parse(message);   
        }
        catch(e){}
        
        if(message.type == 'nameResponse')
        {
            client.validateName(message.content.name, client.getIdByConn(conn));
        }
    });
    
    client.socketMessage(JSON.stringify({ type: 'nameRequest' }), environment.players.length - 1);
});

server.listen(1338, "0.0.0.0");

/* Hello world */

console.log('Server running...');