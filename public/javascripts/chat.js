var Server =
{
    enabled: false,
    socket: null,
    counter: 10,
    init: function(host)
    {
        this.input = document.getElementById('query-field');
        this.input.onkeydown = this.input.onkeyup = this.input.onchange = function() {
            var response =
            {
                    type: 'wordChange',
                    content: { word: this.value }
            };
            Server.socket.send(JSON.stringify(response));
        }
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
    },
    countDown: function() {
        document.getElementById("countdown").value = counter-- + ' seconds left';
        if (counter != -1)
        {
            setTimeout('countDown()', 1000);
        }
        else
        {
            document.getElementById("countdown").value =' Tough luck.';
        }
    },
    notice: function(data) {
        if(!data.message)
        {
            return false;
        }
        if(this.timer)
        {
            clearTimeout(this.timer);
        }
        var element = document.getElementById('message');
        element.className = data.valid ? 'notice' : 'error';
        element.innerHTML = data.message;
        element.style.display = "block";
        this.timer = setTimeout(function() {
            element.style.display = "none";
        }, 5000);
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
        Service.notice(data);
    },
    inputValidation: function(data)
    {
        Server.notice(data);
    },
    interfaceUpdate: function(data)
    {
        // Populate player list
        var playerList = document.getElementById('players-list');
        playerList.innerHTML = '';
        for(var i = 0; i < data.players.length; i++) {
            var currentPlayer = data.players[i];
            var entry = document.createElement('li');
            if(data.playerIdCurrent == i) {
                entry.className = 'current';
            }
            entry.appendChild(document.createTextNode(currentPlayer.name));
            entry.innerHTML = entry.innerHTML +
                                 '<span class="points"> <strong>' +
                                 currentPlayer.points +
                                 '</strong> <sup>pts</sup></span></li>';
            playerList.appendChild(entry);
        }
        // Reset input form
        console.log(data);
        console.log(data.playerIdCurrent + "+++++" + data.playerId);
        Server.input.disabled = data.playerId != data.playerIdCurrent;
        // Populate word list
        var wordList = document.getElementById('words');
        console.log(data.words);
        for(var i = 0; i < data.words.length; i++) {
            var word = document.createElement('li');
            word.appendChild(document.createTextNode(data.words[i]));
            wordList.appendChild(word);
            Server.input.value = "";
        }
    },
    updateInput: function(data) {
        Server.input.value = data.word;
    }
};

var onLoadHandler = window.onload || function(){};
window.onload = function() {
    onLoadHandler();

    Server.init();
};
