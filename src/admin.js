import $ from 'jquery';

const EventEmitter = require('events');
class CAN extends EventEmitter {}
const can = new CAN();

import './styles/base.css';
import './styles/admin.css';

import Server from './components/server';
import Auth from './components/auth';
import Answers from './components/answers';


let rootEl = $('#root');

const server = new Server({ can });
new Auth({ rootEl, can });
new Answers({ rootEl, can });


$.get('/serverip', (serverip) => {
	server.start(serverip);
});

document.ontouchmove = function(event){
	event.preventDefault();
};
