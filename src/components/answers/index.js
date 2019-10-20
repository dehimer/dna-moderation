import $ from 'jquery';
import IScroll from 'iscroll';

import './index.css';

export default class Answers {
	constructor (args) {
		this.can = args.can;
		this.rootEl = args.rootEl;

		this.can.emit('server:send', { message: 'words:all' });

		this.can.on('words:all', (words=[]) => {
			this.words = words;
			this.render();

			setTimeout(() => {
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

	genHeaderMarkup(vector) {
		return `
			<div class="words__header">
				<div class="words__header-name">
					${vector}
				</div>
				<input
					class="words-whole-vector__send"
					data-id="${vector}"
					type="button"
					value="Отправить весь вектор"
				/>
			</div>
		`
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

	genListMarkup() {
		let currentVector;
		return this.words.map((word) => {
			console.log(word);
			if (currentVector !== word.vector) {
				currentVector = word.vector;
				return this.genHeaderMarkup(word.vector) + this.genItemMarkup(word);
			} else {
				return this.genItemMarkup(word);
			}
		}).join('');
	}

	render() {
		const markup = `
			<div class='words'>
				<div style="height:100vh; overflow:hidden;">
					<div class='words__list'>
						${this.genListMarkup()}
					</div>
				</div>
			</div>
		`;

		this.rootEl.find('.words').remove();
		this.rootEl.append(markup);

		this.blockEl = this.rootEl.find('.words');
		this.listEl = this.blockEl.find('.words__list');

		this.iscroll && this.iscroll.destroy();
		this.iscroll = new IScroll(this.listEl.parent()[0], {
			mouseWheel: true,
			scrollbars: true
		});

		this.bindSendClick(this.listEl.find('.words__item'));
		this.bindSendClick(this.listEl.find('.words__item'));
	}
}
