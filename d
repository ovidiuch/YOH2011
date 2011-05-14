[1mdiff --git a/main.js b/main.js[m
[1mindex 4e0e648..48d4d79 100644[m
[1m--- a/main.js[m
[1m+++ b/main.js[m
[36m@@ -1,6 +1,7 @@[m
[31m-var http = require('http');[m
 var fs = require('fs');[m
 var net = require('net');[m
[32m+[m[32mvar sys = require('sys');[m[41m[m
[32m+[m[32mvar http = require('http');[m[41m[m
 [m
 var controller = require('./controller.js');[m
 var view = require('./view.js');[m
[36m@@ -35,7 +36,7 @@[m [mhttp.createServer(function(req, res)[m
 [m
 /* TCP Server */[m
 [m
[31m-net.createServer(function(socket)[m
[32m+[m[32m/*net.createServer(function(socket)[m[41m[m
 {[m
     environment.players.push([m
     {[m
[36m@@ -51,7 +52,7 @@[m [mnet.createServer(function(socket)[m
         {[m
             if(!environment.players[i].active)[m
             {[m
[31m-                //continue;[m
[32m+[m[32m                continue;[m[41m[m
             }[m
             if(environment.players[i].socket != socket || 1)[m
             {[m
[36m@@ -63,11 +64,47 @@[m [mnet.createServer(function(socket)[m
     {[m
         for(var i = 0; i < environment.players.length; i++)[m
         {[m
[31m-            if(!environment.players[i].active)[m
[32m+[m[32m            if(environment.players[i].socket == socket)[m[41m[m
             {[m
[31m-                continue;[m
[32m+[m[32m                environment.players.splice(i, 1);[m[41m[m
[32m+[m[41m                [m
[32m+[m[32m                return;[m[41m[m
             }[m
[31m-            if(environment.players[i].socket == socket)[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m    });[m[41m[m
[32m+[m[41m[m
[32m+[m[32m}).listen(1338, "0.0.0.0");*/[m[41m[m
[32m+[m[41m[m
[32m+[m[32m/* Web socket server */[m[41m[m
[32m+[m[41m[m
[32m+[m[32mvar ws = require('./vendor/node-websocket-server/lib/ws/server.js');[m[41m[m
[32m+[m[41m [m
[32m+[m[32mvar server = ws.createServer();[m[41m[m
[32m+[m[41m[m
[32m+[m[32mserver.addListener('listening', function()[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    console.log('Socket server listening for connections....');[m[41m[m
[32m+[m[32m});[m[41m[m
[32m+[m[41m [m
[32m+[m[32mserver.addListener('connection', function(conn)[m[41m[m
[32m+[m[32m{[m[41m[m
[32m+[m[32m    console.log('New socket connection, ID: ' + conn.id);[m[41m[m
[32m+[m[41m    [m
[32m+[m[32m    environment.players.push([m[41m[m
[32m+[m[32m    {[m[41m[m
[32m+[m[32m        conn: conn,[m[41m[m
[32m+[m[32m        active: false,[m[41m[m
[32m+[m[32m        points: 0,[m[41m[m
[32m+[m[32m        name: 'Guest'[m[41m[m
[32m+[m[32m    });[m[41m[m
[32m+[m[41m    [m
[32m+[m[32m    conn.addListener('close', function()[m[41m[m
[32m+[m[32m    {[m[41m[m
[32m+[m[32m        console.log('Socket server connection closed, ID: ' + conn.id);[m[41m[m
[32m+[m[41m        [m
[32m+[m[32m        for(var i = 0; i < environment.players.length; i++)[m[41m[m
[32m+[m[32m        {[m[41m[m
[32m+[m[32m            if(environment.players[i].conn == conn)[m[41m[m
             {[m
                 environment.players.splice(i, 1);[m
                 [m
[36m@@ -75,8 +112,27 @@[m [mnet.createServer(function(socket)[m
             }[m
         }[m
     });[m
[32m+[m[41m     [m
[32m+[m[32m    conn.addListener('message', function(message)[m[41m[m
[32m+[m[32m    {[m[41m[m
[32m+[m[32m        console.log('Socket server message received from ID: ' + conn.id);[m[41m[m
[32m+[m[32m        console.log(message);[m[41m[m
[32m+[m[41m        [m
[32m+[m[32m        for(var i = 0; i < environment.players.length; i++)[m[41m[m
[32m+[m[32m        {[m[41m[m
[32m+[m[32m            if(!environment.players[i].active)[m[41m[m
[32m+[m[32m            {[m[41m[m
[32m+[m[32m                //continue;[m[41m[m
[32m+[m[32m            }[m[41m[m
[32m+[m[32m            if(environment.players[i].conn != conn || 1)[m[41m[m
[32m+[m[32m            {[m[41m[m
[32m+[m[32m                environment.players[i].conn.write(message);[m[41m[m
[32m+[m[32m            }[m[41m[m
[32m+[m[32m        }[m[41m[m
[32m+[m[32m    });[m[41m[m
[32m+[m[32m});[m[41m[m
 [m
[31m-}).listen(1338, "0.0.0.0");[m
[32m+[m[32mserver.listen(3400, "0.0.0.0");[m[41m[m
 [m
 /* Hello world */[m
 [m
