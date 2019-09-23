import './index.css'

export default class Question {
	constructor (args) {
		this.rootEl = args.rootEl;
	}
	render(){

		const markup = '<img class="logo" src="/logo.png"/>';

		this.rootEl.append(markup);
	}
}