import $ from 'jquery';

const EventEmitter = require('events');
class CAN extends EventEmitter {}
const can = new CAN();

import './styles/base.css';
import './styles/user.css';

import Question from './components/question'
import NightSky from './components/nightsky';

let rootEl = $('#root');

const nightsky = new NightSky({ target: $('body')});
const question = new Question({ can, rootEl });

nightsky.render();
question.render();


document.ontouchmove = function(event) {
    event.preventDefault();
};
