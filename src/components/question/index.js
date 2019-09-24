import $ from 'jquery'
import './index.css'

export default class Question {
	constructor (args) {
		this.rootEl = args.rootEl;
		this.can = args.can;
	}

	submit () {
		const answer = this.answerEl.val().substr(0, 30);

		if(!answer){
			return;
		}

		$.get('/answer?text='+answer, ()=>{
			this.formEl.addClass('question-form--hide');
			this.resultEl.removeClass('question-result--hide');

			this.can.emit('question:answered');
		});
	}

	render(){
		$.get('/question', (question) => {

			const markup = `<div class="question">
				<div class="question-form">
					<div class="question-form__question">
						${question}
					</div>
					<div class="question-form__answer">
						<input class="question-form__answer-input" type="text" placeholder="Ответ в несколько слов" />
					</div>
					<div class="question-form__answer">
						<input class="question-form__answer-submit" type="button" value="Отправить" />
					</div>
				</div>
				<div class="question-result question-result--hide">
					<div class="question-result__text question-result__text--big">
						Спасибо за ответ!
					</div>
					<div class="question-result__text question-result__text--last">
						Ваше слово стало частью<br>инсталляции
					</div>
				</div>
			</div>`;

			this.rootEl.append(markup);

			this.blockEl = this.rootEl.find('.question');
			this.formEl = this.blockEl.find('.question-form');
			this.answerEl = this.formEl.find('.question-form__answer-input');
			this.answerEl.focus();

			this.resultEl = this.blockEl.find('.question-result');
			this.greetingEl = this.resultEl.find('.question-result__text');

			this.formEl.find('.question-form__answer-submit').bind('click', ::this.submit);
		})
	}
}
