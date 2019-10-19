import io from 'socket.io-client';

export default class Server {
	constructor(args) {
		this.can = args.can;
	}

	start(serverip, cb){
		const socket = io(serverip);

		cb && socket.on('connect', cb);

		socket.on('words:all', (words) => {
			this.can.emit('words:all', words);
		});

		socket.on('words:new', (newWord) => {
			this.can.emit('words:new', newWord);
		});

		this.can.on('server:send', ({ message, data }) => {
			console.log('server:send '+message);
			socket.emit(message, data);
		});
	}
}
