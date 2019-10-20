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
		console.log(`send ${id}`);
		this.can.emit('server:send', { message: 'word:send', data: id });
	}

	sendVector(idx) {
		console.log(`sendVector ${idx}`);
		this.can.emit('server:send', { message: 'vector:send', data: idx });
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
					class="words__button words-whole-vector__send"
					data-idx="${vector}"
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
			<div class="words__item">
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
				 	data-id="${_id}"
					class="words__button words__edit"
					type="button"
					value="Редактировать"
				/>
				<input
				 	data-id="${_id}"
					class="words__button words__send"
					type="button"
					value="Отправить"
				/>
			</div>
		`
	}

	bindSendClick(itemsEl) {
		console.log('bindSendClick');
		itemsEl.bind('click', (e) => {
			const buttonEl = $(e.currentTarget);
			const wordId = buttonEl.data('id');

			this.send(wordId);
		});
	}

	bindSendVectorClick(vectorEl) {
		console.log('bindSendVectorClick');
		vectorEl.bind('click', (e) => {
			const buttonEl = $(e.currentTarget);
			const vectorIdx = buttonEl.data('idx');
			console.log(vectorIdx);
			this.sendVector(vectorIdx);
		})
	}

	bindEditClick(el) {
		el.bind('click', (e) => {
			const buttonEl = $(e.currentTarget);
			const wordId = buttonEl.data('id');
			console.log(`edit ${wordId} word`);

			const word = this.words.find(w => w._id === wordId);
			this.createEditForm(word);
		})
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

	createEditForm(word) {
		console.log('createEditForm');
		console.log(word);
		const markup = `
			<div class="edit-word-form-wrapper">
				<div class="edit-word-form">
					<div class="edit-word-form__input-wrapper">
						<input class="edit-word-form__input word" type="text" placeholder="Слово" value="${word.word}"/>
					</div>
					<div class="edit-word-form__input-wrapper">
						<input class="edit-word-form__input vector" type="number" min="0" max="10" placeholder="Вектор (0-10)" value="${word.vector}" />
					</div>
					<div class="edit-word-form__input-wrapper">
						<input class="edit-word-form__submit" type="button" value="Сохранить" />
					</div>
				</div>
			</div>
		`;
		this.rootEl.append(markup);

		const formWrapperEl = this.rootEl.find('.edit-word-form-wrapper');
		const formEl = formWrapperEl.find('.edit-word-form');

		const wordEl = formEl.find('.edit-word-form__input.word');
		const vectorEl = formEl.find('.edit-word-form__input.vector');
		const submitEl = formEl.find('.edit-word-form__submit');

		formWrapperEl.bind('click', () => {
			formWrapperEl.remove();
		});

		formEl.bind('click', (e) => {
			e.stopPropagation();
		});

		formEl.keyup(() => {
			const word = wordEl.val();
			const vector = vectorEl.val();

			const disabled = !word || vector === '' || isNaN(vector*1) || vector > 10 || vector < 0;

			submitEl.prop('disabled', disabled);
		});

		formEl.find('.edit-word-form__submit').bind('click', (e) => {
			e.stopPropagation();
			console.log('save');

			const data = {
				_id: word._id,
				word: wordEl.val(),
				vector: vectorEl.val()
			};

			console.log(data);

			this.can.emit('server:send', { message: 'word:update', data });

			formWrapperEl.remove();
		});
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

		this.bindSendClick(this.listEl.find('.words__send'));
		this.bindEditClick(this.listEl.find('.words__edit'));
		this.bindSendVectorClick(this.listEl.find('.words-whole-vector__send'));
	}
}
