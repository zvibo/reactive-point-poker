const compression = require('compression');
const express = require('express');
const path = require('path');

// setup app
const app = express();
app.set('port', process.env.PORT || 5000);
app.use(express.static(path.normalize(path.join(__dirname, '../../public'))));
app.use(compression());

// rewrite all other urls to index.html
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// start the server
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
