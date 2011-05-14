var fs = require('fs');

exports.dict = false;

exports.init = function() {
	fs.readFile('./public/words.txt', function(err, data) {
		if(err)
			throw err;
		exports.dict = data;
	});
}

exports.checkWord = function(w) {
	

}

