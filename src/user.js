import $ from 'jquery';

const EventEmitter = require('events');
class CAN extends EventEmitter {}
const can = new CAN();

import './styles/base.css';
import './styles/user.css';

import Question from './components/question/index.js'
import Twitch from './components/twitch/index.js'
import Logo from './components/logo/index.js'

let rootEl = $('#root');

const question = new Question({can, rootEl});
/*const twitch = */new Twitch({can, rootEl});
const logo = new Logo({rootEl});

question.render();
logo.render();


document.ontouchmove = function(event){
    event.preventDefault();
};