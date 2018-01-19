const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

var quizEntries = [
	{ qid: 1, q: 'What is 1 + 1?', a1: '1', a2: '2', a3: '3', a4: '4', c: 'a1' }
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
		console.log(req.body);
		var message = req.body.message;
		var chat_id = message.chat.id;
		var user_name = (message.from.first_name !== '' ? message.from.first_name : 'Guest');

		if (message.text) {
			var text = message.text;

			if (text.indexOf('/help') >= 0) {
				res.send({ method: 'sendMessage', chat_id: chat_id, text: 'This is the help screen.' });
			}

			else if (text.indexOf('/start') >= 0) {
				var ques = getQues(chat_id);

				var ques_form = `${ques.q}\n\nA. ${ques.a1}\nB. ${ques.a1}\nC. ${ques.a1}\nD. ${ques.a1}`;

				res.send({
					method: 'sendMessage',
					chat_id: chat_id,
					text: 'Let\'s start with the quiz.\n\n' + ques_form,
					reply_markup: {
						'keyboard': [['A', 'B', 'C', 'D']],
						'one_time_keyboard': true,
						'resize_keyboard': true,
						'remove_keyboard': true
					}
				});
			}

			else if (text.indexOf('/stop') >= 0) {
				res.send({
					method: 'sendMessage',
					chat_id: chat_id,
					text: 'Let\'s stop the quiz.'
				});
			}

			else {
				res.send({
					method: 'sendMessage',
					chat_id: chat_id,
					text: 'Hello'
				});
			}
		}
	}
});

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
