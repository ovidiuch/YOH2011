var environment = require('./environment.js');

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

exports.validateName = function(name, id)
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
	this.socketMessage(JSON.stringify(response), id);
	
	if(valid)
	{
		environment.players[id].name = name;
		
		this.updateInterface();
	}
};

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
        if(!environment.players[i].active)
        {
            //continue;
        }
        environment.players[i].conn.write(message);
    }
};