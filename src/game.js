// game.js

import Paddle from './paddle';


/** @class Game
  * Represents a breakout game
  */
export default class Game {

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.render();
  }

  constructor() {
    this.Key = {
      _pressed: {},

      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      SPACE: 32,
      CTRL: 17,
      ESC: 27,
      
      isDown: function(keyCode) {
        return this._pressed[keyCode];
      },
      
      onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
      },
      
      onKeyup: function(event) {
        delete this._pressed[event.keyCode];
      }
    };

    this.Key.isDown = this.Key.isDown.bind(this.Key);
    this.Key.onKeyup = this.Key.onKeyup.bind(this.Key);
    this.Key.onKeydown = this.Key.onKeydown.bind(this.Key);

    this.FPS = 45;
    this.canvas = document.createElement('canvas');
    
    this.base_width = 1024;
    this.base_height = 576;
    this.scale = 1;
    this.width_padding = 0;
    this.height_padding = 0;

    this.player = new Paddle(60,0.75,4,this.base_width/2,this.base_height/16*15,100,10);

    document.body.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');    

    this.resizeCanvas = this.resizeCanvas.bind(this);

    window.addEventListener('resize', this.resizeCanvas, false);
    this.resizeCanvas();
    this.input = this.input.bind(this);
    this.update = this.update.bind(this);

    window.addEventListener('keyup', this.Key.onKeyup, false);
    window.addEventListener('keydown', this.Key.onKeydown , false);

    setInterval( this.update, 1000/this.FPS );

  }
  
  input(){ 
    if (this.Key.isDown(this.Key.LEFT)) this.player.moveLeft();
    if (this.Key.isDown(this.Key.RIGHT)) this.player.moveRight();
  }

  render() {
    this.context.fillStyle = "#000";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    var aspect_ratio = this.canvas.height/this.canvas.width;
    if(aspect_ratio <= 0.5625){
      // width/height >= 16:9 - width si big - we add width padding
      this.width_padding = (this.canvas.width-this.canvas.height/0.5625)/2;
      this.scale = (this.canvas.width-this.width_padding*2)/this.base_width;
      this.height_padding = 0;
    }else{
      // width/height <= 16:9 - height is big - we add height padding
      this.height_padding = (this.canvas.height-this.canvas.width*0.5625)/2;
      this.scale = (this.canvas.height-this.height_padding*2)/this.base_height;
      this.width_padding = 0;
    }

    this.context.save();

    this.context.translate(this.width_padding,this.height_padding);
    this.context.fillStyle = "#333";
    this.context.fillRect(0, 0, this.canvas.width-this.width_padding*2, this.canvas.height-this.height_padding*2); 

    this.context.restore();

    this.context.fillStyle = "#000";
    this.context.fillRect(0, this.canvas.height/2-2, this.canvas.width, 4);
    this.context.fillRect(this.canvas.width/2-2, 0, 4, this.canvas.height);


    this.context.save();
  
    this.context.translate(this.width_padding,this.height_padding);
    this.context.scale(this.scale,this.scale);
    this.player.render(this.context);
    
    this.context.restore();
  }

  update() {
    this.input();
    this.player.update();
    this.render();
  }


}
