require("babel-register");

const request = require('request');
const path = require('path');
const http = require('http');

const Datastore = require('nedb');
const wordsDb = new Datastore({ filename: './db/words', autoload: true });

const express = require('express');

const config  = require(path.join(__dirname, './config.js'));

const app = express();


/* hot reload for webpack */
if(process.env.npm_lifecycle_event === 'dev') {
	console.log('WHR');
	const webpack = require('webpack');
	const webpackConfig = require('./../webpack/common.config.js');
	const compiler = webpack(webpackConfig);

	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: false, publicPath: webpackConfig.output.publicPath,
	}));

	app.use(require('webpack-hot-middleware')(compiler, {
		log: console.log, path: '/__webpack_hmr', heartbeat: 1000
	}));
}

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));


/* serve static */
app.use(express.static(__dirname + '/client'));

app.get(/^\/$/, (req, res) => {
	res.sendFile(__dirname + '/client/user.html');
});

app.get(/^\/words$/, (req, res) => {
	res.sendFile(__dirname + '/client/words.html');
});

/* queries */
let newWordEmit = function() {};

app.post(/^\/word/, (req, res) => {
	console.log('/word');
	const { word, vector } = req.query;

	if (word && !isNaN(vector*1)) {
		const newWord = {
			ts: +(new Date()),
			word,
			vector
		};

		wordsDb.insert(newWord, (err) => {
			res.send('wordsReceived');
			newWordEmit(newWord);
		})
	}
});

app.get(/^\/serverip$/, (req, res) => {
	res.send(req.protocol + '://' + req.headers.host);
});

app.get('*', (req, res) => {
	res.redirect('/');
});

const server = new http.Server(app);
const PORT = process.env.PORT || config.port || 3000;

server.listen(PORT);



const io = require('socket.io')(server);

const syncAll = (socket) => {
	wordsDb.find({}).sort({ vector: 1, ts: -1 }).exec((err, allWords) => {
		console.log('allWords');
		console.log(allWords);
		socket.emit('words:all', allWords || []);
	});
};

newWordEmit = function () {
	// io.emit('words:new', newWord);
	syncAll(io);
};

io.on('connection', (socket) => {
	console.log('connection');

	socket.on('words:all', () => {
		console.log('words:all');
		syncAll(socket);
	});

	socket.on('vector:send', (vector) => {
		console.log('vector:send '+vector);
		wordsDb.find({ vector: vector+'' }).sort({ ts: -1 }).exec((err, words) => {
			if (err) return console.error(err);

			const wordsToSend = words.map(w => w.word);
			console.log(`wordsToSend of ${vector} vector`);
			console.log(wordsToSend);

			const send = () => {
				const word = wordsToSend.shift();
				const url = `${config.targethost}?message=${encodeURIComponent(word)}&layerindex=${vector}`;
				console.log(`req: ${url}`);
				request(url, function (error, response) {
					console.log(`res: ${url}`);
					if (error) {
						console.log('error');
						console.log(error);
					} else if (response.statusCode) {
						console.log(response);
						console.log(response.statusCode);
					}
				});

				if (wordsToSend.length) {
					setTimeout(() => send(), config.requestsDelay || 1000);
				}
			};

			send();
		});
	});

	socket.on('word:send', (wordId) => {
		console.log('word:send '+wordId);
		wordsDb.findOne({ _id: wordId }, (err, { word, vector }) => {
			const url = `${config.targethost}?message=${encodeURIComponent(word)}&layerindex=${vector}`;
			console.log(`req: ${url}`);
			request(url, function (error, response) {
				console.log(`res: ${url}`);
				if (error) {
					console.log('error');
					console.log(error);
				} else if (response.statusCode) {
					console.log(response);
					console.log(response.statusCode);
				}
			});
		})
	});

	socket.on('word:update', (word) => {
		const updateWord = {
			ts: +(new Date()),
			word: word.word,
			vector: word.vector,
		};

		wordsDb.update({
			_id: word._id
		}, updateWord, {}, (err, updateResult) => {
			console.log('updateResult');
			console.log(updateResult);

			syncAll(io);
		});
	});
});
