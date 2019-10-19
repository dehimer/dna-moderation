import $ from 'jquery'
import './index.css'

export default class Question {
	constructor (args) {
		this.rootEl = args.rootEl;
		this.can = args.can;
	}

	showNotice() {
		this.formEl.addClass('question-form--hide');
		this.resultEl.removeClass('question-result--hide');
	}

	showForm() {
		this.formEl.removeClass('question-form--hide');
		this.resultEl.addClass('question-result--hide');

		this.wordEl.val('');
		this.vectorEl.val('');
	}

	submit () {
		const word = this.wordEl.val();
		const vector = this.vectorEl.val();

		if(!word || vector === '' && isNaN(vector*1)) {
			return;
		}

		$.post('/word?word='+word+'&vector='+vector, () => {
			this.showNotice();
			setTimeout(() => {
				this.showForm();
			}, 2000)
		});
	}

	render(){
		const markup = `<div class="question">
			<div class="question-form">
				<div class="question-form__question">
					Ваше слово
				</div>
				<div class="question-form__input-wrapper">
					<input class="question-form__input word" type="text" placeholder="Слово" />
				</div>
				<div class="question-form__input-wrapper">
					<input class="question-form__input vector" type="number" min="0" max="10" placeholder="Вектор (0-10)" />
				</div>
				<div class="question-form__input-wrapper">
					<input class="question-form__submit" disabled type="button" value="Отправить" />
				</div>
			</div>
			<div class="question-result question-result--hide">
				<div class="question-result__text question-result__text--big">
					Ваше слово принято!
				</div>
			</div>
		</div>`;

		this.rootEl.append(markup);

		this.blockEl = this.rootEl.find('.question');
		this.formEl = this.blockEl.find('.question-form');
		this.wordEl = this.formEl.find('.question-form__input.word');
		this.vectorEl = this.formEl.find('.question-form__input.vector');
		this.submitEl = this.formEl.find('.question-form__submit');

		this.resultEl = this.blockEl.find('.question-result');

		this.formEl.keyup(() => {
			const word = this.wordEl.val();
			const vector = this.vectorEl.val();

			const disabled = !word || vector === '' || isNaN(vector*1) || vector > 10 || vector < 0;

			this.submitEl.prop('disabled', disabled);
		});

		this.formEl.find('.question-form__submit').bind('click', ::this.submit);
	}
}
