const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

var quizEntries = [
	{ q: "What is 1 + 1?", a1: "", a2: "", a3: "", a4: "", c: "ans1" }
];

function getQues(chat_id) {
	return quizEntries[0];
}

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
	const date = new Date().toString();
	res.send(`Hello Heroku App! The current time is ${date}`);
});

app.post('/hook', (req, res) => {
	if (req.body && req.body.message) {
		var message = req.body.message;
		var chat_id = message.chat.id;

		if (message.text) {
			var text = message.text;

			if (text.indexOf('/help') >= 0) {
				res.send({ method: 'sendMessage', chat_id: chat_id, text: 'This is the help screen.' });
			}

			else if (text.indexOf('/start/') >= 0) {
				var ques = getQues(chat_id);

				var ques_form = ques.q;
				ques_form += '1. ' + ques.a1 + '\n';
				ques_form += '2. ' + ques.a2 + '\n';
				ques_form += '3. ' + ques.a3 + '\n';
				ques_form += '4. ' + ques.a4 + '\n';

				res.send({
					method: 'sendMessage',
					chat_id: chat_id,
					text: 'Let\'s start with the quiz.\n\n' + ques_form,
					reply_markup: {
				        'keyboard' => [['1', '2', '3', '4']],
				        'one_time_keyboard': true,
				        'resize_keyboard': true
				    }
				});
			}

			else {
				res.send({ method: 'sendMessage', chat_id: chat_id, text: 'Hello' });
			}
		}
	}
});

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
