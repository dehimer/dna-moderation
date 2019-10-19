import $ from 'jquery';

const EventEmitter = require('events');
class CAN extends EventEmitter {}
const can = new CAN();

import './styles/base.css';
import './styles/admin.css';

import Server from './components/server';
import Answers from './components/answers';


let rootEl = $('#root');

const server = new Server({ can });

$.get('/serverip', (serverip) => {
	console.log(`serverip ${serverip}`);
	server.start(serverip, () => {
		console.log('cb');
		new Answers({ rootEl, can });
	});
});

document.ontouchmove = function(event){
	event.preventDefault();
};
