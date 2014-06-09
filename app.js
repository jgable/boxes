var ntc = require('./ntc.js'), 
	express = require('express'),
	app = express();

function randomHex () {
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}

var count = 0;

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
	res.sendfile('index.html');
});

app.get('/randombox', function (req, res) {
	count++;
	if ( count > 20 ) {
		count = 0; // sorry :'(
	}

	var hex = randomHex();
		name = ntc.ntc.name(hex);
		
	res.json({
		color: ( count > 10 ) ? "blanchedalmond" : hex,
		name: name[1]
	});
});

app.listen(3000, function () {
	console.log("Now listening on port 3000");
});
