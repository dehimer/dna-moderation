import $ from 'jquery';
import IScroll from 'iscroll';

import './index.css';

export default class Answers {
	constructor (args) {
		this.can = args.can;
		this.rootEl = args.rootEl;

		this.can.on('auth:success', () => {
			this.can.emit('server:send', { message:'answers:all' });
		});

		this.can.on('answers:all', (answers=[]) => {
			this.answers = answers;
			this.render();

			setTimeout(function () {
				window.scrollTo(0,0 );
			}, 100);
		});

		this.can.on('answers:sent', (answerId) => {
			this.sent(answerId);
		});

		this.can.on('answers:new', (newAnswer) => {
			this.answers.unshift(newAnswer);
			this.addNew(newAnswer);
		});
	}

	send(id) {
		this.can.emit('server:send', { message: 'answers:send', data: id });
	}

	sent (id) {
		this.blockEl.find(`.answers__item[data-id="${id}"]`).find('.answers__send').addClass('answers__send--blocked');
	}

	addNew (answer) {
		this.listEl.find(`.answers__item[data-id="${answer.id}"]`).remove();
		this.listEl.prepend(this.genItemMarkup(answer));
		this.bindSendClick(this.listEl.find(`.answers__item[data-id="${answer.id}"]`));
		this.iscroll.refresh();
	}

	genItemMarkup(answer) {
		const {id, text, sent} = answer;

		const date 	= new Date(id);
		let hour	= date.getHours();
		let minute  = date.getMinutes();

		if(hour.toString().length == 1) {
			hour = '0'+hour;
		}

		if(minute.toString().length == 1) {
			minute = '0'+minute;
		}

		const time = hour+':'+minute;

		return `
			<div class="answers__item" data-id="${id}">
				<div class="answers__item-time" >
					${time}
				</div>
				<div class="answers__item-text">
					${text}
				</div>
				<input
					class="answers__send ${sent?'answers__send--blocked':''}"
					type="button"
					value="Отправить"
				/>
			</div>
		`
	}

	bindSendClick(itemsEl) {
		itemsEl.find('.answers__send').bind('click', (e) => {

			const buttonEl = $(e.currentTarget);
			if(buttonEl.hasClass('answers__send--blocked')){
				return;
			}

			const itemEl = buttonEl.closest('.answers__item');
			const answerId = itemEl.data('id');

			this.send(answerId);
		});
	}

	render() {
		const answersMarkup = this.answers.map(answer => {
			return this.genItemMarkup(answer)
		}).join('');

		const markup = `
			<div class='answers'>
				<div style="height:100vh; overflow:hidden;">
					<div class='answers__list'>
						${answersMarkup}
					</div>
				</div>
			</div>
		`;

		this.rootEl.append(markup);

		this.blockEl = this.rootEl.find('.answers');
		this.listEl = this.blockEl.find('.answers__list');

		this.iscroll = new IScroll(this.listEl.parent()[0], {
			mouseWheel: true,
			scrollbars: true
		});

		this.bindSendClick(this.listEl.find('.answers__item'));
	}
}
