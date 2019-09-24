import './index.css'

export default class NightSky {
  constructor (args) {
    this.target = args.target;
  }
  render(){

    const markup = `
      <div class="stars"></div>
      <div class="twinkling"></div>
      <div class="clouds"></div>
    `;

    this.target.append(markup);
  }
}
