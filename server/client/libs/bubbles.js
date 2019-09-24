

var BUBBLES_LENGTH,
	BUBBLE_ALPHA_MAX,
	BUBBLE_RADIUS_MAX,
	BUBBLE_RADIUS_MIN,
	BUBBLE_VY_MAX,
	BUBBLE_VY_MIN,
	GRADIENT_COLOR_1,
	GRADIENT_COLOR_2,
	GRADIENT_COLOR_3,
	Main,
	getRandomArbitary,
	getRandomInt;

GRADIENT_COLOR_1 = 'rgba(0, 100, 255, 0.0)';//'#65a7f7';
GRADIENT_COLOR_2 = 'rgba(0, 100, 255, 0.0)';//'#2989D8';
GRADIENT_COLOR_3 = GRADIENT_COLOR_1;

BUBBLES_LENGTH = 10;
BUBBLE_VY_MIN = 0.1;
BUBBLE_VY_MAX = 10;
BUBBLE_RADIUS_MIN = 0.1;
BUBBLE_RADIUS_MAX = 2;
BUBBLE_ALPHA_MAX = 0.5;

createjs.Ticker.framerate = 30;

getRandomArbitary = function(min, max) {
  return Math.random() * (max - min) + min;
};

getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Main = (function() {
  function Main(stage1) {
    var bubble, i, j, radius, ref;
    this.stage = stage1;
    this.canvas = this.stage.canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.background = new createjs.Shape;
    this.stage.addChild(this.background);
    this.bubbles = [];
    for (i = j = 0, ref = BUBBLES_LENGTH; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      bubble = new createjs.Shape;
      radius = getRandomInt(BUBBLE_RADIUS_MIN, BUBBLE_RADIUS_MAX);
      bubble.graphics.beginFill("#fff").drawCircle(0, 0, radius);
      bubble.ax = getRandomInt(0, this.canvas.width);
      bubble.ay = getRandomInt(0, this.canvas.height);
      bubble.vy = getRandomArbitary(BUBBLE_VY_MIN, BUBBLE_VY_MAX);
      bubble.alpha = 0;
      this.bubbles.push(bubble);
      this.stage.addChild(bubble);
    }
  }

  Main.prototype.run = function() {
    this._drawBackground();
    createjs.Ticker.addEventListener("tick", this.handleTick.bind(this));
    return console.log(" - run");
  };

  Main.prototype.handleTick = function() {
    var bubble, j, len, ref;
    ref = this.bubbles;
    for (j = 0, len = ref.length; j < len; j++) {
      bubble = ref[j];
      bubble.ay -= bubble.vy;
      bubble.alpha = 1 - (Math.abs((bubble.ay / this.canvas.height) - 0.5) * 2);
      bubble.alpha *= BUBBLE_ALPHA_MAX;
      if (bubble.ay <= 0) {
      bubble.ax = getRandomInt(0, this.canvas.width);
      bubble.ay = this.canvas.height;
      bubble.vy = getRandomArbitary(BUBBLE_VY_MIN, BUBBLE_VY_MAX);
      }
      bubble.x = Math.floor(bubble.ax);
      bubble.y = Math.floor(bubble.ay);
    }
    return this.stage.update();
  };

  Main.prototype._drawBackground = function() {
  return this.background.graphics.beginLinearGradientFill([GRADIENT_COLOR_1, GRADIENT_COLOR_2, GRADIENT_COLOR_3], [0, 0.5, 1], 0, 0, 0, this.canvas.height).drawRect(0, 0, this.canvas.width, this.canvas.height);
  };

  return Main;

})();


var main, stage;
stage = new createjs.Stage('background');
main = new Main(stage);
main.run();
