require("babel-register");

const request = require('request');
const path = require('path');
const http = require('http');

const Datastore = require('nedb');
const wordsDb = new Datastore({ filename: 'words', autoload: true });

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
	res.sendFile(__dirname + '/client/admin.html');
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

		wordsDb.insert(newWord)
			.then(({ insertedId }) => newWordEmit({ _id: insertedId, ...newWord }));

		res.send('wordReceived');
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
newWordEmit = function (newWord) {
	io.emit('words:new', newWord);
};

io.on('connection', (socket) => {
	console.log('connection');

	socket.on('words:all', () => {
		console.log('words:all');
		wordsDb.find({}).sort({ id: -1 }).toArray((err, allWords) => {
			console.log('allWords');
			console.log(allWords);
			socket.emit('words:all', allWords || []);
		});
	});

	socket.on('word:send', (wordId) => {
		console.log('words:send '+wordId);
		wordsDb.findOne({ _id: wordId }, (err, { word, vector }) => {
			console.log('word');
			console.log(word);


			request(config.targethost+'?message='+encodeURIComponent(word)+'&vector='+vector, function (error, response) {
				console.log(response.statusCode);
				console.log('error');
				console.log(error);
				// if (!error && response.statusCode == 200) {
				// 	send();
				// }
			});
		})
	})
});
