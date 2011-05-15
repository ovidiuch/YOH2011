exports.players = [];
exports.playerConn = null;
exports.playerId = 0;
exports.playerIdCurrent = 0;
exports.wordStack = [];
exports.terms =
{
    words: [],
    frequency: []
};

exports.nextUser = function()
{
    var prevLoop = this.players.length;
    
    do
    {
        this.playerIdCurrent = (this.playerIdCurrent + 1) % this.players.length;
    }
    while(!this.players[this.playerIdCurrent].active && --prevLoop);
};

exports.addPoints = function(value)
{
    this.players[this.playerIdCurrent].points += value;
}