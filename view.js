var fs = require('fs');

exports.parseContents = function(contents, vars)
{
    for(var i in vars)
    {
        contents = contents.replace('{' + i + '}', vars[i]);
    }
    return contents;
};

exports.load = function(controller, action, vars, res)
{
    var self = this;
    
    fs.readFile('views/' + controller + '/' + action + '.html', function(err, contents)
    {
        if(err)
        {
            throw err;
        }
        contents = self.parseContents(String(contents), vars);  
        
        self.send(res, contents);
    });
};

exports.send = function(res, contents)
{
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    res.end(contents + '\n');
};
