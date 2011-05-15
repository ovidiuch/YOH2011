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
    this.socketMessage(JSON.stringify(response), environment.playerId);
    
    if(valid)
    {
        environment.players[environment.playerId].name = name;
        environment.players[environment.playerId].active = true;
        
        this.updateInterface();
    }
};

exports.validateInput = function(word)
{
    var valid = true;
    var error = '';
    
    if(!(valid = Boolean(word.match(/^[a-z]{3,}$/i))))
    {
        error = 'Invalid word, must be at least 3 chars long!';
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
    this.socketMessage(JSON.stringify(response), environment.playerId);
    
    if(valid)
    {
        environment.wordStack.push(word);
        
        environment.addPoints(3); // dinamic value
        environment.nextUser();
        
        var self = this;
        
        timer.start(10, function()
        {
            self.expireRound();
        });
        this.updateInterface();
    }
};

exports.expireRound = function()
{
    environment.addPoints(-3);
    environment.nextUser();
    
    this.updateInterface();
};

exports.updateInput = function(word)
{
    var response =
    {
        type: 'inputUpdate',
        content: { word: word }
    };
    this.socketMessage(JSON.strigify(response), environment.currentPlayer, true);
}

exports.updateInterface = function()
{
    var players = [];
    
    for(var i = 0; i < environment.players.length; i++)
    {
        players.push(
        {
            id: i,
            current: Boolean(i == environment.currentPlayer),
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
            playerId: environment.playerId,
            currentPlayer: environment.currentPlayer
        }
    };
    this.socketMessage(JSON.stringify(response));
};

exports.socketMessage = function(message, id, inverted)
{
    for(var i = 0; i < environment.players.length; i++)
    {
        if(id != undefined && ((!inverted && id != i) || (inverted && id == i)))
        {
            continue;
        }
        if(!environment.players[i].active && JSON.parse(message).type != 'nameRequest')
        {
            continue;
        }
        environment.players[i].conn.write(message);
    }
};