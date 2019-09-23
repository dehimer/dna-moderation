// import $ from 'jquery';

import './index.css'

export default class Auth {
	constructor(args) {
		this.can = args.can;
		this.rootEl = args.rootEl;
		console.log(this.rootEl.length);

		this.can.on('auth:check', ()=>{
			this.render();
		});
		this.can.on('auth:success', ()=>{
			this.blockEl && this.blockEl.remove();
		});
	}
	submit(pw) {
		if(pw){
			this.can.emit('server:send', {message:'auth:submit', data:pw});
		}
	}
	render(){

		const markup = `<table class='auth'>

			<tr>
				<td>
					<table class='auth__form'>

						<tr>
							<td>
								
							</td>
						</tr>
						<tr>
							<td>
								<div class="auth__form-greeting">
									Приветствую Администратор!
								</div>
							</td>
						</tr>

						<tr>
							<td>
								<div class="">
									<input class="auth__form-input auth__form-input-password" type="text" placeholder="Пароль"></input>
								</div>
							</td>
						</tr>

						<tr>
							<td>
								<div class="">
									<input class="auth__form-input auth__form-input-submit" type="button" value="Подтвердить"></input>
								</div>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>`;
		console.log(this.rootEl.length);

		this.rootEl.append(markup);
		this.blockEl = this.rootEl.find('.auth');
		this.pwEl = this.blockEl.find('.auth__form-input-password');
		this.submitEl = this.blockEl.find('.auth__form-input-submit');

		this.submitEl.bind('click', () => {
			this.submit(this.pwEl.val());
			this.pwEl.val('')
		});
	}
}