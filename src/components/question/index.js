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

			setTimeout(()=>{
				this.blockEl.remove();
			}, 1500)
			this.can.emit('question:answered');
		});
	}

	render(){

		$.get('/question', question => { 

			const markup = `<table class="question">
				<tr>
					<td>
						<table class="question-form">
							<tr>
								<td>
									<div class="question-form__question">
										<nobr>
											${question}
										</nobr>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="question-form__answer">
										<input class="question-form__answer-input" type="text" placeholder="Ответ в несколько слов"></input>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="question-form__answer">
										<input class="question-form__answer-submit" type="button" value="Отправить"></input>
									</div>
								</td>
							</tr>
						</table>
						<table class="question-result question-result--hide">
							<tr>
								<td>
									<div class="question-result__text question-result__text--big">
										Спасибо за ответ!
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="question-result__text question-result__text--last">
										Ваше слово стало частью<br>инсталляции
									</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>	
			</div>`;

			this.rootEl.append(markup);

			this.blockEl = this.rootEl.find('.question');
			this.formEl = this.blockEl.find('.question-form');
			this.answerEl = this.formEl.find('.question-form__answer-input');
			this.answerEl.focus();
			
			this.resultEl = this.blockEl.find('.question-result');
			this.greetingEl = this.resultEl.find('.question-result__text');
			
			this.formEl.find('.question-form__answer-submit').bind('click', ::this.submit);
			/*
			document.onkeyup = (e) => {
				e = e || window.event;
				if (e.keyCode === 13) {
					if(this.answerEl.is(':focus')){
						
					}
				}
				// Отменяем действие браузера
				return false;
			}*/


		})
	}
}