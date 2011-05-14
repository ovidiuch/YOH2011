var http = require('http');
var fs = require('fs');
var net = require('net');

/* Environment */

Environment = {};

Environment.players = [];

/* Controllers */

var Controllers = {};

Controllers.main = {};

Controllers.main.index = function()
{
    return { SOMETHING: 'vali' };
};
Controllers.main.dani = function()
{
    return { SOMETHING: 'dani' };
};

/* View */

var View = {};

View.parseContents = function(contents, vars)
{
    for(var i in vars)
    {
        contents = contents.replace('{' + i + '}', vars[i]);
    }
    return contents;
};

View.load = function(controller, action, vars, res)
{
    fs.readFile('views/' + controller + '/' + action + '.html', function(err, contents)
    {
        if(err)
        {
            throw err;
        }
        contents = View.parseContents(String(contents), vars);  
        
        View.send(res, contents);
    });
};

View.send = function(res, contents)
{
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    res.end(contents + '\n');
};

/* HTTP Server */

http.createServer(function(req, res)
{
    var controller = 'main';
    var action = 'index';
    
    if(req.url.match(/^\/\w+\/\w+$/i))
    {
        var parts = req.url.split('/');
        
        if(Controllers[parts[1]] && Controllers[parts[1]][parts[2]])
        {
            controller = parts[1];
            action = parts[2];
        }
        else
        {
            throw 'Page does not exist! (' + req.url + ')';
        }
    }
    var vars = Controllers[controller][action]();
    
    View.load(controller, action, vars, res);
    
}).listen(1337, "0.0.0.0");

/* TCP Server */

net.createServer(function(socket)
{
    Environment.players.push(
    {
        socket: socket,
        points: 0,
        name: 'Guest'
    });
    
    socket.on('data', function(d)
    {
        for(var i = 0; i < Environment.players.length; i++)
        {
            if(Environment.players[i].socket != socket)
            {
                Environment.players[i].socket.write(d);
            }
        }
    });
    socket.on('end', function(d)
    {
        for(var i = 0; i < Environment.players.length; i++)
        {
            if(Environment.players[i].socket == socket)
            {
                Environment.players.splice(i, 1);
                
                return;
            }
        }
    });

}).listen(1338, "0.0.0.0");

/**/

console.log('Server running at http://127.0.0.1:1337/');