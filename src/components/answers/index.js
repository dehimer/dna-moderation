import $ from 'jquery';
import IScroll from 'iscroll';

import './index.css';

export default class Answers {
	constructor (args) {
		this.can = args.can;
		this.rootEl = args.rootEl;

		this.can.emit('server:send', { message: 'words:all' });

		this.can.on('words:all', (words=[]) => {
			console.log('words:all');
			console.log(words);
			this.words = words;
			this.render();

			setTimeout(function () {
				window.scrollTo(0,0 );
			}, 100);
		});

		this.can.on('words:new', (newWord) => {
			this.words.unshift(newWord);
			this.addNew(newWord);
		});
	}

	send(id) {
		this.can.emit('server:send', { message: 'words:send', data: id });
	}

	addNew (word) {
		this.listEl.find(`.words__item[data-id="${word._id}"]`).remove();
		this.listEl.prepend(this.genItemMarkup(word));
		this.bindSendClick(this.listEl.find(`.words__item[data-id="${word._id}"]`));
		this.iscroll.refresh();
	}

	genItemMarkup(word) {
		const { _id, ts, word: text, vector } = word;

		const date 	= new Date(ts);
		let hour	= date.getHours();
		let minute  = date.getMinutes();

		if(hour.toString().length === 1) {
			hour = '0'+hour;
		}

		if(minute.toString().length === 1) {
			minute = '0'+minute;
		}

		const time = hour+':'+minute;

		return `
			<div class="words__item" data-id="${_id}">
				<div class="words__item-time" >
					${time}
				</div>
				<div class="words__item-text">
					${text}
				</div>
				<div class="words__item-vector">
					${vector}
				</div>
				<input
					class="words__send"
					type="button"
					value="Отправить"
				/>
			</div>
		`
	}

	bindSendClick(itemsEl) {
		itemsEl.find('.words__send').bind('click', (e) => {

			const buttonEl = $(e.currentTarget);
			if(buttonEl.hasClass('words__send--blocked')){
				return;
			}

			const itemEl = buttonEl.closest('.words__item');
			const wordId = itemEl.data('id');

			this.send(wordId);
		});
	}

	render() {
		const wordsMarkup = this.words.map(word => {
			return this.genItemMarkup(word)
		}).join('');

		const markup = `
			<div class='words'>
				<div style="height:100vh; overflow:hidden;">
					<div class='words__list'>
						${wordsMarkup}
					</div>
				</div>
			</div>
		`;

		this.rootEl.append(markup);

		this.blockEl = this.rootEl.find('.words');
		this.listEl = this.blockEl.find('.words__list');

		this.iscroll = new IScroll(this.listEl.parent()[0], {
			mouseWheel: true,
			scrollbars: true
		});

		this.bindSendClick(this.listEl.find('.words__item'));
	}
}
