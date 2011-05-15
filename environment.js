exports.players = [];
exports.currentPlayer = 0;
exports.wordStack = [];
exports.terms =
{
    words: [],
    frequency: []
};

exports.nextUser = function()
{
    this.currentPlayer = (this.currentPlayer + 1) % exports.player.length;
};

exports.addPoints = function(value)
{
    this.players[this.currentPlayer].points += value;
}