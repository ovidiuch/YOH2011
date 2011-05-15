var Server =
{
    enabled: false,
    socket: null,
    init: function(host)
    {
        try
        {
            this.socket = new WebSocket('ws://' + (host || '10.10.0.182:1338'));
        }
        catch(e)
        {
            alert(e);
            return;
        }
        this.enabled = true;
        
        this.socket.onopen = function()
        {
            Server.log('Connected.');            
        };
        this.socket.onmessage = function(response)
        {
            Server.log('Received data: ' + response.data);
            
            var data = JSON.parse(response.data);
            
            if(typeof(Server.actions[data.type]) == 'function')
            {
                Server.actions[data.type](data.content);
            }
        };
        this.socket.onerror = function(response)
        {
            Server.log('Error: ' + response.data);
        };
    },
    log: function(message)
    {
        //alert(message);
    }
};
Server.actions =
{
    nameRequest: function()
    {
        YAHOO.userdata.container.dialog.show();
    },
    nameRequest2: function(name)
    {
        var response =
        {
            type: 'nameResponse',
            content: { name: name }
        };
        Server.socket.send(JSON.stringify(response));
    },
    nameValidation: function(data)
    {
        if(!data.valid)
        {
            this.nameRequest();
        }
    },
    interfaceUpdate: function(data)
    {
        console.log(data);
    }
};

var onLoadHandler = window.onload || function(){};
window.onload = function() {
    onLoadHandler();
    
    Server.init();
};
