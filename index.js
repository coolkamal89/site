const express = require('express');
var PORT = process.env.PORT || 5000;

var app = express();

app.get('/', (req, res) => {
	res.send('Hello Heroku App!');
});

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
