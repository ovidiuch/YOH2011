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
    this.playerIdCurrent = (this.playerIdCurrent + 1) % this.players.length;
};

exports.addPoints = function(value)
{
    this.players[this.playerIdCurrent].points += value;
}