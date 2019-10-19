import io from 'socket.io-client';

export default class Server {
	constructor(args) {
		this.can = args.can;
	}

	start(serverip){
		const socket = io(serverip);

		socket.on('answers:all', (answers) => {
			this.can.emit('answers:all', answers);
		});

		socket.on('answers:new', (newAnswer) => {
			this.can.emit('answers:new', newAnswer);
		});

		this.can.on('server:send', ({ message, data }) => {
			socket.emit(message, data);
		});
	}
}
