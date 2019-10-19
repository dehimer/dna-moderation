import $ from 'jquery'
import './index.css'

export default class Question {
	constructor (args) {
		this.rootEl = args.rootEl;
		this.can = args.can;
	}

	submit () {
		const word = this.wordEl.val();
		const vector = this.vectorEl.val()*1;

		if(!word || isNaN(vector)){
			return;
		}

		$.post('/word?word='+word+'&vector='+vector, () => {
			this.formEl.addClass('question-form--hide');
			this.resultEl.removeClass('question-result--hide');
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
					<input class="question-form__input vector" type="text" placeholder="Вектор" />
				</div>
				<div class="question-form__input-wrapper">
					<input class="question-form__submit" type="button" value="Отправить" />
				</div>
			</div>
			<div class="question-result question-result--hide">
				<div class="question-result__text question-result__text--big">
					Ваш ответ принят!
				</div>
			</div>
		</div>`;

		this.rootEl.append(markup);

		this.blockEl = this.rootEl.find('.question');
		this.formEl = this.blockEl.find('.question-form');
		this.wordEl = this.formEl.find('.question-form__input.word');
		this.vectorEl = this.formEl.find('.question-form__input.vector');

		this.resultEl = this.blockEl.find('.question-result');

		this.formEl.find('.question-form__submit').bind('click', ::this.submit);
	}
}
