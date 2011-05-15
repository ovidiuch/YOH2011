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

            console.log(data);
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
        // Populate player list
        var playerList = document.getElementById('players-list');
        playerList.innerHTML = '';
        for(var i = 0; i < data.players.length; i++) {
            var currentPlayer = data.players[i];
            var entry = document.createElement('li');
            entry.appendChild(document.createTextNode(currentPlayer.name));
            entry.innerHTML = entry.innerHTML +
                                 '<span class="points"> <strong>' +
                                 currentPlayer.points +
                                 '</strong> <sup>pts</sup></span></li>';
            playerList.appendChild(entry);
        }
        // Populate word list
        if(data.word) {
            var wordList = document.getElementById('words');
            var lastWord = document.createElement('li');
            lastWord.appendChild(document.createTextNode(data.word));
            wordList.appendChild(lastWord);
        }
    }
};

var onLoadHandler = window.onload || function(){};
window.onload = function() {
    onLoadHandler();

    Server.init();
};
