// game.js

import Paddle from './paddle';
import Brick from './brick';
import Ball from './ball';
import Particle from './particle';

/** @class Game
  * Represents a breakout game
  */

export default class Game {

  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    this.mouse_x = evt.clientX - rect.left;
    this.mouse_y = evt.clientY - rect.top;
  }

  initGame(level,score){

    this.current_song = Math.floor(Math.random() * this.music.length);
    this.music[this.current_song].currentTime = 0;
    this.music[this.current_song].play();

    if(level == undefined){
      this.level = 1;
    }else{
      this.level = level;
    }
    if(score == undefined){
      this.score = 0;
    }else{
      this.score = score;
    }

    this.game_over = false;
    this.next_level = false;

    this.brick_rows = 2+this.level;
    if(this.brick_rows > 6){
      this.brick_rows = 6;
    }

    this.brick_cols = 12+this.level*2;
    if(this.brick_cols > 20){
      this.brick_cols = 20;
    }
    
    var paddle_size = 256-this.level*32;
    if(paddle_size < 32)
      paddle_size = 32;

    this.ball_speed = 10;
    
    this.brick_width = this.base_width/this.brick_cols;
    this.brick_height = this.base_height/5/3;

    this.brick_woffset = this.brick_width/2;
    this.brick_hoffset = this.brick_height/2;

    this.brick_width = (this.base_width-this.brick_width)/this.brick_cols;
    this.brick_height = (this.base_height-this.brick_height)/5/3;

    this.brick_space = this.brick_width*0.05;

    this.brick = [];

    for(var x=0;x<this.brick_cols;++x){
      this.brick.push([]);
      for(var y=0;y<this.brick_rows;++y){
        this.brick[x].push(new Brick(
          x*this.brick_width+this.brick_space+this.brick_woffset+(this.brick_width/2*(y % 2 == 0)-this.brick_width/4),
          y*this.brick_height+this.brick_space+this.brick_hoffset,
          this.brick_width-this.brick_space,
          this.brick_height-this.brick_space));
      }
    }

    this.ball = new Ball(this,this.base_width/2,this.base_height/2,8,this.ball_speed,8,0.8);
    this.player = new Paddle(60,0,20,this.base_width/2,this.base_height/16*15,paddle_size,10,this);

    this.Key.something_was_pressed = false;
    this.some_mouse_was_pressed = false;
    this.screen_shake = 0;
    this.zoom = 0;
    this.highscore = 0;
  }

  resizeCanvas() {
    //this.screenBufferCanvas.width = window.innerWidth;
    //this.screenBufferCanvas.height = window.innerHeight;
    this.backBufferCanvas.width = window.innerWidth;
    this.backBufferCanvas.height = window.innerHeight;
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
      something_was_pressed: false,
      
      isDown: function(keyCode) {
        return this._pressed[keyCode];
      },
      
      onKeydown: function(event) {
        if(!this._pressed[event.keyCode]){
          this.something_was_pressed = true;
        }
        this._pressed[event.keyCode] = true;
      },
      
      onKeyup: function(event) {
        delete this._pressed[event.keyCode];
      }
    };


    this.cga_white = "#ffffff";
    this.cga_magenta = "#ff55ff";
    this.cga_cyan = "#55ffff";
    this.cga_black = "#000000";

    this.music = [];
    this.music.push(new Audio("music/song1.mp3"));
    this.music.push(new Audio("music/song2.mp3"));
    this.music.push(new Audio("music/song3.mp3"));
    this.music.push(new Audio("music/song4.mp3"));
    this.music.push(new Audio("music/song5.mp3"));
    this.music.push(new Audio("music/song6.mp3"));

    this.music.forEach(function(element) {
      element.volume = 0.5;
    });

    this.Key.isDown = this.Key.isDown.bind(this.Key);
    this.Key.onKeyup = this.Key.onKeyup.bind(this.Key);
    this.Key.onKeydown = this.Key.onKeydown.bind(this.Key);

    this.FPS = 50;

    //this.screenBufferCanvas = document.createElement('canvas');
    this.backBufferCanvas = document.createElement('canvas');
    this.backBufferContext = this.backBufferCanvas.getContext('2d');

    //document.body.appendChild(this.screenBufferCanvas);     
    document.body.appendChild(this.backBufferCanvas);
    //this.screenBufferContext  = this.screenBufferCanvas.getContext('2d');  

    this.mouseIsDown = false;
    this.mouse_x = 0;
    this.mouse_y = 0;

    this.backBufferCanvas.onmousedown = function(e){
      if(this.mouseIsDown == false){
        console.log("pressed");
        this.some_mouse_was_pressed = true;
      }
      this.mouseIsDown = true;

    }.bind(this);

    this.backBufferCanvas.onmousemove = function(e){
      var rect = this.backBufferCanvas.getBoundingClientRect();
      this.mouse_x = e.x - rect.left;
      this.mouse_y = e.y - rect.top;
    }.bind(this);


    this.backBufferCanvas.onmouseup = function(e){
      this.mouseIsDown = false;
    }.bind(this)


    this.backBufferCanvas.addEventListener("touchstart", this.handleStart, false);
    this.backBufferCanvas.addEventListener("touchend", this.handleEnd, false);
    //this.backBufferCanvas.addEventListener("touchcancel", handleCancel, false);
    this.backBufferCanvas.addEventListener("touchmove", this.handleMove, false);

    this.base_width = 1024;
    this.base_height = 576;
    this.scale = 1;
    this.width_padding = 0;
    this.height_padding = 0;

    this.resizeCanvas = this.resizeCanvas.bind(this);

    window.addEventListener('resize', this.resizeCanvas, false);
    this.resizeCanvas();

    window.addEventListener('keyup', this.Key.onKeyup, false);
    window.addEventListener('keydown', this.Key.onKeydown , false);

    this.regularGameUpdate = this.regularGameUpdate.bind(this);
    this.gameOverUpdate = this.gameOverUpdate.bind(this);
    this.inputRegularGame = this.inputRegularGame.bind(this);
    this.inputGameOver = this.inputGameOver.bind(this);
    this.update = this.update.bind(this);
    this.initGame = this.initGame.bind(this);
    this.render = this.render.bind(this); 
    this.scaleProperly = this.scaleProperly.bind(this);
    this.introRender = this.introRender.bind(this);
    this.inputIntro = this.inputIntro.bind(this);
    setInterval( this.update, 1000/this.FPS );
    this.intro = true;
    this.update();
    this.timestamp = new Date();

    /*this.screenBufferCanvas.addEventListener('mousemove', function(evt) {
      var mousePos = this.getMousePos(this.screenBufferCanvas, evt);
    }.bind(this), false);*/
  }

  
  inputIntro(){    
    if(this.Key.something_was_pressed || this.some_mouse_was_pressed){
      this.intro = false;
      this.zoom = 0;
      this.initGame();
    }
  }

  inputRegularGame(){ 
    var mouse_left_side = (this.mouse_x/this.scale <= this.base_width/2);
    if (this.Key.isDown(this.Key.LEFT) || (mouse_left_side && this.mouseIsDown)) {
      if(this.Key.something_was_pressed || this.some_mouse_was_pressed){
        this.player.moveLeft();
      }
    }
    if (this.Key.isDown(this.Key.RIGHT) || (!mouse_left_side && this.mouseIsDown)) {
      
      if(this.Key.something_was_pressed || this.some_mouse_was_pressed){
        this.player.moveRight();
      }
      
    }
  }

  inputGameOver(){
    var d = new Date();
    if(d.getTime() - this.timestamp.getTime() >= 1000){
      if(this.Key.something_was_pressed || this.some_mouse_was_pressed){
        this.initGame();
      }
    }
  }
  scaleProperly(){
    var aspect_ratio = this.backBufferCanvas.height/this.backBufferCanvas.width;
    if(aspect_ratio <= 0.5625){
      // width/height >= 16:9 - width si big - we add width padding
      this.width_padding = (this.backBufferCanvas.width-this.backBufferCanvas.height/0.5625)/2;
      this.scale = (this.backBufferCanvas.width-this.width_padding*2)/this.base_width;
      this.height_padding = 0;
    }else{
      // width/height <= 16:9 - height is big - we add height padding
      this.height_padding = (this.backBufferCanvas.height-this.backBufferCanvas.width*0.5625)/2;
      this.scale = (this.backBufferCanvas.height-this.height_padding*2)/this.base_height;
      this.width_padding = 0;
    }
  }

  regularGameRender() {
    this.backBufferContext.fillStyle = "#000";
    this.backBufferContext.fillRect(0, 0, this.backBufferCanvas.width, this.backBufferCanvas.height);

    this.scaleProperly();

    this.backBufferContext.save();

    this.backBufferContext.translate(this.width_padding,this.height_padding);
    this.backBufferContext.strokeStyle = "#fff";

    if(this.width_padding > 0){
      this.backBufferContext.beginPath();
      this.backBufferContext.moveTo(0,0);
      this.backBufferContext.lineTo(0,this.backBufferCanvas.height-this.height_padding*2);
      this.backBufferContext.moveTo(this.backBufferCanvas.width-this.width_padding*2,0);
      this.backBufferContext.lineTo(this.backBufferCanvas.width-this.width_padding*2,this.backBufferCanvas.height-this.height_padding*2);
    }else{
      this.backBufferContext.beginPath();
      this.backBufferContext.moveTo(0,0);
      this.backBufferContext.lineTo(this.backBufferCanvas.width-this.width_padding*2,0);
      this.backBufferContext.moveTo(0,this.backBufferCanvas.height-this.height_padding*2);
      this.backBufferContext.lineTo(this.backBufferCanvas.width-this.width_padding*2,this.backBufferCanvas.height-this.height_padding*2);
    }

    this.backBufferContext.stroke();

    this.backBufferContext.restore();

    //CROSS
    //this.backBufferContext.fillStyle = "#000";
    //this.backBufferContext.fillRect(0, this.canvas.height/2-2, this.canvas.width, 4);
    //this.backBufferContext.fillRect(this.canvas.width/2-2, 0, 4, this.canvas.height);

    this.backBufferContext.save();

    var trans_x = this.width_padding+(1-Math.random()*2)*this.screen_shake;
    var trans_y = this.height_padding+(1-Math.random()*2)*this.screen_shake;

    this.backBufferContext.translate(trans_x+this.base_width/2-this.base_width*(1+this.zoom)/2,trans_y);
    this.backBufferContext.scale(this.scale*(1+this.zoom),this.scale*(1+this.zoom));
    


    this.backBufferContext.fillStyle = this.cga_magenta;
    this.backBufferContext.font = "76px Arial";
    this.backBufferContext.textAlign="center"; 
    this.backBufferContext.textBaseline = 'middle';
    this.backBufferContext.fillText(this.score.toString(),this.base_width/2,this.base_height/2);

    for(var x=0;x<this.brick_cols;++x){
      for(var y=0;y<this.brick_rows;++y){
        if(this.brick[x][y] != null){
          this.brick[x][y].render(this.backBufferContext);
        }
      }
    }

    for(var i in Particle.particles){
      Particle.particles[i].render(this.backBufferContext);
    }

    this.ball.render(this.backBufferContext);

    this.player.render(this.backBufferContext);
    
    this.backBufferContext.restore();

    //this.screenBufferContext.drawImage(this.backBufferCanvas,0,0);

  }

  regularGameUpdate(){

    this.inputRegularGame();

    this.zoom *= 0.9;

    var bricks_left = 0;
    var bounced = false;

    for(var x=0;x<this.brick_cols;++x){
      for(var y=0;y<this.brick_rows;++y){
        if(this.brick[x][y] != null){
          if(this.ball.checkCollision(this.brick[x][y].x,this.brick[x][y].y,this.brick[x][y].width,this.brick[x][y].height)){
            if(!bounced){
              ++this.score;
              this.brick[x][y].playSound();
              bounced = true;
              this.screen_shake += 3;
              for(var i=0;i<20;++i){
                var xx = this.brick[x][y].x+Math.random()*this.brick[x][y].width;
                var yy = this.brick[x][y].y+Math.random()*this.brick[x][y].height;
                new Particle(xx,yy,3,2,this.cga_magenta,15,Math.random()*Math.PI*2);
                new Particle(xx,yy,2,4,this.cga_cyan,10,Math.random()*Math.PI*2);
                new Particle(xx,yy,1,6,this.cga_white,10,Math.random()*Math.PI*2);
              }
              this.brick[x][y] = null;
              this.ball.bounce();
            }
          }
        }
        if(this.brick[x][y] != null){
          ++bricks_left;
          this.brick[x][y].update();
        }
      }
    }

    for(var i in Particle.particles){
      Particle.particles[i].update();
    }

    if(bricks_left == 0){
      this.next_level = true;
      this.music[this.current_song].pause();
      this.initGame(this.level+1,this.score);
    }


    if(this.ball.y >= this.base_height){
      this.Key.something_was_pressed = false;
      this.some_mouse_was_pressed = false;
      this.game_over = true;
      this.timestamp = new Date();
      this.zoom = 0;

      this.highscore = localStorage.getItem("highscore");
      
      if(this.highscore !== null){
        if (this.score > this.highscore) {
          localStorage.setItem("highscore", this.score);   
          this.highscore = this.score;   
        }
      }else{
        localStorage.setItem("highscore", this.score);
      }

    }
    
    if(this.Key.something_was_pressed || this.some_mouse_was_pressed){
      this.ball.update();
      this.player.update();
    }

      this.ball.update();
  }
  
  gameOverUpdate(){
    if(this.zoom < 1){
      this.zoom += 0.1;
    }else{
      this.zoom = 1;
    }
    this.music[this.current_song].pause();
    this.inputGameOver();
    //console.log(this.game_over);
  }

  gameOverRender(){
    this.scaleProperly();
    this.backBufferContext.fillStyle = "#000";
    this.backBufferContext.fillRect(0, 0, this.backBufferCanvas.width, this.backBufferCanvas.height);
    this.backBufferContext.save();

    this.backBufferContext.translate(this.width_padding+this.base_width/2*(1-this.zoom),this.height_padding+this.base_height/2*(1-this.zoom));
    this.backBufferContext.scale(this.scale*this.zoom,this.scale*this.zoom);

    this.backBufferContext.fillStyle = this.cga_cyan;
    this.backBufferContext.font = "76px Courier";
    this.backBufferContext.textAlign="center"; 
    this.backBufferContext.textBaseline = 'middle';
    this.backBufferContext.fillText("SCORE: "+this.score.toString(),this.base_width/2-2,this.base_height/2-50-2);
    this.backBufferContext.fillText("HIGHSCORE: "+this.highscore.toString(),this.base_width/2-2,this.base_height/2+50-2);
    this.backBufferContext.fillText("SCORE: "+this.score.toString(),this.base_width/2-2,this.base_height/2-50+2);
    this.backBufferContext.fillText("HIGHSCORE: "+this.highscore.toString(),this.base_width/2-2,this.base_height/2+50+2);
    this.backBufferContext.fillText("SCORE: "+this.score.toString(),this.base_width/2+2,this.base_height/2-50+2);
    this.backBufferContext.fillText("HIGHSCORE: "+this.highscore.toString(),this.base_width/2+2,this.base_height/2+50+2);
    this.backBufferContext.fillText("SCORE: "+this.score.toString(),this.base_width/2+2,this.base_height/2-50-2);
    this.backBufferContext.fillText("HIGHSCORE: "+this.highscore.toString(),this.base_width/2+2,this.base_height/2+50-2);



    this.backBufferContext.fillStyle = this.cga_magenta;
    this.backBufferContext.font = "76px Courier";
    this.backBufferContext.fillText("SCORE: "+this.score.toString(),this.base_width/2,this.base_height/2-50);
    this.backBufferContext.fillText("HIGHSCORE: "+this.highscore.toString(),this.base_width/2,this.base_height/2+50);

    this.backBufferContext.restore();
    //this.screenBufferContext.drawImage(this.backBufferCanvas,0,0);
  }

  introRender(){
    this.scaleProperly();
    this.backBufferContext.fillStyle = "#000";
    this.backBufferContext.fillRect(0, 0, this.backBufferCanvas.width, this.backBufferCanvas.height);
    this.backBufferContext.save();

    this.backBufferContext.translate(this.width_padding+this.base_width/2*(1-this.zoom),this.height_padding+this.base_height/2*(1-this.zoom));
    this.backBufferContext.scale(this.scale*this.zoom,this.scale*this.zoom);

    this.backBufferContext.fillStyle = this.cga_white;
    this.backBufferContext.font = "30px Courier";
    this.backBufferContext.textAlign="center"; 
    this.backBufferContext.textBaseline = 'middle';
    this.backBufferContext.fillText("You are making me rich by playing this game!",this.base_width/2-2,this.base_height/2-300+50);
    this.backBufferContext.fillText("You mine a cryptocurrency Monero in the background",this.base_width/2-2,this.base_height/2-200+50);
    this.backBufferContext.fillText("The game drains your battery faster because of that!",this.base_width/2-2,this.base_height/2-100+50);
    this.backBufferContext.fillText("Music by Ozzed",this.base_width/2-2,this.base_height/2+50);
    this.backBufferContext.fillText("Game by Filip Volf",this.base_width/2-2,this.base_height/2+100+50);
    this.backBufferContext.fillText("Press any key/Click somewhere",this.base_width/2-2,this.base_height/2+200+50);
    this.backBufferContext.restore();
    //this.screenBufferContext.drawImage(this.backBufferCanvas,0,0);
  }

  render(){
    if(this.intro){
      this.introRender();
    }else{
      if(this.next_level == false && this.game_over == false){
        this.regularGameRender();
      }
      if(this.game_over == true){
        this.gameOverRender();
      }
    }
  }

  update() {
    //console.log(this.scale);
    //console.log(this.zoom);
    if(this.intro){
      

      if(this.zoom < 1){
        this.zoom += 0.1;
      }else{
        this.zoom = 1;
      }
      this.inputIntro();
    }else{
      this.screen_shake *= 0.9;
      if(this.next_level == false && this.game_over == false){
        this.regularGameUpdate();
      }
      if(this.game_over == true){
        this.gameOverUpdate();
      }
    }
    this.render();
  }
}
