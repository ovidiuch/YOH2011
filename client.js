var environment = require('./environment.js');
var timer = require('./timer.js');

exports.getIdByConn = function(conn)
{
    for(var i = 0; i < environment.players.length; i++)
    {
        if(environment.players[i].conn == conn)
        {
            return i;
        }
    }
    return null;
};

exports.validateName = function(name)
{
    var valid = name.match(/^[a-z0-9-_]{2,}$/i);
    var response =
    {
        type: 'nameValidation',
        content:
        {
            valid: valid,
            message: !valid ? 'Invalid name, must be at least 2 chars long!' : ''
        }
    }
    this.socketMessage(response, environment.playerId);
    
    if(valid)
    {
        environment.players[environment.playerId].name = name;
        environment.players[environment.playerId].active = true;
        
        var found = false;
        
        for(var i = 0; i < environment.players.length; i++)
        {
            if(environment.players[i].active && i != environment.playerId)
            {
                found = true;
            }
        }
        if(!found)
        {
            environment.playerIdCurrent = environment.playerId;
            
            this.startTimer();
        }
        this.updateInterface(true);
    }
};

exports.validateInput = function(word)
{
    var valid = true;
    var error = '';
    
    if(environment.userId != environment.userIdCurrent)
    {
        valid = false;
        error = 'This is not your turn!';
    }
    if(!(valid = Boolean(word.match(/^[a-z]{3,}$/i))))
    {
        error = 'Invalid word!';
    }
    if(environment.wordStack.length)
    {
        var last = environment.wordStack[environment.wordStack.length - 1].substr(-2);
        var first = word.substr(0, 2);
        
        if(last != first)
        {
            valid = false;
            error = 'The word does not follow the previous!';
        }
        else if(environment.wordStack.indexOf(word) != -1)
        {
            valid = false;
            error = 'The word was already used in this game!';
        }
    }
    // also validate that word is matching and that it is valid word
    
    var response =
    {
        type: 'inputValidation',
        content:
        {
            valid: valid,
            message: error
        }
    }
    this.socketMessage(response, environment.playerId);
    
    if(valid)
    {
        environment.wordStack.push(word);
        
        environment.addPoints(word.length);
        environment.nextUser();
        
        this.startTimer();
        this.updateInterface(word);
    }
};

exports.startTimer = function()
{
    var response =
    {
        type: 'timerStart',
        content:
        {
            time: 10,
            playerIdCurrent: environment.playerIdCurrent
        }
    };
    this.socketMessage(response);
    
    var self = this;
    
    timer.start(10, function()
    {
        self.expireRound();
    });
};

exports.expireRound = function()
{
    environment.addPoints(-3);
    environment.nextUser();
    
    this.startTimer();
    this.updateInterface();
};

exports.updateInput = function(word)
{
    var response =
    {
        type: 'inputUpdate',
        content: { word: word }
    };
    this.socketMessage(response, environment.playerIdCurrent, true);
}

exports.updateInterface = function(word)
{
    var players = [];
    
    for(var i = 0; i < environment.players.length; i++)
    {
        players.push(
        {
            id: i,
            current: Boolean(i == environment.playerIdCurrent),
            name: environment.players[i].name,
            points: environment.players[i].points
        });
    }
    var response =
    {
        type: 'interfaceUpdate',
        content:
        {
            players: players,
            playerIdCurrent: environment.playerIdCurrent,
            words: word === true ? environment.wordStack.splice(-10) : (word ? [word] : [])
        }
    };
    this.socketMessage(response);
};

exports.socketMessage = function(message, id, inverted)
{
    for(var i = 0; i < environment.players.length; i++)
    {
        if(id != undefined && ((!inverted && id != i) || (inverted && id == i)))
        {
            continue;
        }
        if(!environment.players[i].active && message.type != 'nameRequest')
        {
            continue;
        }
        if(message.type == 'interfaceUpdate')
        {
            message.content.playerId = i;
        }
        environment.players[i].conn.write(JSON.stringify(message));
    }
};