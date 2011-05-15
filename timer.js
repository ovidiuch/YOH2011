exports.timeout = null;

exports.start = function(seconds, callback)
{
    var self = this;
    
    if(this.timeout)
    {
        clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(function()
    {
        clearTimeout(self.timeout);
        
        callback();
    },
    seconds * 1000);
};