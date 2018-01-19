const express = require('express');
const PORT = process.env.PORT || 5000;

const app = express();

app.get('/', (req, res) => {
	const date = new Date().toString();
	res.send(`Hello Heroku App! The current time is ${date}`);
});

app.get('/hook', (req, res) => {
	console.log('/hook GET route');
	res.send('/hook GET route');
});

app.post('/hook', (req, res) => {
	if (req.body.message) {
		var message = req.body.message;
		var message_id = message.message_id;
		var chat_id = message.chat.id;

		if (message.text) {
			var text = message.text;
			var response = apiRequestWebhook('sendMessage', { chat_id: chat_id, text: 'Hello' });
			
			res.send(response);
		}
	}
});

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});

function apiRequestWebhook(method, parameters) {
	if (!parameters) {
		parameters = {};
	}

	parameters.method = method;

	return parameters;
}
