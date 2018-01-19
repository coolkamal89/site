const express = require('express');
const PORT = process.env.PORT || 5000;

const app = express();

app.get('/', (req, res) => {
	res.send('Hello Heroku App! The current time is ${new Date().toString()}');
});

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
