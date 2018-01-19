const express = require('express');
const PORT = process.env.PORT || 5000;

const app = express();

app.get('/', (req, res) => {
	const date = new Date().toString();
	res.send(`Hello Heroku App! The current time is ${date}`);
});

app.get('/hook', (req, res) => {
	res.send({
		success: true
	});
	console.log(req);
});

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
