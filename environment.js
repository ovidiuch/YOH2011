exports.players = [];
exports.playerConn = null;
exports.playerId = 0;
exports.playerIdCurrent = 0;
exports.wordStack = [];
exports.words = [];
exports.faults = 0;

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
    if(this.players.length >= this.playerIdCurrent + 1)
    {
        this.players[this.playerIdCurrent].points += value;
    }
}