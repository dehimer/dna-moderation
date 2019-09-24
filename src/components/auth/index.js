import './index.css'

export default class Auth {
	constructor(args) {
		this.can = args.can;
		this.rootEl = args.rootEl;

		this.can.on('auth:check', () => {
			this.render();

			setTimeout(function () {
				window.scrollTo(0,0 );
			}, 100);
		});

		this.can.on('auth:success', () => {
			this.blockEl && this.blockEl.remove();
		});
	}

	submit(pw) {
		if (pw) {
			this.can.emit('server:send', { message: 'auth:submit', data: pw });
		}
	}

	render(){
		const markup = `<div class='auth'>
			<div class="auth__form-greeting">
				Приветствую Администратор!
			</div>
			
			<div class="auth__form-fields">
				<input class="auth__form-input auth__form-input-password" type="text" placeholder="Пароль" />
				<input class="auth__form-input auth__form-input-submit" type="button" value="Подтвердить" />
			</div>
		</div>`;

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
