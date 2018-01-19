const express = require('express');
const PORT = process.env.PORT || 5000;

const app = express();

app.get('/', (req, res) => {
	const date = new Date().toString();
	res.send(`Hello Heroku App! The current time is ${date}`);
});

app.all('/hook', (req, res) => {
	console.log(req.body, req.query);
	if (req.body.message) {
		var message = req.body.message;
		var message_id = message.message_id;
		var chat_id = message.chat.id;

		if (message.text) {
			var text = message.text;
			res.send({ method: 'sendMessage', chat_id: chat_id, text: 'Hello' });
		}
	}
});

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
