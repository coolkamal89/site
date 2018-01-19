const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

memory = {
	threads: {}
};

var quizEntries = [
	{ qid: 1, q: 'What is the capital of India?', a1: 'Mumbai', a2: 'Delhi', a3: 'Kolkata', a4: 'Chennai', c: 'a2' },
	{ qid: 2, q: 'Who wrote Julius Caeser?', a1: 'William Shakespeare', a2: 'Omprakash Mishra', a3: 'Dhinchak Pooja', a4: 'Dinesh Yadav', c: 'a1' },
	{ qid: 3, q: 'What is the curreny in Japan', a1: 'Yen', a2: 'Rupee', a3: 'Dollars', a4: 'Pounds', c: 'a1' }
];

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getQues(ques) {
	return {
		raw: ques,
		text: `${ques.q}\n\nA. ${ques.a1}\nB. ${ques.a2}\nC. ${ques.a3}\nD. ${ques.a4}`
	}
}

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
	const date = new Date().toString();
	res.send(`Hello Heroku App! The current time is ${date}`);
});

app.get('/stats', (req, res) => {
	res.send({
		memory: memory
	});
});

app.post('/hook', (req, res) => {
	console.log(req.body);

	if (req.body.message) {
		var message = req.body.message;
		var chat_id = message.chat.id;
		var user_name = (message.from.first_name !== '' ? message.from.first_name : 'Guest');

		if (message.text) {
			var text = message.text;

			if (text.indexOf('/help') >= 0) {
				res.send({
					method: 'sendMessage',
					chat_id: chat_id,
					text:
						'Welcome to the QuizBot.\n' +
						'You can select the below options:\n\n' +
						'/start - To start the quiz\n' +
						'/stop - To stop the quiz\n' +
						'/help - To get help regarding the quiz\n' +
						'/score - To get your current score'
				});
			}

			else if (text.indexOf('/start') >= 0) {

				// Shuffle the questions
				var user_ques = shuffle(quizEntries);

				// Throw the first question to the user
				var ques = getQues(user_ques[0]);

				// Store the details against the user
				memory.threads[chat_id] = {
					user_name: user_name,
					questions: user_ques,
					score: 0,
					current_ques: ques.raw
				}

				res.send({
					method: 'sendMessage',
					chat_id: chat_id,
					text: `Hi ${user_name}, let\'s start with the quiz.\n\n${ques.text}`,
					reply_markup: {
						'keyboard': [['A', 'B'], ['C', 'D']],
						'one_time_keyboard': true,
						'resize_keyboard': true,
						'remove_keyboard': true
					}
				});
			}

			else if (text.indexOf('/stop') >= 0) {
				delete memory.threads[chat_id];
				res.send({
					method: 'sendMessage',
					chat_id: chat_id,
					text: 'Thank you for playing QuizBot. Hope you enjoyed.'
				});
			}

			else if (text.indexOf('/score') >= 0) {
				res.send({
					method: 'sendMessage',
					chat_id: chat_id,
					text: `Hi ${user_name}, your score is ${memory.threads[chat_id].score}.`
				});
			}

			else {
				res.send({
					method: 'sendMessage',
					chat_id: chat_id,
					text: JSON.stringify(memory.threads[chat_id].current_ques)
				});
			}
		}
	}
});

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
