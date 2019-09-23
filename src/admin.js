import $ from 'jquery';

const EventEmitter = require('events');
class CAN extends EventEmitter {}
const can = new CAN();

import './styles/base.css';
import './styles/admin.css';

import Auth from './components/auth';
import Server from './components/server';
import Answers from './components/answers';
// import Logo from './components/logo/index.js'


let rootEl = $('#root');

const server = new Server({can});
/*const auth = */new Auth({rootEl, can});
/*const answers = */new Answers({rootEl, can});
// const logo = new Logo({rootEl});


$.get('/serverip', serverip => {
	server.start(serverip);
	// logo.render();
});

document.ontouchmove = function(event){
	event.preventDefault();
};
