import './index.css'

export default class Logo {
	constructor (args) {
		this.rootEl = args.rootEl;
	}
	render() {

		const markup = '<img class="logo" src="/logoo.png"/>';

		this.rootEl.append(markup);
	}
}
